// Local API client - replaces Supabase client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('auth_token', token);
    } else {
        localStorage.removeItem('auth_token');
    }
};

export const getAuthToken = () => authToken;

// Generic API request helper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (authToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const result = await response.json();

        if (!response.ok) {
            return { data: null, error: result.error || 'Request failed' };
        }

        return { data: result.data ?? result, error: null };
    } catch (error) {
        console.error('API request error:', error);
        return { data: null, error: (error as Error).message };
    }
}

// Auth API
export const auth = {
    signUp: async (email: string, password: string) => {
        const result = await apiRequest<{ user: any; token: string }>('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (result.data?.token) {
            setAuthToken(result.data.token);
        }
        return result;
    },

    signIn: async (email: string, password: string) => {
        const result = await apiRequest<{ user: any; token: string }>('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (result.data?.token) {
            setAuthToken(result.data.token);
        }
        return result;
    },

    signOut: async () => {
        setAuthToken(null);
        return { error: null };
    },

    getUser: async () => {
        if (!authToken) {
            return { data: null, error: null };
        }
        return apiRequest<{ user: any }>('/api/auth/me');
    },
};

// Database tables API
export const from = (table: string) => ({
    select: async (columns = '*') => {
        return apiRequest<any[]>(`/api/${table}`);
    },

    insert: async (data: any[]) => {
        const result = await apiRequest<any[]>(`/api/${table}`, {
            method: 'POST',
            body: JSON.stringify(data[0]),
        });
        return { ...result, select: async () => result };
    },

    delete: () => ({
        eq: async (column: string, value: any) => {
            return apiRequest<null>(`/api/${table}/${value}`, {
                method: 'DELETE',
            });
        },
    }),

    update: (data: any) => ({
        eq: async (column: string, value: any) => {
            return apiRequest<any>(`/api/${table}/${value}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },
    }),
});

// Single item query
export const single = (table: string, column: string, value: any) => ({
    select: async () => {
        return apiRequest<any>(`/api/${table}/${value}`);
    },
});

// Dummy channel for real-time (not implemented in local version)
export const channel = (name: string) => ({
    on: (event: string, config: any, callback: (payload: any) => void) => ({
        subscribe: () => {
            console.log(`[Local] Real-time subscription not available for ${name}`);
            return { unsubscribe: () => { } };
        },
    }),
});

// Export a supabase-compatible interface
export const localClient = {
    auth: {
        signUp: ({ email, password }: { email: string; password: string }) => auth.signUp(email, password),
        signInWithPassword: ({ email, password }: { email: string; password: string }) => auth.signIn(email, password),
        signOut: () => auth.signOut(),
        getUser: () => auth.getUser(),
    },
    from,
    channel,
    storage: {
        from: (bucket: string) => ({
            upload: async (path: string, file: File) => {
                console.log('[Local] File upload not implemented');
                return { data: null, error: 'File upload not available in local mode' };
            },
            getPublicUrl: (path: string) => ({
                data: { publicUrl: '' },
            }),
        }),
    },
    functions: {
        invoke: async (name: string, options: any) => {
            console.log('[Local] Edge functions not available');
            return { data: null, error: 'Edge functions not available in local mode' };
        },
    },
};

// Default export for compatibility
export default localClient;
