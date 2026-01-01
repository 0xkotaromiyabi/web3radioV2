const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all stations
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stations ORDER BY id ASC');
        res.json({ data: result.rows, error: null });
    } catch (error) {
        console.error('Fetch stations error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Add station
router.post('/', async (req, res) => {
    try {
        const { name, genre, description, streaming, image_url } = req.body;

        if (!name || !genre || !description) {
            return res.status(400).json({ data: null, error: 'Name, genre, and description required' });
        }

        const result = await db.query(
            'INSERT INTO stations (name, genre, description, streaming, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, genre, description, streaming || false, image_url || null]
        );

        res.json({ data: result.rows, error: null });
    } catch (error) {
        console.error('Add station error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Delete station
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM stations WHERE id = $1', [id]);
        res.json({ error: null });
    } catch (error) {
        console.error('Delete station error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
