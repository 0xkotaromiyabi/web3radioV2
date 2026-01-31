import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Key, Calendar, Radio } from "lucide-react";
import { getTimeSlotFromTokenId, isTokenActiveNow } from "@/utils/timeSlots";

interface Listing {
    id: string;
    tokenId: string;
    lender: string;
    pricePerHour: string;
    maxDuration: number;
    isSuperAccess: boolean;
}

interface RentalListingCardProps {
    listing: Listing;
    onRent: (listingId: string) => void;
}

const RentalListingCard: React.FC<RentalListingCardProps> = ({ listing, onRent }) => {
    const timeSlot = getTimeSlotFromTokenId(parseInt(listing.tokenId));
    const isActiveNow = !timeSlot.isSuper && isTokenActiveNow(parseInt(listing.tokenId));

    return (
        <Card className={`glass border-border/50 hover:border-primary/50 transition-all duration-300 ${isActiveNow ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-background' : ''}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary" />
                        Pass #{listing.tokenId}
                    </CardTitle>
                    <div className="flex flex-col gap-1 items-end">
                        {listing.isSuperAccess ? (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                🌟 Super Access
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                Regular Access
                            </Badge>
                        )}
                        {isActiveNow && (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 animate-pulse">
                                ⚡ ACTIVE NOW
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Time Slot Display */}
                    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Time Slot
                            </span>
                        </div>
                        <p className="text-sm font-bold">
                            {timeSlot.displayTime}
                        </p>
                        {timeSlot.isSuper && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Flexible 1-hour weekly activation
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Lender</span>
                        <span className="font-mono">{listing.lender.slice(0, 6)}...{listing.lender.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold text-lg">{listing.pricePerHour} ETH/hr</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/20 p-2 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>Max Duration: {listing.maxDuration} hours</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className={`w-full ${isActiveNow ? 'btn-apple-primary bg-green-600 hover:bg-green-700' : 'btn-apple-primary'}`}
                    onClick={() => onRent(listing.id)}
                >
                    {isActiveNow ? (
                        <>
                            <Radio className="w-4 h-4 mr-2 animate-pulse" />
                            Rent Active Slot
                        </>
                    ) : (
                        'Rent Now'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default RentalListingCard;
