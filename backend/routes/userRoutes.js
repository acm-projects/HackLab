const express = require('express');
const router = express.Router();
const User = require('../models/user'); // what we use for db interactions

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

router.post('/:id/skills', async (req, res) => { // add skills to user given id
    try {
        const { skill_id } = req.body;
        const newSkill = await User.addUserSkill(req.params.id, skill_id);
        res.status(201).json(newSkill); // success, send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
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

router.post('/:id/topics', async (req, res) => { // add topic to user
    try {
        const { topic_id } = req.body;
        const newTopic = await User.addUserTopic(req.params.id, topic_id);
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

// user_project routes
router.get('/:id/projects', async (req, res) => { // get projects for a user
    try {
        const projects = await User.getUserProjects(req.params.id);
        res.json(projects); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/projects', async (req, res) => { // add project to user
    try {
        const { project_id, role_id } = req.body;
        const newProject = await User.addUserProject(req.params.id, project_id, role_id);
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
router.get('/:id/liked-projects', async (req, res) => { // get liked projects from user
    try {
        const likedProjects = await User.getUserLikedProjects(req.params.id);
        res.json(likedProjects); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/liked-projects', async (req, res) => { // add liked project to user
    try {
        const { project_id } = req.body;
        const newLikedProject = await User.addUserLikedProject(req.params.id, project_id);
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
router.get('/:id/bookmarked-projects', async (req, res) => { // get users bookmarked projects
    try {
        const bookmarkedProjects = await User.getUserBookmarkedProjects(req.params.id);
        res.json(bookmarkedProjects); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/bookmarked-projects', async (req, res) => { // add a bookmarked project for user
    try {
        const { project_id } = req.body;
        const newBookmarkedProject = await User.addUserBookmarkedProject(req.params.id, project_id);
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
router.get('/:id/join-requests', async (req, res) => { // get a user's join requests
    try {
        const joinRequests = await User.getUserJoinRequests(req.params.id);
        res.json(joinRequests); // send to client
    } catch (error) {
        res.status(500).json({ error: error.message }); // server error
    }
});

router.post('/:id/join-requests', async (req, res) => { // add a join request for user
    try {
        const { project_id } = req.body;
        const newJoinRequest = await User.addUserJoinRequest(req.params.id, project_id);
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

module.exports = router;