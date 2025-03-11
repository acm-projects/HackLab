const express = require('express');
const { createProject, getAllProjects, getProjectById } = require('../models/projectModel');
const { generateProject } = require('../services/aiService');
const { createRepo } = require('../services/createRepo');
const router = express.Router();

// Create a new project
router.post('/', async (req, res) => {
    const { accessToken, ...projectData } = req.body;
    const repoName = projectData.title;
    const repoDesc = projectData.short_description;
    try {
        // Create a new repository on GitHub
        const url = await createRepo(accessToken, repoName, repoDesc);

        // Add repository information to project data
        projectData.github_repo_url = url;

        //create project in database
        const project = await createProject(projectData);
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get a specific project
router.get('/:id', async (req, res) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Generate a project from AI prompt
router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        const project = await generateProject(prompt);
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;

