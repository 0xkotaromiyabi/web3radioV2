import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Database connection pool for Vercel Serverless
const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Get all active listings from production DB
            const result = await pool.query('SELECT * FROM rental_listings WHERE is_active = true ORDER BY created_at DESC');
            return res.status(200).json({ data: result.rows, error: null });
        }

        if (req.method === 'POST') {
            const { token_id, lender, price_per_hour, max_duration_hours, is_super_access } = req.body;

            if (token_id === undefined || !lender || !price_per_hour || !max_duration_hours) {
                return res.status(400).json({ data: null, error: 'Missing required fields' });
            }

            const result = await pool.query(
                'INSERT INTO rental_listings (token_id, lender, price_per_hour, max_duration_hours, is_super_access) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [token_id, lender, price_per_hour, max_duration_hours, is_super_access || false]
            );

            return res.status(200).json({ data: result.rows[0], error: null });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'ID required' });

            await pool.query('UPDATE rental_listings SET is_active = false WHERE id = $1', [id]);
            return res.status(200).json({ message: 'Listing deactivated successfully', error: null });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        console.error('Rental API Error:', error);
        return res.status(500).json({ data: null, error: error.message });
    }
}
