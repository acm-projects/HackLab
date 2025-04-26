const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');
const { imageGen } = require('./imageGen');
const User = require('../models/user');

dotenv.config();

async function getContext() {
    try {
        return await fs.readFile("data/context.txt", "utf-8");
    } catch (error) {
        console.error("Error reading context file:", error);
        return ""; // Return empty string if file read fails
    }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateProject(prompt, name) {
    userPrompt = prompt;
    const user = await User.getUserByName(name);
    const userXP = user.xp;
    const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});
    const userSkills = await User.getUserSkills(user.id);

    console.log("These are the users skills: ", userSkills);

    //const userPrompt = "A coding project called HackLab that lets you create projects and find other peoples projects to collaborate on. With gamifying features.";
    const context = await getContext();
    const fullPrompt = `${context}\n\nUser Query: ${userPrompt}\n\nUser XP: ${userXP}\n\nUsers Skills: ${userSkills}`;
    const result = await model.generateContent(fullPrompt, {response_format: "json"});
    const response = await result.response;
    let text = response.text();
    console.log(text);

    // Remove ```json from the response if present
    if (text.startsWith('```json')) {
        text = text.slice(7); // Remove the first 7 characters (```json)
    }
    // Remove trailing ``` if present
    if (text.endsWith('```')) {
        text = text.slice(0, -3); // Remove the last 3 characters (```)
    }

    let projectData = JSON.parse(text);
    let imagePrompt = projectData.title;
    
    let image_url = await imageGen(imagePrompt);

    projectData.thumbnail = image_url;

    return projectData;
}

module.exports = {
    generateProject
};