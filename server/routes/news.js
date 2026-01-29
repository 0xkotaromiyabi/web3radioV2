const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM news ORDER BY created_at DESC');
        res.json({ data: result.rows, error: null });
    } catch (error) {
        console.error('Fetch news error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Get news by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        const isId = /^\d+$/.test(idOrSlug);

        const query = isId
            ? 'SELECT * FROM news WHERE id = $1'
            : 'SELECT * FROM news WHERE slug = $1';

        const result = await db.query(query, [idOrSlug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ data: null, error: 'News item not found' });
        }

        res.json({ data: result.rows[0], error: null });
    } catch (error) {
        console.error('Fetch news details error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Add news item
router.post('/', async (req, res) => {
    try {
        const { title, content, date, image_url, slug } = req.body;

        if (!title || !content || !date) {
            return res.status(400).json({ data: null, error: 'Title, content, and date required' });
        }

        // Auto-generate slug if not provided
        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const result = await db.query(
            'INSERT INTO news (title, content, date, image_url, slug) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, content, date, image_url || null, finalSlug]
        );

        res.json({ data: result.rows, error: null });
    } catch (error) {
        console.error('Add news error:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Delete news item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM news WHERE id = $1', [id]);
        res.json({ error: null });
    } catch (error) {
        console.error('Delete news error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
