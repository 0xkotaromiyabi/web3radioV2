const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all active rental listings
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM rental_listings WHERE is_active = true ORDER BY created_at DESC'
        );
        res.json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create a new rental listing
router.post('/', async (req, res) => {
    const { token_id, lender, price_per_hour, max_duration_hours, is_super_access } = req.body;

    if (!token_id || !lender || !price_per_hour || !max_duration_hours) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await db.query(
            `INSERT INTO rental_listings (token_id, lender, price_per_hour, max_duration_hours, is_super_access) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [token_id, lender, price_per_hour, max_duration_hours, is_super_access || false]
        );
        res.status(201).json({ data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete/Deactivate a listing
router.delete('/:id', async (req, res) => {
    try {
        await db.query('UPDATE rental_listings SET is_active = false WHERE id = $1', [req.params.id]);
        res.json({ message: 'Listing deactivated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
