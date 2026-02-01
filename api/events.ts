import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL
}).$extends(withAccelerate());

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const { slug } = req.query;
            if (slug) {
                const isId = /^\d+$/.test(slug as string);
                const event = isId
                    ? await prisma.event.findUnique({ where: { id: parseInt(slug as string) } })
                    : await prisma.event.findUnique({ where: { slug: slug as string } });

                if (!event) {
                    return res.status(404).json({ data: null, error: 'Event not found' });
                }
                return res.status(200).json({ data: event, error: null });
            }

            const events = await prisma.event.findMany({
                orderBy: { date: 'asc' }
            });
            return res.status(200).json({ data: events, error: null });
        }

        if (req.method === 'POST') {
            const { title, date, location, description, image_url, slug } = req.body;
            if (!title || !date || !location || !description) {
                return res.status(400).json({ data: null, error: 'Required fields missing' });
            }
            const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const event = await prisma.event.create({
                data: {
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
