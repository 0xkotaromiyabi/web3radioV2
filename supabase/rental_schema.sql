-- Rental Listings Table
CREATE TABLE rental_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id BIGINT NOT NULL,
  lender TEXT NOT NULL,
  price_per_hour NUMERIC NOT NULL,
  max_duration_hours INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  signature TEXT -- Optional: for permit-style off-chain agreements
);

-- Rental Offers/History (Optional for simple version)
CREATE TABLE rental_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES rental_listings(id),
  renter TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  rented_at TIMESTAMPTZ DEFAULT NOW(),
  transaction_hash TEXT
);
