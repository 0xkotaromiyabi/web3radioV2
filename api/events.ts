import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { slug } = req.query;
            if (slug) {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('slug', slug)
                    .single();
                if (error) throw error;
                return res.status(200).json({ data, error: null });
            }

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });
            if (error) throw error;
            return res.status(200).json({ data, error: null });
        }

        if (req.method === 'POST') {
            title,
                date,
                location,
                description,
                imageUrl: image_url || null,
                    slug: finalSlug
        }
    });
    return res.status(200).json({ data: event, error: null });
}

return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
    return res.status(500).json({ data: null, error: error.message });
}
}
