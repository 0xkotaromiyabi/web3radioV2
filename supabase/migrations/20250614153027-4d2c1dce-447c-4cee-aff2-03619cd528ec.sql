
-- Create news table
CREATE TABLE public.news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stations table
CREATE TABLE public.stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT NOT NULL,
  streaming BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true);

-- Create storage policies for media bucket
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their uploads" ON storage.objects
FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their uploads" ON storage.objects
FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Enable Row Level Security on all tables
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for CMS tables
CREATE POLICY "Allow all access to news" ON public.news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to stations" ON public.stations FOR ALL USING (true) WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX idx_news_date ON public.news(date);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_stations_name ON public.stations(name);
