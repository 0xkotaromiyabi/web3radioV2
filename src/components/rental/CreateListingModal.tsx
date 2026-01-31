import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useReadContract } from 'wagmi';
import { WEB3_RADIO_ACCESS_PASS_ADDRESS, WEB3_RADIO_ACCESS_PASS_ABI } from '@/config/contracts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTimeSlotFromTokenId } from '@/utils/timeSlots';

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
        query: {
            enabled: !!tokenId,
        }
    });

    const { data: isSuperResult } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'isSuper',
        args: tokenId ? [BigInt(tokenId)] : undefined,
        query: {
            enabled: !!tokenId,
        }
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

        const maxAllowed = isSuper ? 24 : 168; // 1 day or 7 days
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
            // TODO: Signature generation or DB insert logic
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating delay

            toast({
                title: "Listing Created",
                description: `Pass #${tokenId} listed for rent successfully (Mock).`,
            });
            setOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create listing. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

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

                        <Button
                            type="submit"
                            className="w-full btn-apple-primary mt-4"
                            disabled={isLoading || !isOwner}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Listing"
                            )}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateListingModal;
