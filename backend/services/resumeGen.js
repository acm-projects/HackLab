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

async function generateResume(github, userDetails) {
  const { owner, repo } = extractOwnerAndRepo(github);
  const octokit = await getOctokitInstance();

  // Fetch commit history
  let response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: owner,
    repo: repo
  });

  // THIS ONLY WORKS IF userDetails.github_username is the actual username which we currently don't store
  let commitHistory = response.data
    .filter(commit => commit.commit.author.name.toLowerCase() === userDetails.github_username.toLowerCase())
    .map(commit => ({
      author: commit.commit.author.name,
      message: commit.commit.message
    }));

  const commitHistoryText = JSON.stringify(commitHistory);
    console.log(commitHistoryText);
  // Use LinkedIn data if available, otherwise use realistic placeholders
  const name = userDetails.name || userDetails.github_username;
  const experiences = userDetails.experiences?.length ? JSON.stringify(userDetails.experiences) : JSON.stringify([
    { company: "TechCorp Inc.", title: "Software Engineer", duration: "2021 - Present", description: "Developed high-traffic web applications using React and Node.js, handling 10,000+ daily requests with 99.9% uptime. Spearheaded the migration from legacy jQuery to React/Redux, reducing production bugs by 60% while mentoring junior team members. Optimized DevOps processes by implementing GitHub Actions CI/CD pipelines, cutting deployment times from 15 minutes to under 3 minutes." },
    { company: "StartupX", title: "Backend Developer Intern", duration: "2020 - 2021", description: "Designed and optimized Python/Flask APIs, improving response times by 40% through Redis caching and MongoDB query tuning. Integrated critical business systems including Stripe payments and SendGrid email, enabling $50K+ in annual revenue. Automated infrastructure deployments using Bash and Ansible, saving 20+ engineering hours per month." }
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
  const linkedinLink = userDetails.linkedin || `linkedin.com/in/${userDetails.github_username}`;
  const user = await User.getUserById(Chat.getUserID(userDetails.github_username));
  const email = user?.email || `${userDetails.github_username}@gmail.com`; // fallback in case it's undefined  
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
