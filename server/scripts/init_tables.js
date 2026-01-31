const db = require('../db');

const schema = `
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT NOT NULL,
  streaming BOOLEAN DEFAULT false,
  image_url TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rental_listings (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL,
  lender TEXT NOT NULL,
  price_per_hour NUMERIC NOT NULL,
  max_duration_hours INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_super_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function initDb() {
    console.log("Initializing database tables...");
    try {
        await db.query(schema);
        console.log("✅ Database tables initialized successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error initializing database:", err);
        process.exit(1);
    }
}

initDb();
