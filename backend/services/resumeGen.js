const dotenv = require('dotenv');
const { Octokit } = require('octokit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');

dotenv.config();

const octokit = new Octokit({ 
//auth: process.env.GITHUB_API_KEY
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
  owner: 'ladybirdbrowser',
  repo: 'ladybird',
})

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
        return await fs.readFile("context.txt", "utf-8");
    } catch (error) {
        console.error("Error reading context file:", error);
        return ""; // Return empty string if file read fails
    }
}

let commitHistory = [];

response.data.forEach(commit => {
    const author = commit.commit.author.name;
    const message = commit.commit.message;
    const commitText = `Author: ${author}\nMessage: ${message}`;
    commitHistory.push(commitText);
});

console.log(commitHistory);

const commitHistoryText = JSON.stringify(commitHistory);

async function generateResume() {
  const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});
  const context = await getContext();
  const fullPrompt = `${context}\n\nCommit history: ${commitHistoryText}`;
  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
};

module.exports = {
    generateResume
};
  