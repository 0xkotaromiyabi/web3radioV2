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
                const newsItem = isId
                    ? await prisma.news.findUnique({ where: { id: parseInt(slug as string) } })
                    : await prisma.news.findUnique({ where: { slug: slug as string } });

                if (!newsItem) {
                    return res.status(404).json({ data: null, error: 'News item not found' });
                }
                return res.status(200).json({ data: newsItem, error: null });
            }

            const news = await prisma.news.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json({ data: news, error: null });
        }

        if (req.method === 'POST') {
            const { title, content, date, image_url, slug } = req.body;
            if (!title || !content || !date) {
                return res.status(400).json({ data: null, error: 'Title, content, and date required' });
            }
            const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const newsItem = await prisma.news.create({
                data: {
                    title,
                    content,
                    date,
                    imageUrl: image_url || null,
                    slug: finalSlug
                }
            });
            return res.status(200).json({ data: newsItem, error: null });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ data: null, error: error.message });
    }
}
