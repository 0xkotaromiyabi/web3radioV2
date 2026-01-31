import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import RentalListingCard from '@/components/rental/RentalListingCard';
import CreateListingModal from '@/components/rental/CreateListingModal';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

// Mock Data
const MOCK_LISTINGS = [
    {
        id: "1",
        tokenId: "42",
        lender: "0x123...456",
        pricePerHour: "0.005",
        maxDuration: 24,
        isSuperAccess: false
    },
    {
        id: "2",
        tokenId: "777",
        lender: "0xabc...def",
        pricePerHour: "0.02",
        maxDuration: 48,
        isSuperAccess: true
    },
    {
        id: "3",
        tokenId: "105",
        lender: "0x789...012",
        pricePerHour: "0.001",
        maxDuration: 12,
        isSuperAccess: false
    }
];

const RentalAccess = () => {
    const [listings, setListings] = useState(MOCK_LISTINGS);

    const handleRent = (listingId: string) => {
        console.log("Renting listing:", listingId);
        // TODO: Open Rent Modal
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <NavBar />

            <main className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
                            Rental Access Marketplace
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Rent temporary access to exclusive Web3Radio content directly from pass holders.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 glass border-border/50">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                        <CreateListingModal />
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(listing => (
                        <RentalListingCard
                            key={listing.id}
                            listing={listing}
                            onRent={handleRent}
                        />
                    ))}
                </div>

                {listings.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground glass rounded-2xl border-dashed border-2 border-border/50">
                        <p>No active rental listings found.</p>
                        <p className="text-sm mt-2">Be the first to list your pass!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RentalAccess;
