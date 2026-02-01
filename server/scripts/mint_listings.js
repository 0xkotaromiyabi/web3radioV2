const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function mintAllListings() {
    const LENDER_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
    const REGULAR_SUPPLY = 168;
    const SUPER_SUPPLY = 7;
    const SUPER_START_ID = 168;

    console.log("🚀 Starting to initialize all listings in database via Supabase...");

    try {
        // Clear existing listings
        const { error: deleteError } = await supabase
            .from('rental_listings')
            .delete()
            .neq('id', -1); // Delete all

        if (deleteError) {
            console.warn("⚠️ Note: Table might be empty or missing, or delete failed:", deleteError.message);
        } else {
            console.log("Cleared existing listings.");
        }

        // Prepare records
        const records = [];

        // Regular Access Listings (168)
        for (let i = 0; i < REGULAR_SUPPLY; i++) {
            records.push({
                token_id: i,
                lender: LENDER_ADDRESS,
                price_per_hour: "0.001",
                max_duration_hours: 168,
                is_super_access: false,
                is_active: true
            });
        }

        // Super Access Listings (7)
        for (let i = 0; i < SUPER_SUPPLY; i++) {
            records.push({
                token_id: SUPER_START_ID + i,
                lender: LENDER_ADDRESS,
                price_per_hour: "0.01",
                max_duration_hours: 24,
                is_super_access: true,
                is_active: true
            });
        }

        // Bulk insert (Supabase can handle chunks if needed, but 175 is small)
        const { error: insertError } = await supabase
            .from('rental_listings')
            .insert(records);

        if (insertError) throw insertError;

        console.log("✅ Successfully initialized all 175 listings in database via Supabase!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error initializing listings:", err);
        process.exit(1);
    }
}

mintAllListings();
