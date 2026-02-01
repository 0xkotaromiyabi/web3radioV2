-- Create rental_listings table
CREATE TABLE IF NOT EXISTS public.rental_listings (
    id BIGSERIAL PRIMARY KEY,
    token_id INTEGER NOT NULL,
    lender TEXT NOT NULL,
    price_per_hour TEXT NOT NULL,
    max_duration_hours INTEGER NOT NULL,
    is_super_access BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    date TEXT,
    slug TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date TEXT,
    image_url TEXT,
    slug TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stations table
CREATE TABLE IF NOT EXISTS public.stations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    genre TEXT,
    description TEXT,
    streaming BOOLEAN DEFAULT false,
    image_url TEXT,
    slug TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sample RLS policies (allow all for now to match current dev status)
ALTER TABLE public.rental_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.rental_listings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.rental_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.rental_listings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.rental_listings FOR DELETE USING (true);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.news FOR INSERT WITH CHECK (true);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.events FOR INSERT WITH CHECK (true);

ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.stations FOR SELECT USING (true);
