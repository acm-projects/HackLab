const express = require('express');
const { createProject, getAllProjects, getProjectById, getUsersByProjectId, getGithubById, updateProject, deleteProject, addSkillToProject, addTopicToProject, addTeamPreferenceToProject, getTeamPreferencesFromProject, deleteTeamPreferenceFromProject, getSkillsFromProject, deleteSkillFromProject, getTopicsFromProject, deleteTopicFromProject, markProjectComplete, getLinkedinByName, getProjectJoinRequests } = require('../models/projectModel');
const { generateProject } = require('../services/projectGen'); 
const { generateResume } = require('../services/resumeGen');
const { createRepo } = require('../services/createRepo');
const { scrapeLinkedIn } = require('../services/linkedin');
const User = require('../models/user');
const  upload  = require('../middleware/uploadMiddleware');
const { uploadImageToS3 } = require('../services/s3Service');
const router = express.Router();


// Create a new project
router.post('/', upload.single('thumbnail'), async (req, res) => {
    console.log('Received request to create project');
    const { accessToken, projectDataString, thumbnail, teamPreferences } = req.body; // Extract accessToken, projectData, and teamPreferences
    const projectData = JSON.parse(projectDataString); // Parse projectData JSON string
    const { title: repoName, short_description: repoDesc } = projectData;
    const image = req.file;

    // teamPreferences is just ids, ex [1,2,3]

    try {
        // Create a new repository on GitHub
        console.log('Creating repository on GitHub');
        const url = await createRepo(accessToken, repoName, repoDesc);

        // Add repository information to project data
        projectData.github_repo_url = url;

        // Handle thumbnail
        if (thumbnail) {
            console.log('Using provided thumbnail link: ' + thumbnail);
            projectData.thumbnail = thumbnail;
        } else if (image) {
            console.log('Uploading image to S3');
            const image_url = await uploadImageToS3(image);
            projectData.thumbnail = image_url;
        } else {
            projectData.thumbnail = "";
        }

        // Convert nested objects to JSON strings
        projectData.mvp = JSON.stringify(projectData.mvp);
        projectData.tech_stack = JSON.stringify(projectData.tech_stack);
        projectData.stretch = JSON.stringify(projectData.stretch);
        projectData.timeline = JSON.stringify(projectData.timeline);

        // Create project in the database
        console.log('Creating project in database');
        const project = await createProject(projectData);

        // Handle team preferences
        if (teamPreferences) {
            const parsedTeamPreferences = JSON.parse(teamPreferences); // Parse teamPreferences JSON string
            console.log('Adding team preferences:', parsedTeamPreferences);

            for (const role_preference_id of parsedTeamPreferences) {
                // Validate role_preference_id
                if (!role_preference_id) {
                    console.error('Invalid role_preference_id:', role_preference_id);
                    continue; // Skip invalid preferences
                }

                // Add team preference to the project with default xp = 0
                await addTeamPreferenceToProject(project.id, role_preference_id, 0);
            }
        }

        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).send('Server error');
    }
});

// Update a project
router.put('/:id',upload.single('thumbnail'), async (req, res) => {
    console.log('Received request to update project');
    const { projectDataString } = req.body;
    let projectData = JSON.parse(projectDataString);
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
            console.log('No image uploaded, using existing thumbnail');
            projectData.thumbnail = existingProject.thumbnail;
        }

        projectData.mvp = JSON.stringify(projectData.mvp);
        projectData.tech_stack = JSON.stringify(projectData.tech_stack);
        projectData.stretch = JSON.stringify(projectData.stretch);
        projectData.timeline = JSON.stringify(projectData.timeline);

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
    console.log('Received request to get all projects');
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
    console.log('Received request to get project by ID');
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

// Get users on a specific project
router.get('/:id/users', async (req, res) => {
    console.log('Received request to get users for a project');
    const { id: projectId } = req.params;
    try {
        const users = await getUsersByProjectId(projectId); // Fetch users from the user_project table
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found for this project' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users for project:', error);
        res.status(500).send('Server error');
    }
});

// Generate a project
router.post('/generateProject', async (req, res) => {
    try {
        const { prompt, name } = req.body;
        console.log(prompt);
        const project = await generateProject(prompt, name);
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Add skill to project
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

// Get skills for a project
router.get('/:projectId/skills', async (req, res) => {
    console.log('Received request to get skills for a project');
    const { projectId } = req.params;
    try {
        const result = await getSkillsFromProject(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting skills for project:', error);
        res.status(500).send('Server error');
    }
});

// Delete a skill from a project
router.delete('/:projectId/skills/:skillId', async (req, res) => {
    console.log('Received request to delete a skill from a project');
    const { projectId, skillId } = req.params;
    try {
        const result = await deleteSkillFromProject(projectId, skillId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting skill from project:', error);
        res.status(500).send('Server error');
    }
});

// Add topic to project
router.post('/:projectId/topics/:topicId', async (req, res) => {
    console.log('Received request to add topic to project');
    const { projectId, topicId } = req.params;
    try {
        const result = await addTopicToProject(projectId, topicId);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding topic to project:', error);
        res.status(500).send('Server error');
    }
});

// Get topics for a project
router.get('/:projectId/topics', async (req, res) => {
    console.log('Received request to get topics for a project');
    const { projectId } = req.params;
    try {
        const result = await getTopicsFromProject(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting topics for project:', error);
        res.status(500).send('Server error');
    }
});

// Delete a topic from a project
router.delete('/:projectId/topics/:topicId', async (req, res) => {
    console.log('Received request to delete a topic from a project');
    const { projectId, topicId } = req.params;
    try {
        const result = await deleteTopicFromProject(projectId, topicId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting topic from project:', error);
        res.status(500).send('Server error');
    }
});

// Add team preference to project
router.post('/:projectId/teamPreference', async (req, res) => {
    console.log('Received request to add team preference to project');
    const { projectId } = req.params;
    const { role_preference_id, xp } = req.body; // Expecting rolePreferenceId and xp in the request body

    try {
        const result = await addTeamPreferenceToProject(projectId, role_preference_id, xp);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding team preference to project:', error);
        res.status(500).send('Server error');
    }
});

// Get team preferences for a project
router.get('/:projectId/teamPreference', async (req, res) => {
    console.log('Received request to get team preferences for a project');
    const { projectId } = req.params;
    try {
        const result = await getTeamPreferencesFromProject(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting team preferences for project:', error);
        res.status(500).send('Server error');
    }
});

// Delete a team preference from a project
router.delete('/:projectId/teamPreference/:preferenceId', async (req, res) => {
    console.log('Received request to delete a team preference from a project');
    const { projectId, preferenceId } = req.params;
    try {
        const result = await deleteTeamPreferenceFromProject(projectId, preferenceId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting team preference from project:', error);
        res.status(500).send('Server error');
    }
});

// Mark a project as completed (now works with completion date)
router.patch('/:projectId/complete', async (req, res) => {
    //console.log('Received request to mark project as completed');
    const { projectId } = req.params;
    try {
        const result = await markProjectComplete(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error marking project as completed:', error);
        res.status(500).send('Server error');
    }
});

router.get('/:id/join-requests', async (req, res) => { // get a user's join requests
    try {
        const joinRequests = await getProjectJoinRequests(req.params.id);
        res.json(joinRequests); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});



module.exports = router;

