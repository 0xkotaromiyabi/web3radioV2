const { Pool } = require('pg');
require('dotenv').config();

// Helper to parse DATABASE_URL
let config = {};

if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        config = {
            user: url.username,
            password: url.password,
            host: url.hostname,
            port: url.port,
            database: url.pathname.split('/')[1],
            ssl: url.searchParams.get('sslmode') !== 'disable' && url.hostname !== 'localhost' ? { rejectUnauthorized: false } : false
        };
        console.log(`Database configuration loaded for user: ${config.user}`);
    } catch (e) {
        console.error('Error parsing DATABASE_URL, falling back to connection string:', e.message);
        config = { connectionString: process.env.DATABASE_URL };
    }
} else {
    console.error('CRITICAL: DATABASE_URL is not defined!');
    // Fallback for local dev if .env fails to load but DB is running
    config = {
        user: 'web3radio',
        password: 'web3radio_local_dev',
        host: 'localhost',
        port: 5432,
        database: 'web3radio'
    };
}

const pool = new Pool(config);

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
        if (err.message.includes('password')) {
            console.error('TIP: Check if DATABASE_URL contains the correct password as a string.');
        }
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
