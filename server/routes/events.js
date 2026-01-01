const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events ORDER BY date ASC');
        res.json({ data: result.rows, error: null });
    } catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Add event
router.post('/', async (req, res) => {
    try {
        const { title, date, location, description, image_url } = req.body;

        if (!title || !date || !location || !description) {
            return res.status(400).json({ data: null, error: 'Title, date, location, and description required' });
        }

        const result = await db.query(
            'INSERT INTO events (title, date, location, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, date, location, description, image_url || null]
        );

        res.json({ data: result.rows, error: null });
    } catch (error) {
        console.error('Add event error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM events WHERE id = $1', [id]);
        res.json({ error: null });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
