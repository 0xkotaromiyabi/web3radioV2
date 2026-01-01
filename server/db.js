const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
