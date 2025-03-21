const express = require('express');
const { getAllSkills } = require('../models/skillModel');
const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
    try {
        const skills = await getAllSkills();
        res.json(skills);
    } catch (error) {
        console.error('Error getting skills:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;