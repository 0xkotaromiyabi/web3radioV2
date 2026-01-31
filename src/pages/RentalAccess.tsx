import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import RentalListingCard from '@/components/rental/RentalListingCard';
import CreateListingModal from '@/components/rental/CreateListingModal';
import RentModal from '@/components/rental/RentModal';
import { Button } from "@/components/ui/button";
import { Filter, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DAYS_OF_WEEK, getCurrentUTCTime } from '@/utils/timeSlots';

// Realistic mock data with various time slots
const MOCK_LISTINGS = [
    // Monday slots
    {
        id: "1",
        tokenId: "13", // Monday 13:00-14:00
        lender: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
        pricePerHour: "0.005",
        maxDuration: 168,
        isSuperAccess: false
    },
    {
        id: "2",
        tokenId: "18", // Monday 18:00-19:00
        lender: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
        pricePerHour: "0.008",
        maxDuration: 168,
        isSuperAccess: false
    },
    // Tuesday slots
    {
        id: "3",
        tokenId: "36", // Tuesday 12:00-13:00
        lender: "0x8B3d5c9f1A2e4D7b6E3c5A9f8D2b1C4e7F6a5B3d",
        pricePerHour: "0.007",
        maxDuration: 168,
        isSuperAccess: false
    },
    // Wednesday evening
    {
        id: "4",
        tokenId: "66", // Wednesday 18:00-19:00
        lender: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
        pricePerHour: "0.01",
        maxDuration: 168,
        isSuperAccess: false
    },
    // Thursday prime time
    {
        id: "5",
        tokenId: "90", // Thursday 18:00-19:00
        lender: "0x9C4e6B8a2F5d7E1c3B6a8D9f2E1C4b7A6F8e5D3c",
        pricePerHour: "0.012",
        maxDuration: 168,
        isSuperAccess: false
    },
    // Friday evening
    {
        id: "6",
        tokenId: "114", // Friday 18:00-19:00
        lender: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
        pricePerHour: "0.015",
        maxDuration: 168,
        isSuperAccess: false
    },
    // Weekend slots
    {
        id: "7",
        tokenId: "154", // Sunday 10:00-11:00
        lender: "0xA5F7e9D2c1B4e6a8C3f5D7b9A2e4C6f8B1d3E5a7",
        pricePerHour: "0.006",
        maxDuration: 168,
        isSuperAccess: false
    },
    // Super Access - Monday
    {
        id: "8",
        tokenId: "169",
        lender: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
        pricePerHour: "0.025",
        maxDuration: 24,
        isSuperAccess: true
    },
    // Super Access - Friday
    {
        id: "9",
        tokenId: "173",
        lender: "0xB6C8f1A3d5E7b9C2a4F6D8e1B3c5A7f9D2e4B6a8",
        pricePerHour: "0.03",
        maxDuration: 24,
        isSuperAccess: true
    },
];

const RentalAccess = () => {
    const [listings, setListings] = useState<any[]>(MOCK_LISTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState<any | null>(null);
    const [rentModalOpen, setRentModalOpen] = useState(false);
    const [filterDay, setFilterDay] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [currentTime, setCurrentTime] = useState(getCurrentUTCTime());

    // Fetch listings from API
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/rentals`);
                const result = await response.json();
                if (result.data && result.data.length > 0) {
                    setListings(result.data.map((l: any) => ({
                        ...l,
                        tokenId: l.token_id.toString(),
                        isSuperAccess: l.is_super_access,
                        pricePerHour: l.price_per_hour.toString(),
                        maxDuration: l.max_duration_hours
                    })));
                }
            } catch (err) {
                console.warn("API fetch failed, using mock data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, []);

    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentUTCTime());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const handleRent = (listingId: string) => {
        const listing = listings.find(l => l.id === listingId);
        if (listing) {
            setSelectedListing(listing);
            setRentModalOpen(true);
        }
    };

    // Filter listings
    const filteredListings = listings.filter(listing => {
        if (filterType !== "all") {
            const isSuper = listing.isSuperAccess;
            if (filterType === "super" && !isSuper) return false;
            if (filterType === "regular" && isSuper) return false;
        }

        if (filterDay !== "all") {
            const tokenId = parseInt(listing.tokenId);
            if (listing.isSuperAccess) {
                // Super Access tokens 169-175 map to Monday-Sunday
                const superDayIndex = tokenId - 169 + 1;
                const dayName = DAYS_OF_WEEK[superDayIndex - 1].toLowerCase();
                if (dayName !== filterDay) return false;
            } else {
                // Regular tokens
                const dayIndex = Math.floor(tokenId / 24) + 1;
                const dayName = DAYS_OF_WEEK[dayIndex - 1].toLowerCase();
                if (dayName !== filterDay) return false;
            }
        }

        return true;
    });

    const currentDayName = DAYS_OF_WEEK[currentTime.dayIndex - 1];
    const currentHourFormatted = currentTime.hour.toString().padStart(2, '0');

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
                            Rent time-specific access to Web3Radio's exclusive broadcast slots
                        </p>

                        {/* Time Legend */}
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-muted-foreground">Regular: 168h max (7 days)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-muted-foreground">Super: 24h max (1 day)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-muted-foreground">Active Now</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Current UTC Time Display */}
                        <div className="glass border-border/50 px-4 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm font-mono">
                                    Current: {currentDayName} {currentHourFormatted}:00 UTC
                                </span>
                            </div>
                        </div>
                        <CreateListingModal />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 p-4 rounded-lg glass border border-border/50 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">Filters:</span>
                    </div>

                    <Select value={filterDay} onValueChange={setFilterDay}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Day" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Days</SelectItem>
                            {DAYS_OF_WEEK.map(day => (
                                <SelectItem key={day} value={day.toLowerCase()}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="regular">Regular Access</SelectItem>
                            <SelectItem value="super">Super Access</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex-1"></div>

                    <div className="text-sm text-muted-foreground">
                        Showing {filteredListings.length} of {listings.length} listings
                    </div>
                </div>

                {/* Contract Info */}
                <div className="mb-6 p-4 rounded-lg glass border border-border/50">
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Contract:</span>{' '}
                        <a
                            href="https://sepolia.etherscan.io/address/0xf6cE0304C02bBAcC817f2a90599cE700f538906F"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-mono"
                        >
                            0xf6cE...906F
                        </a>
                        {' '}on Sepolia
                    </p>
                </div>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map(listing => (
                        <RentalListingCard
                            key={listing.id}
                            listing={listing}
                            onRent={handleRent}
                        />
                    ))}
                </div>

                {filteredListings.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground glass rounded-2xl border-dashed border-2 border-border/50">
                        <p>No listings found matching your filters.</p>
                        <p className="text-sm mt-2">Try adjusting your filter settings.</p>
                    </div>
                )}
            </main>

            <RentModal
                listing={selectedListing}
                open={rentModalOpen}
                onOpenChange={setRentModalOpen}
            />
        </div>
    );
};

export default RentalAccess;
