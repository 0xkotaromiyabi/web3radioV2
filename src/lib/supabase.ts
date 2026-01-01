// Local API helper functions
// Replaces Supabase helper functions with local API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get token from localStorage
const getToken = () => localStorage.getItem('auth_token');

// Generic fetch helper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T | null; error: any }> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: result.error || 'Request failed' } };
    }

    return { data: result.data ?? result, error: null };
  } catch (error) {
    return { data: null, error: { message: (error as Error).message } };
  }
}

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const result = await apiFetch<{ user: any; token: string }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (result.data?.token) {
    localStorage.setItem('auth_token', result.data.token);
  }
  return { data: result.data, error: result.error };
};

export const signIn = async (email: string, password: string) => {
  const result = await apiFetch<{ user: any; token: string }>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (result.data?.token) {
    localStorage.setItem('auth_token', result.data.token);
  }
  return { data: result.data, error: result.error };
};

export const signOut = async () => {
  localStorage.removeItem('auth_token');
  return { error: null };
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;

  const result = await apiFetch<{ user: any }>('/api/auth/me');
  return result.data?.user || null;
};

// Database helper functions
export const fetchNews = async () => {
  return apiFetch<any[]>('/api/news');
};

export const addNewsItem = async (newsItem: { title: string; content: string; date: string; image_url?: string }) => {
  return apiFetch<any[]>('/api/news', {
    method: 'POST',
    body: JSON.stringify(newsItem),
  });
};

export const deleteNewsItem = async (id: number) => {
  return apiFetch<null>(`/api/news/${id}`, { method: 'DELETE' });
};

export const fetchEvents = async () => {
  return apiFetch<any[]>('/api/events');
};

export const addEvent = async (event: { title: string; date: string; location: string; description: string; image_url?: string }) => {
  return apiFetch<any[]>('/api/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
};

export const deleteEvent = async (id: number) => {
  return apiFetch<null>(`/api/events/${id}`, { method: 'DELETE' });
};

export const fetchStations = async () => {
  return apiFetch<any[]>('/api/stations');
};

export const addStation = async (station: { name: string; genre: string; description: string; streaming: boolean; image_url?: string }) => {
  return apiFetch<any[]>('/api/stations', {
    method: 'POST',
    body: JSON.stringify(station),
  });
};

export const deleteStation = async (id: number) => {
  return apiFetch<null>(`/api/stations/${id}`, { method: 'DELETE' });
};

// Real-time subscription helper (not available in local mode)
export const subscribeToTable = (tableName: string, callback: (payload: any) => void) => {
  console.log(`[Local] Real-time subscription not available for ${tableName}`);
  // Return a mock object with unsubscribe method
  return {
    unsubscribe: () => { }
  };
};

// Pages helper functions
export const fetchPages = async () => {
  return apiFetch<any[]>('/api/pages');
};

export const getPageBySlug = async (slug: string) => {
  return apiFetch<any>(`/api/pages/${slug}`);
};

export const addPage = async (page: { title: string; slug: string; content: string; is_published?: boolean }) => {
  return apiFetch<any[]>('/api/pages', {
    method: 'POST',
    body: JSON.stringify(page),
  });
};

export const deletePage = async (id: number) => {
  return apiFetch<null>(`/api/pages/${id}`, { method: 'DELETE' });
};
