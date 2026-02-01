import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('rental_listings')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return res.status(200).json({ data, error: null });
        }

        if (req.method === 'POST') {
            const { token_id, lender, price_per_hour, max_duration_hours, is_super_access } = req.body;

            if (token_id === undefined || !lender || !price_per_hour || !max_duration_hours) {
                return res.status(400).json({ data: null, error: 'Missing required fields' });
            }

            const { data, error } = await supabase
                .from('rental_listings')
                .insert([{
                    token_id: parseInt(token_id),
                    lender,
                    price_per_hour,
                    max_duration_hours: parseInt(max_duration_hours),
                    is_super_access: is_super_access || false,
                    is_active: true
                }])
                .select()
                .single();

            if (error) throw error;

            return res.status(200).json({ data, error: null });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'ID required' });

            const { error } = await supabase
                .from('rental_listings')
                .update({ is_active: false })
                .eq('id', parseInt(id as string));

            if (error) throw error;

            return res.status(200).json({ message: 'Listing deactivated successfully', error: null });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        console.error('Rental API Error:', error);
        return res.status(500).json({ data: null, error: error.message });
    }
}
