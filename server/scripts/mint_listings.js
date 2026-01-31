const db = require('../db');

async function mintAllListings() {
    const LENDER_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
    const REGULAR_SUPPLY = 168;
    const SUPER_SUPPLY = 7;
    const SUPER_START_ID = 168;

    console.log("🚀 Starting to 'mint' (initialize) all listings in database...");

    try {
        // Clear existing listings to avoid duplicates during dev
        await db.query('DELETE FROM rental_listings');
        console.log("Cleared existing listings.");

        // Mint Regular Access Listings (168)
        for (let i = 0; i < REGULAR_SUPPLY; i++) {
            await db.query(
                `INSERT INTO rental_listings (token_id, lender, price_per_hour, max_duration_hours, is_super_access) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [i, LENDER_ADDRESS, 0.001, 168, false]
            );
            if (i % 24 === 0) console.log(`Minted day ${i / 24} regular listings...`);
        }

        // Mint Super Access Listings (7)
        for (let i = 0; i < SUPER_SUPPLY; i++) {
            await db.query(
                `INSERT INTO rental_listings (token_id, lender, price_per_hour, max_duration_hours, is_super_access) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [SUPER_START_ID + i, LENDER_ADDRESS, 0.01, 24, true]
            );
        }

        console.log("✅ Successfully initialized all 175 listings in database!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error minting listings:", err);
        process.exit(1);
    }
}

mintAllListings();
