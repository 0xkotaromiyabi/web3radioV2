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
                const station = isId
                    ? await prisma.station.findUnique({ where: { id: parseInt(slug as string) } })
                    : await prisma.station.findUnique({ where: { slug: slug as string } });

                if (!station) {
                    return res.status(404).json({ data: null, error: 'Station not found' });
                }
                return res.status(200).json({ data: station, error: null });
            }

            const stations = await prisma.station.findMany({
                orderBy: { name: 'asc' }
            });
            return res.status(200).json({ data: stations, error: null });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        return res.status(500).json({ data: null, error: error.message });
    }
}
