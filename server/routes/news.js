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

// Add news item
router.post('/', async (req, res) => {
    try {
        const { title, content, date, image_url } = req.body;

        if (!title || !content || !date) {
            return res.status(400).json({ data: null, error: 'Title, content, and date required' });
        }

        const result = await db.query(
            'INSERT INTO news (title, content, date, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, date, image_url || null]
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
