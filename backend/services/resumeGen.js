const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');
const Chat = require('../models/chat'); // Import the Chat model
const User = require('../models/user'); // what we use for db interactions

dotenv.config();

async function getOctokitInstance() {
  const { Octokit } = await import('octokit');
  return new Octokit({});
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getContext() {
  try {
    return await fs.readFile("data/resumeContext.txt", "utf-8");
  } catch (error) {
    console.error("Error reading context file:", error);
    return ""; // Return empty string if file read fails
  }
}

function extractOwnerAndRepo(github) {
  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = github.match(regex);
  if (match) {
    return { owner: match[1].toLowerCase(), repo: match[2].toLowerCase() };
  } else {
    throw new Error('Invalid GitHub repository link');
  }
}

async function fetchFullCommitHistory(octokit, owner, repo) {
  try {
    // Step 1: Fetch all branches
    console.log(`Fetching branches for ${owner}/${repo}`);
    const branchesResponse = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: owner,
      repo: repo,
    });

    const branches = branchesResponse.data.map(branch => branch.name);
    console.log(`Branches found for ${owner}/${repo}:`, branches);

    // Step 2: Fetch commits for all branches in parallel
    const allCommits = await Promise.all(
      branches.map(async (branch) => {
        let branchCommits = [];
        let page = 1;

        while (true) {
          //console.log(`Fetching commits for branch ${branch}, page ${page} in ${owner}/${repo}`);

          // Fetch a single page of commits for the current branch
          const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: owner,
            repo: repo,
            sha: branch, // Specify the branch name
            per_page: 100, // Maximum allowed by GitHub API
            page: page,
          });

          // Add the current page of commits to the branch's commit list
          branchCommits = branchCommits.concat(response.data);

          // Check if there are more pages
          if (response.data.length < 100) {
            // If the number of commits returned is less than `per_page`, we've reached the last page
            break;
          }

          page++;
        }

        //console.log(`Fetched ${branchCommits.length} commits for branch ${branch} in ${owner}/${repo}`);
        return branchCommits;
      })
    );

    // Flatten the array of arrays into a single array of commits
    const flattenedCommits = allCommits.flat();

    //console.log(`Fetched ${flattenedCommits.length} total commits for ${owner}/${repo}`);
    return flattenedCommits;
  } catch (error) {
    console.error(`Failed to fetch commit history for ${owner}/${repo}:`, error.message);
    return []; // Return an empty array if the request fails
  }
};

async function generateResume(githubReposWithDates, userDetails) {
  const octokit = await getOctokitInstance();

  // Limit the number of repositories to 3
  const limitedRepos = githubReposWithDates;

  console.log("Repos to be used in resume:", limitedRepos);

  // Fetch commit histories in parallel
  const allCommitHistories = await Promise.all(
      limitedRepos.map(async ({ repo, creation_date, completion_date }) => {
          try {
              console.log("Fetching commit history for:", repo);

              const { owner, repo: repoName } = extractOwnerAndRepo(repo);

              // Fetch the full commit history
              const fullCommitHistory = await fetchFullCommitHistory(octokit, owner, repoName);

              // Filter commits by the user's GitHub name
              const filteredCommits = fullCommitHistory
                  .filter(commit => {
                      const authorName = commit.commit.author?.name?.toLowerCase();
                      const expectedUsername = userDetails.db_name.toLowerCase();

                      return authorName === expectedUsername;
                  })
                  .map(commit => ({
                      repo: repoName, // Include the repository name for context
                      author: commit.commit.author.name,
                      message: commit.commit.message,
                  }));

              console.log("Filtered commit history for repo:", repoName, filteredCommits);

              return {
                  repo: repo,
                  creation_date, // Changed from start_date to creation_date
                  completion_date,
                  commits: filteredCommits,
              };
          } catch (error) {
              console.error(`Failed to fetch commit history for repository ${repo}:`, error.message);
              return {
                  repo: repo,
                  creation_date, // Changed from start_date to creation_date
                  completion_date,
                  commits: [],
              }; // Return an empty array if the request fails
          }
      })
  );

  // Flatten the array of arrays into a single array
  const flattenedCommitHistories = allCommitHistories.flat();

  const commitHistoryText = JSON.stringify(flattenedCommitHistories);

  console.log("All Commit Histories with Dates:", commitHistorytext);

  // Continue with the rest of the generateResume logic...
  const context = await getContext();
  const fullPrompt = `
      ${context}

      ## User Details
      - **Name:** ${userDetails.fullName}
      - **Email:** ${userDetails.email || `${userDetails.github_username}@gmail.com`}
      - **Linkedin link:** ${userDetails.linkedin}
      - **GitHub link:** github.com/${userDetails.github_username}
      - **Education:** ${userDetails.education}
      - **Experiences:** ${userDetails.experience}

      ## Project Contribution
      - **Commit History with Dates:** ${commitHistoryText}
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(fullPrompt, {
      response_format: "text",
  });
  const latexResume = await result.response.text();

  console.log("Generated LaTeX Resume:\n", latexResume);

  return latexResume;
}

module.exports = {
  generateResume
};
