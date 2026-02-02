import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { WEB3_RADIO_ACCESS_PASS_ADDRESS, WEB3_RADIO_ACCESS_PASS_ABI, RENTAL_MARKETPLACE_ADDRESS, RENTAL_MARKETPLACE_ABI } from '@/config/contracts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTimeSlotFromTokenId } from '@/utils/timeSlots';
import { parseEther } from 'viem';

const CreateListingModal = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { address } = useAccount();

    // Form states
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("24");
    const [timeSlotDisplay, setTimeSlotDisplay] = useState<string | null>(null);

    // Contract Reads
    const { data: ownerOfResult } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'ownerOf',
        args: tokenId ? [BigInt(tokenId)] : undefined,
    });

    const { data: isSuperResult } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'isSuper',
        args: tokenId ? [BigInt(tokenId)] : undefined,
    });

    const { data: isApprovedForAll } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'isApprovedForAll',
        args: address ? [address as `0x${string}`, RENTAL_MARKETPLACE_ADDRESS as `0x${string}`] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // Contract Writes
    const { writeContract: writeNft, data: nftHash } = useWriteContract();
    const { writeContract: writeMarket, data: marketHash } = useWriteContract();

    const { isLoading: isNftConfirming, isSuccess: isNftSuccess } = useWaitForTransactionReceipt({
        hash: nftHash,
    });

    const { isLoading: isMarketConfirming, isSuccess: isMarketSuccess } = useWaitForTransactionReceipt({
        hash: marketHash,
    });

    // Validation Status
    const isOwner = ownerOfResult && address && ownerOfResult.toString().toLowerCase() === address.toLowerCase();
    const isSuper = Boolean(isSuperResult);

    const handleTokenIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTokenId(val);

        if (val && !isNaN(parseInt(val))) {
            try {
                const slot = getTimeSlotFromTokenId(parseInt(val));
                setTimeSlotDisplay(slot.displayTime);
                if (slot.isSuper) setDuration("24");
                else setDuration("168");
            } catch (err) {
                setTimeSlotDisplay(null);
            }
        } else {
            setTimeSlotDisplay(null);
        }
    };

    const handleApprove = async () => {
        try {
            writeNft({
                address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
                abi: WEB3_RADIO_ACCESS_PASS_ABI,
                functionName: 'setApprovalForAll',
                args: [RENTAL_MARKETPLACE_ADDRESS as `0x${string}`, true],
            });
        } catch (error: any) {
            toast({
                title: "Approval Failed",
                description: error.message || "Failed to grant approval.",
                variant: "destructive"
            });
        }
    };

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isOwner) {
            toast({
                title: "Validation Error",
                description: "You do not own this Token ID.",
                variant: "destructive"
            });
            return;
        }

        const maxAllowed = isSuper ? 24 : 168;
        if (parseInt(duration) > maxAllowed) {
            toast({
                title: "Validation Error",
                description: `Max duration for ${isSuper ? 'Super' : 'Regular'} Access is ${maxAllowed} hours.`,
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            writeMarket({
                address: RENTAL_MARKETPLACE_ADDRESS as `0x${string}`,
                abi: RENTAL_MARKETPLACE_ABI,
                functionName: 'createListing',
                args: [BigInt(tokenId), parseEther(price), BigInt(duration)],
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create listing.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        const syncListingToDatabase = async () => {
            if (isMarketSuccess && address) {
                try {
                    const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');
                    await fetch(`${baseUrl}/api/rentals`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            token_id: tokenId,
                            lender: address,
                            price_per_hour: price,
                            max_duration_hours: duration,
                            is_super_access: isSuper
                        })
                    });
                    
                    toast({
                        title: "Listing Created! 🎉",
                        description: `Pass #${tokenId} is now available for rent in the marketplace.`,
                    });
                } catch (err) {
                    console.error('Failed to sync listing to database:', err);
                    toast({
                        title: "Listing Created On-Chain",
                        description: `Pass #${tokenId} listed on-chain. Database sync may be delayed.`,
                    });
                }
                setOpen(false);
            }
        };
        
        syncListingToDatabase();
    }, [isMarketSuccess, tokenId, address, price, duration, isSuper, toast]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="btn-apple-primary gap-2">
                    <PlusCircle className="w-4 h-4" />
                    List My Pass
                </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border/50 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>List Access Pass for Rent</DialogTitle>
                    <DialogDescription>
                        Set your price and duration to start earning from your pass.
                    </DialogDescription>
                </DialogHeader>

                {!address ? (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet Not Connected</AlertTitle>
                        <AlertDescription>
                            Please connect your wallet to verify ownership.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleCreateListing} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="tokenId">Token ID</Label>
                            <Input
                                id="tokenId"
                                placeholder="e.g. 101"
                                value={tokenId}
                                onChange={handleTokenIdChange}
                                required
                            />
                            {tokenId && ownerOfResult && (
                                <div className="flex flex-col gap-1">
                                    <p className={`text-xs ${isOwner ? 'text-green-500' : 'text-red-500'}`}>
                                        {isOwner
                                            ? `✓ You own this ${isSuper ? 'Super' : 'Regular'} Pass`
                                            : "✗ You do not own this token"}
                                    </p>
                                    {timeSlotDisplay && (
                                        <div className="flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 p-1.5 rounded">
                                            <Calendar className="w-3 h-3" />
                                            {timeSlotDisplay}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price per Hour (ETH)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.0001"
                                placeholder="0.001"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Max Duration (Hours)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                                max={isSuper ? 24 : 168}
                            />
                            {tokenId && (
                                <p className="text-xs text-muted-foreground">
                                    Limit: {isSuper ? '24 hours (1 Day)' : '168 hours (7 Days)'}
                                </p>
                            )}
                        </div>

                        {!isApprovedForAll ? (
                            <Button
                                type="button"
                                onClick={handleApprove}
                                className="w-full btn-apple-primary mt-4"
                                disabled={isNftConfirming || !isOwner}
                            >
                                {isNftConfirming ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Approving Marketplace...
                                    </>
                                ) : (
                                    "Approve Marketplace"
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full btn-apple-primary mt-4"
                                disabled={isLoading || isMarketConfirming || !isOwner}
                            >
                                {isLoading || isMarketConfirming ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Listing...
                                    </>
                                ) : (
                                    "Create Listing"
                                )}
                            </Button>
                        )}
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateListingModal;
