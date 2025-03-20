const dotenv = require('dotenv');
const { Octokit } = require('octokit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');

dotenv.config();

const octokit = new Octokit({
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/*
let response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: 'octokit',
    repo: 'octokit.js',
  })*/

/*
let response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: 'ehallscherwitz',
    repo: 'SleptOnVintage.com',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })*/

async function getContext() {
    try {
        return await fs.readFile("data/resumeContext.txt", "utf-8");
    } catch (error) {
        console.error("Error reading context file:", error);
        return ""; // Return empty string if file read fails
    }
}

function extractOwnerAndRepo(github_repo_link) {
  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = github_repo_link.match(regex);
  if (match) {
    return { owner: match[1].toLowerCase(), repo: match[2].toLowerCase() };
  } else {
      throw new Error('Invalid GitHub repository link');
  }
}



let commitHistory = [];

const commitHistoryText = JSON.stringify(commitHistory);
//example link :https://github.com/LadybirdBrowser/ladybird
async function generateResume(github_repo_link) {
  //github_repo_link = 'https://github.com/LadybirdBrowser/ladybird';
  const { owner, repo } = extractOwnerAndRepo(github_repo_link);
  let response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: owner,
    repo: repo
  });
  let commitHistory = [];
  response.data.forEach(commit => {
    const author = commit.commit.author.name;
    const message = commit.commit.message;
    const commitText = `Author: ${author}\nMessage: ${message}`;
    commitHistory.push(commitText);
});
  const commitHistoryText = JSON.stringify(commitHistory);
  const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});
  const context = await getContext();
  const fullPrompt = `${context}\n\nProject Title: ${repo}\n\nCommit history: ${commitHistoryText}`;
  const result = await model.generateContent(fullPrompt, {response_format: "json"});
  const genResponse = await result.response;
  let text = genResponse.text();
  console.log(text);

  // Remove ```json from the response if present
  if (text.startsWith('```json')) {
    text = text.slice(7); // Remove the first 7 characters (```json)
  }
  // Remove trailing ``` if present
  if (text.endsWith('```')) {
      text = text.slice(0, -3); // Remove the last 3 characters (```)
  }

  let resumeData = JSON.parse(text);
  return resumeData;
};

module.exports = {
    generateResume
};
  