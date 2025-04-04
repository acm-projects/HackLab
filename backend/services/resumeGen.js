const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');

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

async function generateResume(github, userDetails) {
  const { owner, repo } = extractOwnerAndRepo(github);
  const octokit = await getOctokitInstance();

  // Fetch commit history
  let response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: owner,
    repo: repo
  });

  let commitHistory = response.data
    .filter(commit => commit.commit.author.name.toLowerCase() === userDetails.github_username.toLowerCase())
    .map(commit => ({
      author: commit.commit.author.name,
      message: commit.commit.message
    }));

  const commitHistoryText = JSON.stringify(commitHistory);

  // Use LinkedIn data if available, otherwise use realistic placeholders
  const name = userDetails.name || "Alex Johnson";
  const experiences = userDetails.experiences?.length ? JSON.stringify(userDetails.experiences) : JSON.stringify([
    { company: "TechCorp Inc.", title: "Software Engineer", duration: "2021 - Present", description: "Developed and maintained web applications using JavaScript, React, and Node.js." },
    { company: "StartupX", title: "Backend Developer Intern", duration: "2020 - 2021", description: "Worked on API integrations and database optimizations for an early-stage startup." }
  ]);
  const education = userDetails.educations?.length ? JSON.stringify(userDetails.educations) : JSON.stringify([
    { institution: "University of Example", degree: "B.Sc. in Computer Science", year: "2017 - 2021" }
  ]);
  const accomplishments = userDetails.accomplishments?.length ? JSON.stringify(userDetails.accomplishments) : JSON.stringify([
    "Published a research paper on AI-driven automation.",
    "Built a popular open-source library with 10,000+ downloads."
  ]);
  const jobTitle = userDetails.job_title || "Software Engineer";
  const company = userDetails.company || "TechCorp Inc.";

  // Construct AI prompt
  const context = await getContext();
  const fullPrompt = `
    ${context}

    ## User Details
    - **Name:** ${name}
    - **Job Title:** ${jobTitle}
    - **Company:** ${company}
    - **Education:** ${education}
    - **Experiences:** ${experiences}
    - **Accomplishments:** ${accomplishments}

    ## Project Contribution
    - **Project Title:** ${repo}
    - **Commit History:** ${commitHistoryText}
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(fullPrompt, { response_format: "text" });
  const latexResume = await result.response.text();

  console.log("Generated LaTeX Resume:\n", latexResume);

  return latexResume;
}

module.exports = {
  generateResume
};
