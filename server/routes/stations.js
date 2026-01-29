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

// Get station by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        const isId = /^\d+$/.test(idOrSlug);

        const query = isId
            ? 'SELECT * FROM stations WHERE id = $1'
            : 'SELECT * FROM stations WHERE slug = $1';

        const result = await db.query(query, [idOrSlug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ data: null, error: 'Station not found' });
        }

        res.json({ data: result.rows[0], error: null });
    } catch (error) {
        console.error('Fetch station details error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Add station
router.post('/', async (req, res) => {
    try {
        const { name, genre, description, streaming, image_url, slug } = req.body;

        if (!name || !genre || !description) {
            return res.status(400).json({ data: null, error: 'Name, genre, and description required' });
        }

        // Auto-generate slug if not provided
        const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const result = await db.query(
            'INSERT INTO stations (name, genre, description, streaming, image_url, slug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, genre, description, streaming || false, image_url || null, finalSlug]
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
