
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apdpgmmlcwjxgwaqsmqu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHBnbW1sY3dqeGd3YXFzbXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mzg3MTIsImV4cCI6MjA2MzIxNDcxMn0.qcy0vzpSgiZyQWciTBhlOG5Q_TiNGgSdMX1PfmB4I9c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize database tables
export const initializeTables = async () => {
  const { error: newsTableError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'news',
    columns_query: `
      id serial primary key,
      title text not null,
      content text not null,
      date text not null,
      created_at timestamp with time zone default now()
    `
  }).single();

  const { error: eventsTableError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'events',
    columns_query: `
      id serial primary key,
      title text not null,
      date text not null,
      location text not null,
      description text not null,
      created_at timestamp with time zone default now()
    `
  }).single();

  const { error: stationsTableError } = await supabase.rpc('create_table_if_not_exists', {
    table_name: 'stations',
    columns_query: `
      id serial primary key,
      name text not null,
      genre text not null,
      description text not null,
      streaming boolean not null default true,
      created_at timestamp with time zone default now()
    `
  }).single();

  // For debugging, log any errors
  if (newsTableError || eventsTableError || stationsTableError) {
    console.error("Table creation errors:", { newsTableError, eventsTableError, stationsTableError });
    
    // Fallback to use SQL directly if RPC failed
    if (newsTableError) {
      await createTablesWithSQL();
    }
  }

  return { newsTableError, eventsTableError, stationsTableError };
};

// Fallback function to create tables using direct SQL
const createTablesWithSQL = async () => {
  // Create news table
  await supabase.from('news')
    .select('id')
    .limit(1)
    .catch(async () => {
      // If error (table doesn't exist), create it
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS news (
          id serial primary key,
          title text not null,
          content text not null,
          date text not null,
          created_at timestamp with time zone default now()
        )
      `);
    });

  // Create events table
  await supabase.from('events')
    .select('id')
    .limit(1)
    .catch(async () => {
      // If error (table doesn't exist), create it
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS events (
          id serial primary key,
          title text not null,
          date text not null,
          location text not null,
          description text not null,
          created_at timestamp with time zone default now()
        )
      `);
    });

  // Create stations table
  await supabase.from('stations')
    .select('id')
    .limit(1)
    .catch(async () => {
      // If error (table doesn't exist), create it
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS stations (
          id serial primary key,
          name text not null,
          genre text not null,
          description text not null,
          streaming boolean not null default true,
          created_at timestamp with time zone default now()
        )
      `);
    });
};

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
  // Try to initialize tables first
  try {
    await initializeTables();
  } catch (error) {
    console.error("Error initializing tables:", error);
  }

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const addNewsItem = async (newsItem: { title: string; content: string; date: string }) => {
  // Try to initialize tables first
  try {
    await initializeTables();
  } catch (error) {
    console.error("Error initializing tables:", error);
  }

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
  // Try to initialize tables first
  try {
    await initializeTables();
  } catch (error) {
    console.error("Error initializing tables:", error);
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  return { data, error };
};

export const addEvent = async (event: { title: string; date: string; location: string; description: string }) => {
  // Try to initialize tables first
  try {
    await initializeTables();
  } catch (error) {
    console.error("Error initializing tables:", error);
  }

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
  // Try to initialize tables first
  try {
    await initializeTables();
  } catch (error) {
    console.error("Error initializing tables:", error);
  }

  const { data, error } = await supabase
    .from('stations')
    .select('*');
  
  return { data, error };
};

export const addStation = async (station: { name: string; genre: string; description: string; streaming: boolean }) => {
  // Try to initialize tables first
  try {
    await initializeTables();
  } catch (error) {
    console.error("Error initializing tables:", error);
  }

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
