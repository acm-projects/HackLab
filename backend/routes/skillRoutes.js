const express = require('express');
const { getAllSkills, getSkillById } = require('../models/skillModel');
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

// Get skill by ID
router.get('/:id', async (req, res) => {
    try {
        const skill = await getSkillById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(skill);
    } catch (error) {
        console.error('Error getting skill by ID:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;