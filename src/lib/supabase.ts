import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env or Vercel settings.');
}

// Create the Supabase client safely
const isDummyUrl = supabaseUrl.includes('dummy-project');

export const supabase = (supabaseUrl && supabaseAnonKey && !isDummyUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export const fetchEvents = async () => {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };
  return await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
};

export const addEvent = async (event: any) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  return await supabase
    .from('events')
    .insert([event])
    .select();
};

export const deleteEvent = async (id: number) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  return await supabase
    .from('events')
    .delete()
    .eq('id', id);
};

export const fetchStations = async () => {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };
  return await supabase
    .from('stations')
    .select('*')
    .order('name', { ascending: true });
};

export const addStation = async (station: any) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  return await supabase
    .from('stations')
    .insert([station])
    .select();
};

export const deleteStation = async (id: number) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  return await supabase
    .from('stations')
    .delete()
    .eq('id', id);
};

export const getEventBySlug = async (slug: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  return await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();
};

export const getStationBySlug = async (slug: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  return await supabase
    .from('stations')
    .select('*')
    .eq('slug', slug)
    .single();
};

export const fetchPages = async () => {
  if (!supabase) return { data: [], error: new Error('Supabase not initialized') };
  return await supabase
    .from('pages')
    .select('*')
    .order('title', { ascending: true });
};

export const getPageBySlug = async (slug: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  return await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
};

// Real-time subscription helper with unique channel ID
export const subscribeToTable = (tableName: string, callback: (payload: any) => void) => {
  if (!supabase) {
    console.warn(`⚠️ Supabase not initialized. Real-time subscription for ${tableName} skipped.`);
    return { unsubscribe: () => { } };
  }
  const uniqueId = `${tableName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return supabase
    .channel(uniqueId)
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
