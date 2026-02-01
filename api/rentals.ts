import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// In serverless environment, it's best to initialize prisma outside the handler
// but be careful with connection pooling. Prisma Accelerate handles this via the URL.
const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL
}).$extends(withAccelerate());

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
            // Get all active listings from production DB
            const listings = await prisma.rentalListing.findMany({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' }
            });

            // Format to match old structure if necessary
            const formatted = listings.map(l => ({
                ...l,
                token_id: l.tokenId,
                lender: l.lender,
                price_per_hour: l.pricePerHour.toString(),
                max_duration_hours: l.maxDurationHours,
                is_super_access: l.isSuperAccess
            }));

            return res.status(200).json({ data: formatted, error: null });
        }

        if (req.method === 'POST') {
            const { token_id, lender, price_per_hour, max_duration_hours, is_super_access } = req.body;

            if (token_id === undefined || !lender || !price_per_hour || !max_duration_hours) {
                return res.status(400).json({ data: null, error: 'Missing required fields' });
            }

            const listing = await prisma.rentalListing.create({
                data: {
                    tokenId: parseInt(token_id),
                    lender,
                    pricePerHour: price_per_hour,
                    maxDurationHours: parseInt(max_duration_hours),
                    isSuperAccess: is_super_access || false
                }
            });

            return res.status(200).json({ data: listing, error: null });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'ID required' });

            await prisma.rentalListing.update({
                where: { id: parseInt(id as string) },
                data: { isActive: false }
            });

            return res.status(200).json({ message: 'Listing deactivated successfully', error: null });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error: any) {
        console.error('Rental API Error:', error);
        return res.status(500).json({ data: null, error: error.message });
    }
}
