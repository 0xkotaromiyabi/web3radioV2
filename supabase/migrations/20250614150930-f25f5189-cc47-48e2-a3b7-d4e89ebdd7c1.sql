
-- Create listening_sessions table to track user listening activities
CREATE TABLE public.listening_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER NOT NULL DEFAULT 0,
  station_id TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reward_claims table to track reward distributions
CREATE TABLE public.reward_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  listening_time INTEGER NOT NULL,
  reward_amount TEXT NOT NULL,
  signature TEXT NOT NULL,
  nonce INTEGER NOT NULL,
  claimed BOOLEAN DEFAULT false,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rate_limiting table to prevent spam
CREATE TABLE public.rate_limiting (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  action_type TEXT NOT NULL,
  last_action TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  action_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_address, action_type)
);

-- Create user_stats table for aggregated listening data
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL UNIQUE,
  total_listening_time INTEGER DEFAULT 0,
  verified_listening_time INTEGER DEFAULT 0,
  total_rewards_claimed TEXT DEFAULT '0',
  last_reward_claim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_listening_sessions_user_address ON public.listening_sessions(user_address);
CREATE INDEX idx_listening_sessions_start_time ON public.listening_sessions(start_time);
CREATE INDEX idx_reward_claims_user_address ON public.reward_claims(user_address);
CREATE INDEX idx_rate_limiting_user_action ON public.rate_limiting(user_address, action_type);
CREATE INDEX idx_user_stats_user_address ON public.user_stats(user_address);

-- Enable Row Level Security (tables are public for now, but we can add policies later)
ALTER TABLE public.listening_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limiting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (can be restricted later)
CREATE POLICY "Allow all access to listening_sessions" ON public.listening_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to reward_claims" ON public.reward_claims FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to rate_limiting" ON public.rate_limiting FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to user_stats" ON public.user_stats FOR ALL USING (true) WITH CHECK (true);

-- Create function to update user stats when listening session is verified
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user stats
  INSERT INTO public.user_stats (user_address, total_listening_time, verified_listening_time)
  VALUES (NEW.user_address, NEW.duration, CASE WHEN NEW.verified THEN NEW.duration ELSE 0 END)
  ON CONFLICT (user_address) 
  DO UPDATE SET 
    total_listening_time = user_stats.total_listening_time + NEW.duration,
    verified_listening_time = user_stats.verified_listening_time + CASE WHEN NEW.verified THEN NEW.duration ELSE 0 END,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user stats
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT OR UPDATE ON public.listening_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();
