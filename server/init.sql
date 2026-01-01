-- Web3Radio Local Database Schema
-- Combined from all Supabase migrations

-- Users table (for local auth)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT NOT NULL,
  streaming BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages table (CMS)
CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listening sessions table
CREATE TABLE IF NOT EXISTS listening_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  station_id TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL UNIQUE,
  total_listening_time INTEGER DEFAULT 0,
  verified_listening_time INTEGER DEFAULT 0,
  total_rewards_claimed TEXT DEFAULT '0',
  last_reward_claim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward claims table
CREATE TABLE IF NOT EXISTS reward_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  listening_time INTEGER NOT NULL,
  reward_amount TEXT NOT NULL,
  signature TEXT NOT NULL,
  nonce INTEGER NOT NULL,
  claimed BOOLEAN DEFAULT false,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limiting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  action_type TEXT NOT NULL,
  last_action TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_address, action_type)
);

-- Music tweets table
CREATE TABLE IF NOT EXISTS music_tweets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tweet_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  handle TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar_url TEXT,
  song_request TEXT,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Music queue table
CREATE TABLE IF NOT EXISTS music_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tweet_id TEXT REFERENCES music_tweets(tweet_id),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  video_id TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  requested_by TEXT NOT NULL,
  queue_position INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now playing table
CREATE TABLE IF NOT EXISTS now_playing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id UUID REFERENCES music_queue(id),
  is_playing BOOLEAN DEFAULT false,
  volume INTEGER DEFAULT 100,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listening_sessions_user ON listening_sessions(user_address);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_address);
CREATE INDEX IF NOT EXISTS idx_reward_claims_user ON reward_claims(user_address);
CREATE INDEX IF NOT EXISTS idx_news_created ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Insert some sample data
INSERT INTO stations (name, genre, description, streaming) VALUES
  ('Web3 Radio', 'Electronic', 'The home of Web3 music', true),
  ('Venus FM', 'Pop', 'Pop hits from the metaverse', false),
  ('Delta FM', 'Jazz', 'Smooth jazz vibes', false)
ON CONFLICT DO NOTHING;

INSERT INTO news (title, content, date) VALUES
  ('Welcome to Web3Radio', 'Thank you for using our local development setup!', '2024-01-01')
ON CONFLICT DO NOTHING;
