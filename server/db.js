const { Pool } = require('pg');
require('dotenv').config();

// Helper to parse DATABASE_URL
let config = {};

// Use DIRECT_URL for pg pool if available (for Prisma Accelerate compatibility)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (connectionString) {
    try {
        // Handle potential quotes from .env
        const cleanUrl = connectionString.replace(/"/g, '');

        // If it's a prisma+postgres URL, we need to extract the direct part or use DIRECT_URL
        if (cleanUrl.startsWith('prisma+postgres')) {
            console.error('CRITICAL: DATABASE_URL is a Prisma Accelerate URL. Use DIRECT_URL for pg driver.');
            if (process.env.DIRECT_URL) {
                const directUrl = process.env.DIRECT_URL.replace(/"/g, '');
                config = {
                    connectionString: directUrl,
                    ssl: { rejectUnauthorized: false }
                };
            } else {
                throw new Error('DIRECT_URL missing for Prisma Accelerate setup.');
            }
        } else {
            const url = new URL(cleanUrl);
            config = {
                user: url.username,
                password: url.password,
                host: url.hostname,
                port: url.port,
                database: url.pathname.split('/')[1],
                ssl: url.searchParams.get('sslmode') !== 'disable' && url.hostname !== 'localhost' ? { rejectUnauthorized: false } : false
            };
        }
        console.log(`Database connected to production host: ${config.host || 'remote'}`);
    } catch (e) {
        console.error('Error parsing Connection String, falling back to basic connection:', e.message);
        config = {
            connectionString: connectionString.replace(/"/g, ''),
            ssl: { rejectUnauthorized: false }
        };
    }
} else {
    console.error('CRITICAL: DATABASE_URL is not defined!');
    // Fallback for local dev
    config = {
        user: 'web3radio',
        password: 'web3radio_local_dev',
        host: 'localhost',
        port: 5433,
        database: 'web3radio'
    };
}

const pool = new Pool(config);

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected to Production/Prisma at:', res.rows[0].now);
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
