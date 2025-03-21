const express = require('express');
const { getAllTopics } = require('../models/topicModel');
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

module.exports = router;