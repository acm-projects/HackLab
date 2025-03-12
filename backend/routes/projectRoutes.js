const express = require('express');
const { createProject, getAllProjects, getProjectById } = require('../models/projectModel');
const { generateProject } = require('../services/aiService');
const { createRepo } = require('../services/createRepo');
const  upload  = require('../middleware/uploadMiddleware');
const { uploadImageToS3 } = require('../services/s3Service');
const router = express.Router();

//upload.single('thumbnail'), 
// Create a new project
router.post('/',upload.single('thumbnail'), async (req, res) => {
    console.log('Received request to create project');
    console.log(req.body);
    const { accessToken, ...projectData } = req.body;
    const repoName = projectData.title;
    const repoDesc = projectData.short_description;
    const image = req.file;
    try {
        // Create a new repository on GitHub
        console.log('Creating repository on GitHub');
        const url = await createRepo(accessToken, repoName, repoDesc);

        // Add repository information to project data
        projectData.github_repo_url = url;

        // store image file if user uploads a thumbnail
        if (image) {
            console.log('Uploading image to S3');
            const image_url = await uploadImageToS3(image);
            projectData.thumbnail = image_url;
        }
        else
        {
            projectData.thumbnail = "";
        }

        //create project in database
        console.log('Creating project in database');
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

