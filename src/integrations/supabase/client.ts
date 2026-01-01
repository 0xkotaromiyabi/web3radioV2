// This file now uses the local API client instead of Supabase
// To switch back to Supabase, uncomment the original imports below
// import { createClient } from '@supabase/supabase-js';
// import type { Database } from './types';
// const SUPABASE_URL = "https://zxyoidfksqmccwvdduxk.supabase.co";
// const SUPABASE_PUBLISHABLE_KEY = "...";
// export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Local API client
import { localClient } from '@/integrations/local/client';
export const supabase = localClient;