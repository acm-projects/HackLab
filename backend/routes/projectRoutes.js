const express = require('express');
const pool = require('../db');
const router = express.Router();

// Create a new project
router.post('/', async (req, res) => {
    const { title, description, short_description, thumbnail, type, mvp, stretch, timeline, team_lead_id, creation_date } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO project (title, description, short_description, thumbnail, type, mvp, stretch, timeline, team_lead_id, creation_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [title, description, short_description, thumbnail, type, mvp, stretch, timeline, team_lead_id, creation_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get all projects
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM project');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get a specific project
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM project WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;

