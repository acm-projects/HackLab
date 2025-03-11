const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update user profile
router.put('/:id', async (req, res) => {
    const { name, email, bio, xp, role_preference_id } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, bio = $3, xp = $4, role_preference_id = $5 WHERE id = $6 RETURNING *',
            [name, email, bio, xp, role_preference_id, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

//user_likes_project routes here

module.exports = router;

