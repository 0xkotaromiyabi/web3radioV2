
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import RentalListingCard from '@/components/rental/RentalListingCard';
import CreateListingModal from '@/components/rental/CreateListingModal';
import RentModal from '@/components/rental/RentModal';
import { Button } from "@/components/ui/button";
import { Filter, Clock, Search, Calendar, Shield, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DAYS_OF_WEEK, getCurrentUTCTime } from '@/utils/timeSlots';

const RentalAccess = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedListing, setSelectedListing] = useState<any | null>(null);
    const [rentModalOpen, setRentModalOpen] = useState(false);
    const [filterDay, setFilterDay] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterNetwork, setFilterNetwork] = useState<string>("sepolia");
    const [currentTime, setCurrentTime] = useState(getCurrentUTCTime());

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');
                const response = await fetch(`${baseUrl}/api/rentals`);
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
                console.error("API fetch failed:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentUTCTime());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleRent = (listingId: string) => {
        const listing = listings.find(l => l.id === listingId);
        if (listing) {
            setSelectedListing(listing);
            setRentModalOpen(true);
        }
    };

    const filteredListings = listings.filter(listing => {
        if (filterType !== "all") {
            const isSuper = listing.isSuperAccess;
            if (filterType === "super" && !isSuper) return false;
            if (filterType === "regular" && isSuper) return false;
        }
        if (filterDay !== "all") {
            const tokenId = parseInt(listing.tokenId);
            if (listing.isSuperAccess) {
                const superDayIndex = tokenId - 169 + 1;
                const dayName = DAYS_OF_WEEK[superDayIndex - 1].toLowerCase();
                if (dayName !== filterDay) return false;
            } else {
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
        <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
                body { font-family: 'Raleway', sans-serif; }
            `}</style>
            <NavBar />

            <main className="container mx-auto px-6 py-12 md:py-20 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
                    <div className="max-w-2xl space-y-6">
                        <Badge className="bg-[#515044]/5 text-[#515044] hover:bg-[#515044]/10 border-[#515044]/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
                            Temporal Access pass
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#515044]">
                            Rental Access
                        </h1>
                        <p className="text-xl text-[#515044]/60 font-light leading-relaxed">
                            Rent time-specific broadcast slots and manage your on-air presence through our decentralized scheduling system.
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">Regular: 7 Days max</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">Super: 24h Slots</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">Active Slots</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border border-[#515044]/5 shadow-xl">
                            <div className="flex items-center gap-4 mb-2">
                                <Clock className="w-5 h-5 text-[#515044]/40" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30">Current Network Time</p>
                            </div>
                            <p className="text-2xl font-bold text-[#515044] mono">{currentDayName} {currentHourFormatted}:00 UTC</p>
                        </div>
                        <CreateListingModal />
                    </div>
                </div>

                {/* Controls & Contract Info */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-9 bg-white/40 backdrop-blur-xl rounded-[32px] p-4 border border-[#515044]/5 flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 px-4 border-r border-[#515044]/10 h-10">
                            <Filter className="w-4 h-4 text-[#515044]/30" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">Filters</span>
                        </div>

                        <Select value={filterDay} onValueChange={setFilterDay}>
                            <SelectTrigger className="w-[160px] bg-transparent border-none text-[#515044] font-bold text-[10px] uppercase tracking-widest focus:ring-0">
                                <SelectValue placeholder="All Days" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-[#515044]/5">
                                <SelectItem value="all">All Days</SelectItem>
                                {DAYS_OF_WEEK.map(day => (
                                    <SelectItem key={day} value={day.toLowerCase()} className="text-[10px] font-bold uppercase tracking-widest">{day}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[160px] bg-transparent border-none text-[#515044] font-bold text-[10px] uppercase tracking-widest focus:ring-0">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-[#515044]/5">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="regular">Regular Access</SelectItem>
                                <SelectItem value="super">Super Access</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterNetwork} onValueChange={setFilterNetwork}>
                            <SelectTrigger className="w-[160px] bg-transparent border-none text-[#515044] font-bold text-[10px] uppercase tracking-widest focus:ring-0">
                                <SelectValue placeholder="Network" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-[#515044]/5">
                                <SelectItem value="sepolia">Sepolia Testnet</SelectItem>
                                <SelectItem value="base">Base Mainnet</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex-1"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20 pr-4">
                            {filteredListings.length} Listings
                        </p>
                    </div>

                    <div className="lg:col-span-3 bg-[#515044]/5 rounded-[32px] p-6 flex flex-col justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-[#515044]/30" />
                            <p className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30">Verified Contract</p>
                        </div>
                        <a
                            href={filterNetwork === 'sepolia'
                                ? "https://sepolia.etherscan.io/address/0xf6cE0304C02bBAcC817f2a90599cE700f538906F"
                                : "https://basescan.org/address/0xf6cE0304C02bBAcC817f2a90599cE700f538906F"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-[#515044] hover:text-black transition-colors flex items-center justify-between group"
                        >
                            0xf6cE...906F
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                        </a>
                    </div>
                </div>

                {/* Listings Grid */}
                {filteredListings.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-xl rounded-[48px] p-24 text-center border-2 border-dashed border-[#515044]/5">
                        <Calendar className="w-16 h-16 text-[#515044]/10 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-[#515044]">No Listings Found</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20 mt-2">Adjust your filters to see more results</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredListings.map(listing => (
                            <RentalListingCard
                                key={listing.id}
                                listing={listing}
                                onRent={handleRent}
                            />
                        ))}
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
