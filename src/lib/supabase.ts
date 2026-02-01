import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env or Vercel settings.');
}

// Create the Supabase client safely
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Database helper functions for common operations
export const fetchNews = async () => {
  return await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
};

export const addNewsItem = async (newsItem: any) => {
  return await supabase
    .from('news')
    .insert([newsItem])
    .select();
};

export const deleteNewsItem = async (id: number) => {
  return await supabase
    .from('news')
    .delete()
    .eq('id', id);
};

export const fetchEvents = async () => {
  return await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
};

export const addEvent = async (event: any) => {
  return await supabase
    .from('events')
    .insert([event])
    .select();
};

export const deleteEvent = async (id: number) => {
  return await supabase
    .from('events')
    .delete()
    .eq('id', id);
};

export const fetchStations = async () => {
  return await supabase
    .from('stations')
    .select('*')
    .order('name', { ascending: true });
};

export const addStation = async (station: any) => {
  return await supabase
    .from('stations')
    .insert([station])
    .select();
};

export const deleteStation = async (id: number) => {
  return await supabase
    .from('stations')
    .delete()
    .eq('id', id);
};

export const getNewsBySlug = async (slug: string) => {
  return await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();
};

export const getEventBySlug = async (slug: string) => {
  return await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();
};

export const getStationBySlug = async (slug: string) => {
  return await supabase
    .from('stations')
    .select('*')
    .eq('slug', slug)
    .single();
};

export const fetchPages = async () => {
  return await supabase
    .from('pages')
    .select('*')
    .order('title', { ascending: true });
};

export const getPageBySlug = async (slug: string) => {
  return await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
};

// Real-time subscription helper
export const subscribeToTable = (tableName: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`${tableName}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
      },
      (payload) => callback(payload)
    )
    .subscribe();
};

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
