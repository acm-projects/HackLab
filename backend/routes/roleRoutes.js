const express = require('express');
const { getAllRoles } = require('../models/roleModel');
const router = express.Router();

// Get all roles
router.get('/', async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.json(roles);
    } catch (error) {
        console.error('Error getting roles:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;