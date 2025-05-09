const express = require('express');
const router = express.Router();
const User = require('../models/user'); // what we use for db interactions
const { getGithubById, getLinkedinByName, getProjectById } = require('../models/projectModel'); // what we use to get github link for project
const { generateResume } = require('../services/resumeGen');
const { scrapeLinkedIn } = require('../services/linkedin');
const { compileLatexToPdfStream } = require('../services/compileLatex'); // what we use to generate pdf from latex

/**************************
REMINDER:   get = access
            post = create
            put = change
            delete = remove
***************************/

// user table routes
router.get('/', async (req, res) => { // gets every user in user table
    try {
        const users = await User.getAllUsers();
        res.json(users); // send all users to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.get('/:id', async (req, res) => { // gets user given id
    try {
        const user = await User.getUserById(req.params.id);
        if (user) {
            res.json(user); // send user to client
        } else {
            res.status(404).json({ error: 'User not found' }); // error not found
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// haven't checked but should be good
router.put('/:id', async (req, res) => { // change info for user given id
    try {
        const updatedUser = await User.updateUser(req.params.id, req.body); // updates user
        if (updatedUser) {
            res.json(updatedUser); // send data back if successful
        } else {
            res.status(404).json({ error: 'User not found' }); // id not related to user
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// also haven't checked but should be good
router.delete('/:id', async (req, res) => { // delete user given id
    try {
        const isDeleted = await User.deleteUser(req.params.id); // delete user
        if (isDeleted) {
            res.status(204).send(); // success
        } else {
            res.status(404).json({ error: 'User not found' }); // no user for id
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// user_skill routes
router.get('/:id/skills', async (req, res) => { // get skills for user given id
    try {
        const skills = await User.getUserSkills(req.params.id);
        res.json(skills); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/skills/:skillID', async (req, res) => {
    try {
        const { id, skillID } = req.params; // Get id and skillID from URL parameters
        const newSkill = await User.addUserSkill(id, skillID); // Add skill to user
        res.status(201).json(newSkill); // Success, send the new skill to the client
    } catch (error) {
        res.status(500).json({ error: error.message }); // Server error
    }
});

router.delete('/:id/skills/:skillId', async (req, res) => { // delete a skill from a user given user id and skill id
    try {
        const isDeleted = await User.deleteUserSkill(req.params.id, req.params.skillId);
        if (isDeleted) {
            res.status(204).send(); // success
        } else {
            res.status(404).json({ error: 'Skill or User not found' }); // either id is incorrect
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// user_topic routes
router.get('/:id/topics', async (req, res) => { // get topics for given user id
    try {
        const topics = await User.getUserTopics(req.params.id);
        res.json(topics); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/topics/:topicID', async (req, res) => { // add topic to user
    try {
        const { id, topicID } = req.params;
        const newTopic = await User.addUserTopic(id, topicID);
        res.status(201).json(newTopic); // success, send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.delete('/:id/topics/:topicId', async (req, res) => { // delete topic from user given user id and topic id
    try {
        const isDeleted = await User.deleteUserTopic(req.params.id, req.params.topicId);
        if (isDeleted) {
            res.status(204).send(); // success
        } else {
            res.status(404).json({ error: 'Topic or User not found' }); // not found error
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// works
router.get('/:id/role', async (req, res) => {
    try {
        const role = await User.getUserRole(req.params.id);
        if (role) {
            res.json(role);
        } else {
            res.status(404).json({ error: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// works
router.post('/:id/role/:roleId', async (req, res) => {
    try {
        const updatedUser = await User.setUserRole(req.params.id, req.params.roleId);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id/role', async (req, res) => {
    try {
        const updatedUser = await User.clearUserRole(req.params.id);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// user_project routes
// will return project_id and role_id's for the user, not the actual project information and stuff
router.get('/:id/projects', async (req, res) => { // get projects for a user
    try {
        const projects = await User.getUserProjects(req.params.id);
        res.json(projects); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/projects/:projectID/:roleID', async (req, res) => { // add project to user
    try {
        const { id, projectID, roleID } = req.params;
        const newProject = await User.addUserProject(id, projectID, roleID);
        res.status(201).json(newProject); // success, send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.delete('/:id/projects/:projectId', async (req, res) => { // delete project from user
    try {
        const isDeleted = await User.deleteUserProject(req.params.id, req.params.projectId);
        if (isDeleted) {
            res.status(204).send(); // success
        } else {
            res.status(404).json({ error: 'Project or User not found' }); // not found error
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// user_likes_project routes
// will return the project id's not the actual projects
router.get('/:id/liked-projects', async (req, res) => { // get liked projects from user
    try {
        const likedProjects = await User.getUserLikedProjects(req.params.id);
        res.json(likedProjects); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/liked-projects/:projectID', async (req, res) => { // add liked project to user
    try {
        const { id, projectID } = req.params;
        const newLikedProject = await User.addUserLikedProject(id, projectID);
        res.status(201).json(newLikedProject); // success, send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.delete('/:id/liked-projects/:projectId', async (req, res) => { // remove liked project for user
    try {
        const isDeleted = await User.deleteUserLikedProject(req.params.id, req.params.projectId);
        if (isDeleted) {
            res.status(204).send(); // success
        } else {
            res.status(404).json({ error: 'Project or User not found' }); // not found error
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// user_bookmarks_project routes
// will return the project id's not the actual projects
router.get('/:id/bookmarked-projects', async (req, res) => { // get users bookmarked projects
    try {
        const bookmarkedProjects = await User.getUserBookmarkedProjects(req.params.id);
        res.json(bookmarkedProjects); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/bookmarked-projects/:projectID', async (req, res) => { // add a bookmarked project for user
    try {
        const { id, projectID } = req.params;
        const newBookmarkedProject = await User.addUserBookmarkedProject(id, projectID);
        res.status(201).json(newBookmarkedProject); // success, send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.delete('/:id/bookmarked-projects/:projectId', async (req, res) => { // remove a bookmarked project for user
    try {
        const isDeleted = await User.deleteUserBookmarkedProject(req.params.id, req.params.projectId);
        if (isDeleted) {
            res.status(204).send(); // success
        } else {
            res.status(404).json({ error: 'Project or User not found' }); // not found error
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// user_project_join_request routes
// will return project id's not the actual projects
router.get('/:id/join-requests', async (req, res) => { // get a user's join requests
    try {
        const joinRequests = await User.getUserJoinRequests(req.params.id);
        res.json(joinRequests); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/join-requests/:projectID', async (req, res) => { // add a join request for user
    try {
        const { id, projectID } = req.params;
        console.log('RECEIVED JOIN REQUEST FOR USER:', id, 'FOR PROJECT:', projectID);
        const newJoinRequest = await User.addUserJoinRequest(id, projectID);
        res.status(201).json(newJoinRequest); // success, send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.delete('/:id/join-requests/:projectId', async (req, res) => { // remove join request for project from user
    try {
        const isDeleted = await User.deleteUserJoinRequest(req.params.id, req.params.projectId);
        if (isDeleted) {
            res.status(204).send(); // success
        } else {
            res.status(404).json({ error: 'Join Request or User not found' }); // not found error
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

// New endpoint to fetch saved resume
router.get('/:id/resume', async (req, res) => {
    try {
        const data = await User.getResumeData(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

/*
    I believe it would be harder for the frontend if we ask them for the linkedin
    because this is not one of the things that is stored in the session like name
    or github name. its better if we just find it ouserlves because it is already stored
    in the backend. same with github link, no reason to ask them for it if we can get it
    using the project id.
    Changed to a post request because get request cannot have a body
*/
router.post('/:id/generateResume', async (req, res) => {
    try {
        const { github_username, db_name } = req.body;

        // Get an array of project IDs associated with the user
        const projectIDs = await User.getUserCompletedProjectIDs(req.params.id);

        console.log('This is the projectIDs:', projectIDs);

        if (!projectIDs || projectIDs.length === 0) {
            return res.status(404).send('No projects found for this user');
        }

        // Fetch GitHub links and project dates
        const githubReposWithDates = [];
        for (const id of projectIDs) {
            const githubLink = await getGithubById(id);
            const project = await getProjectById(id); // Fetch project details, including creation_date and completed_date
            if (githubLink && project) {
                githubReposWithDates.push({
                    repo: githubLink,
                    creation_date: project.creation_date, // Changed from start_date to creation_date
                    completion_date: project.completion_date,
                });
            }
        }

        if (githubReposWithDates.length === 0) {
            return res.status(404).send('No GitHub links found for this user');
        }

        const linkedin = await getLinkedinByName(db_name);
        if (!linkedin) {
            return res.status(404).send('LinkedIn link not found for this user');
        }

        console.log('This is the github_username:', github_username);
        console.log('This is the db_name:', db_name);
        console.log('This is the githubReposWithDates:', githubReposWithDates);
        console.log('This is the linkedin:', linkedin);

        // Input validation
        if (!githubReposWithDates || !github_username) {
            return res.status(400).send('GitHub link and username are required');
        }

        // Scrape LinkedIn data
        let linkedinData = [];
        try {
            const scrapedData = await scrapeLinkedIn(linkedin);
            linkedinData = Array.isArray(scrapedData) ? scrapedData : [];
        } catch (error) {
            console.error('Error scraping LinkedIn:', error);
            linkedinData = [];
        }

        // Prepare user details with fallbacks
        const userDetails = {
            github_username,
            db_name,
            linkedin,
            fullName: linkedinData[0]?.fullName || db_name,
            experience: JSON.stringify(linkedinData[0]?.experience) || [],
            education: JSON.stringify(linkedinData[0]?.education) || [],
            public_identifier: linkedinData[0]?.public_identifier || '',
            headline: linkedinData[0]?.headline || '',
        };

        console.log('Generated userDetails:', userDetails);

        // Generate resume
        let resume = await generateResume(githubReposWithDates, userDetails);

        if (resume.startsWith('```latex')) {
            resume = resume.replace(/^```latex\s*/, '').replace(/\s*```$/, '');
        }

        // Save to user table
        await User.saveResumeData(db_name, resume, linkedin);

        try {
            console.log('Compiling LaTeX to PDF...');
            await compileLatexToPdfStream(resume, res);
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Failed to generate PDF');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;