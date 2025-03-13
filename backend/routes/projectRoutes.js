const express = require('express');
const { createProject, getAllProjects, getProjectById, getGithubById, updateProject, deleteProject } = require('../models/projectModel');
const { generateProject } = require('../services/projectGen');
const { generateResume } = require('../services/resumeGen');
const { createRepo } = require('../services/createRepo');
const  upload  = require('../middleware/uploadMiddleware');
const { uploadImageToS3 } = require('../services/s3Service');
const router = express.Router();

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

// update a project
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
    console.log('Received request to update project');
    const { accessToken, ...projectData } = req.body;
    const image = req.file;
    try {
        // Get the existing project
        const existingProject = await getProjectById(req.params.id);
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Store image file if user uploads a thumbnail
        if (image) {
            console.log('Uploading image to S3');
            const image_url = await uploadImageToS3(image);
            projectData.thumbnail = image_url;
        }
        else {
            projectData.thumbnail = existingProject.thumbnail;
        }

        // Update project in database
        console.log('Updating project in database');
        const updatedProject = await updateProject(req.params.id, projectData);
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).send('Server error');
    }
});

// Delete a project
router.delete('/:id', async (req, res) => {
    console.log('Received request to delete project');
    try {
        const deletedProject = await deleteProject(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(deletedProject);
    } catch (error) {
        console.error('Error deleting project:', error);
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
router.post('/generateProject', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log(prompt);
        const project = await generateProject(prompt);
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Generate resumes for everyone on a project
router.get('/:id/generateResume', async (req, res) => {
    try {
        const github_repo_link = await getGithubById(req.params.id);
        if (!github_repo_link) {
            return res.status(404).json({ message: 'Project not found' });
        }
        console.log('Generating Resume...')
        const resume = await generateResume(github_repo_link);
        res.json(resume);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// add skill to project
router.post('/:projectId/skills/:skillId', async (req, res) => {
    console.log('Received request to add skill to project');
    const { projectId, skillId } = req.params;
    try {
        const result = await addSkillToProject(projectId, skillId);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding skill to project:', error);
        res.status(500).send('Server error');
    }
});

// add topic to project



module.exports = router;

