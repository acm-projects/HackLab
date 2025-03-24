const express = require('express');
const { getAllTopics, getTopicById } = require('../models/topicModel');
const router = express.Router();

// Get all topics
router.get('/', async (req, res) => {
    try {
        const topics = await getAllTopics();
        res.json(topics);
    } catch (error) {
        console.error('Error getting topics:', error);
        res.status(500).send('Server error');
    }
});

// Get topic by ID
router.get('/:id', async (req, res) => {
    try {
        const topic = await getTopicById(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        res.json(topic);
    } catch (error) {
        console.error('Error getting topic by ID:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;