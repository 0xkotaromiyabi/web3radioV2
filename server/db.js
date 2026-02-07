const { Pool } = require('pg');
require('dotenv').config();

// Helper to parse DATABASE_URL
let config = null;

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
            try {
                const url = new URL(cleanUrl);
                config = {
                    user: url.username,
                    password: url.password,
                    host: url.hostname,
                    port: url.port,
                    database: url.pathname.split('/')[1],
                    ssl: url.searchParams.get('sslmode') !== 'disable' && url.hostname !== 'localhost' ? { rejectUnauthorized: false } : false
                };
            } catch (urlError) {
                // Fallback if URL parsing fails but string exists
                config = {
                    connectionString: cleanUrl,
                    ssl: { rejectUnauthorized: false }
                };
            }
        }
        console.log(`Database connected to production host: ${config?.host || 'remote'}`);
    } catch (e) {
        console.error('Error parsing Connection String:', e.message);
    }
}

// Create pool or mock
let pool;
if (config) {
    pool = new Pool(config);
    // Test connection on startup
    pool.connect().then(client => {
        return client.query('SELECT NOW()')
            .then(res => {
                client.release();
                console.log('Database connected to Production/Prisma at:', res.rows[0].now);
            })
            .catch(err => {
                client.release();
                console.error('Database connection test failed:', err.message);
            });
    }).catch(err => {
        console.error('Database pool connection error:', err.message);
        console.warn('⚠️  Server running in RELAY-ONLY mode (Database unavailable)');
    });
} else {
    console.warn('⚠️  DATABASE_URL not defined. Server running in RELAY-ONLY mode.');
    // Mock pool for Relay-only mode
    pool = {
        query: async () => { throw new Error('Database not configured'); },
        connect: async () => { throw new Error('Database not configured'); }
    };
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
