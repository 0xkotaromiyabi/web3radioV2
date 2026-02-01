const prisma = require('../prisma');

async function mintAllListings() {
    const LENDER_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
    const REGULAR_SUPPLY = 168;
    const SUPER_SUPPLY = 7;
    const SUPER_START_ID = 168;

    console.log("🚀 Starting to 'mint' (initialize) all listings in database via Prisma...");

    try {
        // Clear existing listings to avoid duplicates during dev
        await prisma.rentalListing.deleteMany({});
        console.log("Cleared existing listings.");

        // Prepare records
        const records = [];

        // Regular Access Listings (168)
        for (let i = 0; i < REGULAR_SUPPLY; i++) {
            records.push({
                tokenId: i,
                lender: LENDER_ADDRESS,
                pricePerHour: 0.001,
                maxDurationHours: 168,
                isSuperAccess: false
            });
        }

        // Super Access Listings (7)
        for (let i = 0; i < SUPER_SUPPLY; i++) {
            records.push({
                tokenId: SUPER_START_ID + i,
                lender: LENDER_ADDRESS,
                pricePerHour: 0.01,
                maxDurationHours: 24,
                isSuperAccess: true
            });
        }

        // Bulk insert
        await prisma.rentalListing.createMany({
            data: records
        });

        console.log("✅ Successfully initialized all 175 listings in database via Prisma!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error minting listings:", err);
        process.exit(1);
    }
}

mintAllListings();
