const express = require('express');
const { getAllRoles, getRoleById } = require('../models/roleModel');
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

// Get role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await getRoleById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        console.error('Error getting role by ID:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;