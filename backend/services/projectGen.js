const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs/promises');
// const { image_gen } = require('./gen-test.mjs');

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
    const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

    const userPrompt = "A coding project called HackLab that lets you create projects and find other peoples projects to collaborate on. With gamifying features.";
    const context = await getContext();
    const fullPrompt = `${context}\n\nUser Query: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return JSON.parse(text);

    const imageContext = "Create a logo for a website/app that is called: "

    let myText = JSON.parse(text);
    let imagePrompt = myText.title;

    const fullImagePrompt = `${imageContext} ${imagePrompt}`;

    //image_gen(fullImagePrompt);
}

module.exports = {
    generateProject
};