-- Migration: Add slug columns
-- Run this script to update your existing database

ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE stations ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Optional: Generate slugs for existing items (basic version)
-- Note: In a real migration you might want more robust slugification logic using a function
UPDATE news SET slug = LOWER(REPLACE(title, ' ', '-')) WHERE slug IS NULL;
UPDATE events SET slug = LOWER(REPLACE(title, ' ', '-')) WHERE slug IS NULL;
UPDATE stations SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
