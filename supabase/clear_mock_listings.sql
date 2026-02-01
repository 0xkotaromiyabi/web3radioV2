-- Clear all existing rental listings from database
-- Run this in Supabase SQL Editor to remove mock/stale data

-- Option 1: Delete all listings (recommended for fresh start)
DELETE FROM public.rental_listings;

-- Option 2: Just deactivate all listings (keeps history)
-- UPDATE public.rental_listings SET is_active = false;

-- Verify the table is empty
SELECT COUNT(*) as remaining_listings FROM public.rental_listings WHERE is_active = true;
