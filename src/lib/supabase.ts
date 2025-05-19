
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apdpgmmlcwjxgwaqsmqu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHBnbW1sY3dqeGd3YXFzbXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mzg3MTIsImV4cCI6MjA2MzIxNDcxMn0.qcy0vzpSgiZyQWciTBhlOG5Q_TiNGgSdMX1PfmB4I9c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  // For development/testing purposes
  if (email === 'admin@example.com' && password === 'admin123') {
    // Mock successful login for testing
    return { 
      data: { 
        user: { 
          id: '1', 
          email: 'admin@example.com',
          role: 'admin' 
        }, 
        session: { 
          access_token: 'mock_token',
          refresh_token: 'mock_refresh_token'
        } 
      }, 
      error: null 
    };
  }
  
  // Real Supabase authentication
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user;
};

// Database helper functions
export const fetchNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const addNewsItem = async (newsItem: { title: string; content: string; date: string }) => {
  const { data, error } = await supabase
    .from('news')
    .insert([newsItem])
    .select();
  
  return { data, error };
};

export const deleteNewsItem = async (id: number) => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  
  return { error };
};

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  return { data, error };
};

export const addEvent = async (event: { title: string; date: string; location: string; description: string }) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();
  
  return { data, error };
};

export const deleteEvent = async (id: number) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  return { error };
};

export const fetchStations = async () => {
  const { data, error } = await supabase
    .from('stations')
    .select('*');
  
  return { data, error };
};

export const addStation = async (station: { name: string; genre: string; description: string; streaming: boolean }) => {
  const { data, error } = await supabase
    .from('stations')
    .insert([station])
    .select();
  
  return { data, error };
};

export const deleteStation = async (id: number) => {
  const { error } = await supabase
    .from('stations')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Real-time subscription helper
export const subscribeToTable = (tableName: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`${tableName}-changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, payload => {
      callback(payload);
    })
    .subscribe();
};
