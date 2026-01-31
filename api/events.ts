import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const { slug } = req.query;
            if (slug) {
                const query = /^\d+$/.test(slug as string)
                    ? 'SELECT * FROM events WHERE id = $1'
                    : 'SELECT * FROM events WHERE slug = $1';
                const result = await pool.query(query, [slug]);

                if (result.rows.length === 0) {
                    return res.status(404).json({ data: null, error: 'Event not found' });
                }
                return res.status(200).json({ data: result.rows[0], error: null });
            }

            const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
            return res.status(200).json({ data: result.rows, error: null });
        }

        if (req.method === 'POST') {
            const { title, date, location, description, image_url, slug } = req.body;
            if (!title || !date || !location || !description) {
                return res.status(400).json({ data: null, error: 'Required fields missing' });
            }
            const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const result = await pool.query(
                'INSERT INTO events (title, date, location, description, image_url, slug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [title, date, location, description, image_url || null, finalSlug]
            );
            return res.status(200).json({ data: result.rows, error: null });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ data: null, error: error.message });
    }
}
