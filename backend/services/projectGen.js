const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');
const { imageGen } = require('./imageGen');

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

async function generateProject(prompt) {
    userPrompt = prompt;
    console.log(userPrompt);
    const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

    //const userPrompt = "A coding project called HackLab that lets you create projects and find other peoples projects to collaborate on. With gamifying features.";
    const context = await getContext();
    const fullPrompt = `${context}\n\nUser Query: ${userPrompt}`;
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

    let myText = JSON.parse(text);
    let imagePrompt = myText.title;
    
    imageGen(imagePrompt);

    return JSON.parse(text);
}

module.exports = {
    generateProject
};