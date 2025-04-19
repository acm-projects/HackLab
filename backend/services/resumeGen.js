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
  let allCommits = [];
  let page = 1;

  try {
    while (true) {
      console.log(`Fetching page ${page} of commit history for ${owner}/${repo}`);

      // Fetch a single page of commits
      const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: owner,
        repo: repo,
        per_page: 100, // Maximum allowed by GitHub API
        page: page,
      });

      // Add the current page of commits to the full list
      allCommits = allCommits.concat(response.data);

      // Check if there are more pages
      if (response.data.length < 100) {
        // If the number of commits returned is less than `per_page`, we've reached the last page
        break;
      }

      page++;
    }

    console.log(`Fetched ${allCommits.length} commits for ${owner}/${repo}`);
    return allCommits;
  } catch (error) {
    console.error(`Failed to fetch commit history for ${owner}/${repo}:`, error.message);
    return []; // Return an empty array if the request fails
  }
}

async function generateResume(githubRepos, userDetails) {
  const octokit = await getOctokitInstance();

  // Limit the number of repositories to 3
  const limitedRepos = githubRepos.slice(0, 3);

  console.log("Repos to be used in resume:", limitedRepos);

  // Fetch commit histories in parallel
  const allCommitHistories = await Promise.all(
    limitedRepos.map(async (github) => {
      try {
        console.log("Fetching commit history for:", github);

        const { owner, repo } = extractOwnerAndRepo(github);

        // Fetch the full commit history
        const fullCommitHistory = await fetchFullCommitHistory(octokit, owner, repo);

        // Filter commits by the user's GitHub name
        const filteredCommits = fullCommitHistory
          .filter(commit => {
            const authorName = commit.commit.author?.name?.toLowerCase();
            const expectedUsername = userDetails.db_name.toLowerCase();

            // Log the author name and expected username for debugging
            console.log(`Author Name: ${authorName}, Expected Username: ${expectedUsername}`);

            return authorName === expectedUsername;
          })
          .map(commit => ({
            repo: repo, // Include the repository name for context
            author: commit.commit.author.name,
            message: commit.commit.message,
          }));

        console.log("Filtered commit history for repo:", repo, filteredCommits);

        return filteredCommits;
      } catch (error) {
        console.error(`Failed to fetch commit history for repository ${github}:`, error.message);
        return []; // Return an empty array if the request fails
      }
    })
  );

  // Flatten the array of arrays into a single array
  const flattenedCommitHistories = allCommitHistories.flat();

  console.log("All Commit Histories:", flattenedCommitHistories);

  const commitHistoryText = JSON.stringify(flattenedCommitHistories);
  console.log(commitHistoryText);

  // Continue with the rest of the generateResume logic...
  const name = userDetails.name || userDetails.db_name;
  const experiences = userDetails.experiences?.length
    ? JSON.stringify(userDetails.experiences)
    : JSON.stringify([
        {
          company: "TechCorp Inc.",
          title: "Software Engineer",
          duration: "2021 - Present",
          description:
            "Developed high-traffic web applications using React and Node.js, handling 10,000+ daily requests with 99.9% uptime. Spearheaded the migration from legacy jQuery to React/Redux, reducing production bugs by 60% while mentoring junior team members. Optimized DevOps processes by implementing GitHub Actions CI/CD pipelines, cutting deployment times from 15 minutes to under 3 minutes.",
        },
        {
          company: "StartupX",
          title: "Backend Developer Intern",
          duration: "2020 - 2021",
          description:
            "Designed and optimized Python/Flask APIs, improving response times by 40% through Redis caching and MongoDB query tuning. Integrated critical business systems including Stripe payments and SendGrid email, enabling $50K+ in annual revenue. Automated infrastructure deployments using Bash and Ansible, saving 20+ engineering hours per month.",
        },
      ]);
  const education = userDetails.educations?.length
    ? JSON.stringify(userDetails.educations)
    : JSON.stringify([
        {
          institution: "University of Example",
          degree: "B.Sc. in Computer Science",
          year: "2017 - 2021",
        },
      ]);
  const jobTitle = userDetails.job_title || "Software Engineer";
  const company = userDetails.company || "TechCorp Inc.";
  const linkedinLink =
    userDetails.linkedin || `linkedin.com/in/${userDetails.github_username}`;
  const user = await User.getUserById(await Chat.getUserID(userDetails.db_name));
  const email =
    user?.email || `${userDetails.github_username}@gmail.com`; // fallback in case it's undefined
  // Construct AI prompt
  const context = await getContext();
  const fullPrompt = `
    ${context}

    ## User Details
    - **Name:** ${name}
    - **Email:** ${email}
    - **Linkedin link:** ${linkedinLink}
    - **GitHub link:** github.com/${userDetails.github_username}
    - **Job Title:** ${jobTitle}
    - **Company:** ${company}
    - **Education:** ${education}
    - **Experiences:** ${experiences}

    ## Project Contribution
    - **Commit History:** ${commitHistoryText}
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
