
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import RentalNFTCard from '@/components/rental/RentalNFTCard';
import CreateListingModal from '@/components/rental/CreateListingModal';
import RentModal from '@/components/rental/RentModal';
import { Button } from "@/components/ui/button";
import { Filter, Clock, Search, Calendar, Shield, Info, ExternalLink, AlertTriangle, RefreshCcw, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DAYS_OF_WEEK, getCurrentUTCTime } from '@/utils/timeSlots';

const RentalAccess = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedListing, setSelectedListing] = useState<any | null>(null);
    const [rentModalOpen, setRentModalOpen] = useState(false);
    const [filterDay, setFilterDay] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterNetwork, setFilterNetwork] = useState<string>("sepolia");
    const [currentTime, setCurrentTime] = useState(getCurrentUTCTime());

    const fetchListings = async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);
        setError(null);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');
            const response = await fetch(`${baseUrl}/api/rentals`, {
                signal: AbortSignal.timeout(5000) // 5s timeout
            });

            if (!response.ok) throw new Error(`Server responded with ${response.status}`);

            const result = await response.json();
            if (result.data) {
                setListings(result.data.map((l: any) => ({
                    ...l,
                    tokenId: l.token_id.toString(),
                    isSuperAccess: l.is_super_access,
                    pricePerHour: l.price_per_hour.toString(),
                    maxDuration: l.max_duration_hours
                })));
            }
        } catch (err: any) {
            console.error("API fetch failed:", err);
            setError(err.message || "Failed to connect to the rental backend. Please ensure the server is running.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
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
                .rental-bg-text {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: 0;
                }
                .rental-bg-text h1 {
                    font-size: 15rem;
                    color: #515044;
                    opacity: 0.03;
                    margin: 0;
                    white-space: nowrap;
                    font-weight: 800;
                    text-transform: lowercase;
                }
                @media (max-width: 768px) {
                    .rental-bg-text h1 { font-size: 5rem; }
                }
            `}</style>

            <div className="rental-bg-text">
                <h1>web3radio</h1>
            </div>

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
                        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border border-[#515044]/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#515044]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-2">
                                    <Clock className="w-5 h-5 text-[#515044]/40" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30">Current Network Time</p>
                                </div>
                                <p className="text-2xl font-bold text-[#515044] mono">{currentDayName} {currentHourFormatted}:00 UTC</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <CreateListingModal />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => fetchListings(true)}
                                className={`rounded-xl border-[#515044]/10 bg-white/50 backdrop-blur w-12 h-12 transition-all ${isRefreshing ? 'animate-spin' : 'hover:bg-white active:scale-95'}`}
                                disabled={isRefreshing}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21v-5h5" /></svg>
                            </Button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-12 p-8 bg-red-500/5 backdrop-blur-xl rounded-[40px] border border-red-500/10 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-16 h-16 rounded-[24px] bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-8 h-8 text-red-500/40" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-bold text-red-500">Connection Issue</h3>
                            <p className="text-sm text-red-500/60 font-light max-w-xl">{error}</p>
                        </div>
                        <Button
                            onClick={() => fetchListings()}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-8 py-6 font-bold text-[10px] uppercase tracking-widest"
                        >
                            Retry Connection
                        </Button>
                    </div>
                )}

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
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white/40 backdrop-blur-xl rounded-[32px] p-8 border border-[#515044]/5 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-24 h-6 bg-[#515044]/5 rounded-lg animate-pulse"></div>
                                    <div className="w-20 h-5 bg-[#515044]/5 rounded-lg animate-pulse"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-20 bg-[#515044]/5 rounded-2xl animate-pulse"></div>
                                    <div className="flex justify-between pt-2">
                                        <div className="w-12 h-4 bg-[#515044]/5 rounded animate-pulse"></div>
                                        <div className="w-20 h-4 bg-[#515044]/5 rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="w-12 h-4 bg-[#515044]/5 rounded animate-pulse"></div>
                                        <div className="w-24 h-6 bg-[#515044]/5 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="w-full h-14 bg-[#515044]/10 rounded-2xl animate-pulse mt-4"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-xl rounded-[48px] p-24 text-center border-2 border-dashed border-[#515044]/5 animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 rounded-[40px] bg-[#515044]/5 flex items-center justify-center mx-auto mb-8">
                            <Calendar className="w-10 h-10 text-[#515044]/10" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#515044]">No Listings Found</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20 mt-4 max-w-xs mx-auto leading-relaxed">
                            Try adjusting your filters or check back later for new broadcast slots.
                        </p>
                        <Button
                            variant="link"
                            onClick={() => {
                                setFilterDay("all");
                                setFilterType("all");
                            }}
                            className="mt-6 text-[#515044] font-bold text-[10px] uppercase tracking-[0.2em] underline-offset-8"
                        >
                            Reset all filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
                        {filteredListings.map(listing => (
                            <RentalNFTCard
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
