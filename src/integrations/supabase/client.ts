// Re-export the Supabase client from our central lib
// This ensures all integrations use the same client instance
import { supabase as realSupabase } from '@/lib/supabase';

export const supabase = realSupabase;