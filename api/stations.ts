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
                    ? 'SELECT * FROM stations WHERE id = $1'
                    : 'SELECT * FROM stations WHERE slug = $1';
                const result = await pool.query(query, [slug]);

                if (result.rows.length === 0) {
                    return res.status(404).json({ data: null, error: 'Station not found' });
                }
                return res.status(200).json({ data: result.rows[0], error: null });
            }

            const result = await pool.query('SELECT * FROM stations ORDER BY name ASC');
            return res.status(200).json({ data: result.rows, error: null });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ data: null, error: error.message });
    }
}
