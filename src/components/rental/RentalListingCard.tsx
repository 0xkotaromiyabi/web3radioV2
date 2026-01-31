import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Key } from "lucide-react";

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
    return (
        <Card className="glass border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary" />
                        Pass #{listing.tokenId}
                    </CardTitle>
                    {listing.isSuperAccess && (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                            Super Access
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
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
                    className="w-full btn-apple-primary"
                    onClick={() => onRent(listing.id)}
                >
                    Rent Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default RentalListingCard;
