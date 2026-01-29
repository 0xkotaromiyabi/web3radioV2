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

// Get event by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        const isId = /^\d+$/.test(idOrSlug);

        const query = isId
            ? 'SELECT * FROM events WHERE id = $1'
            : 'SELECT * FROM events WHERE slug = $1';

        const result = await db.query(query, [idOrSlug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ data: null, error: 'Event not found' });
        }

        res.json({ data: result.rows[0], error: null });
    } catch (error) {
        console.error('Fetch event details error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Add event
router.post('/', async (req, res) => {
    try {
        const { title, date, location, description, image_url, slug } = req.body;

        if (!title || !date || !location || !description) {
            return res.status(400).json({ data: null, error: 'Title, date, location, and description required' });
        }

        // Auto-generate slug if not provided
        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const result = await db.query(
            'INSERT INTO events (title, date, location, description, image_url, slug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, date, location, description, image_url || null, finalSlug]
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
