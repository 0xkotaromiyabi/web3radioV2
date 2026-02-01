import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Clock, Coins, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { WEB3_RADIO_ACCESS_PASS_ADDRESS, WEB3_RADIO_ACCESS_PASS_ABI } from '@/config/contracts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { sepolia, base } from 'wagmi/chains';
import { RENTAL_MARKETPLACE_ADDRESS, RENTAL_MARKETPLACE_ABI } from '@/config/contracts';
import { parseEther, parseUnits } from 'viem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Listing {
    id: string;
    tokenId: string;
    lender: string;
    pricePerHour: string;
    maxDuration: number;
    isSuperAccess: boolean;
}

interface RentModalProps {
    listing: Listing | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const RentModal: React.FC<RentModalProps> = ({ listing, open, onOpenChange }) => {
    const [rentalHours, setRentalHours] = useState("24");
    const [paymentMethod, setPaymentMethod] = useState<'eth' | 'usdc'>('eth');
    const { toast } = useToast();
    const { address } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { switchChain } = useSwitchChain();
    const { chain } = useAccount();

    const USDC_ADDRESS = chain?.id === base.id
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x1c7D4B196Cb02324016fdD330689b09Be8697A21"; // Sepolia USDC

    const { data: usdcAllowance } = useReadContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: [
            {
                name: 'allowance',
                type: 'function',
                stateMutability: 'view',
                inputs: [
                    { name: 'owner', type: 'address' },
                    { name: 'spender', type: 'address' },
                ],
                outputs: [{ name: '', type: 'uint256' }],
            },
        ],
        functionName: 'allowance',
        args: address ? [address as `0x${string}`, RENTAL_MARKETPLACE_ADDRESS as `0x${string}`] : undefined,
        query: {
            enabled: !!address && paymentMethod === 'usdc',
        }
    });

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    React.useEffect(() => {
        if (isConfirmed) {
            toast({
                title: "Rental Successful! 🎉",
                description: `You now have access for ${rentalHours} hours.`,
            });
            onOpenChange(false);
        }
    }, [isConfirmed, rentalHours, onOpenChange, toast]);

    if (!listing) return null;

    const totalPrice = (parseFloat(listing.pricePerHour) * parseInt(rentalHours)).toFixed(4);
    const expiresTimestamp = Math.floor(Date.now() / 1000) + (parseInt(rentalHours) * 3600);

    const handleRent = async () => {
        if (!address) {
            toast({
                title: "Wallet Not Connected",
                description: "Please connect your wallet to rent.",
                variant: "destructive",
            });
            return;
        }

        try {
            // Check if on correct chain (assuming Sepolia for now, or match listing network)
            if (chain?.id !== sepolia.id && chain?.id !== base.id) {
                switchChain({ chainId: sepolia.id });
                return;
            }

            if (paymentMethod === 'eth') {
                writeContract({
                    address: RENTAL_MARKETPLACE_ADDRESS as `0x${string}`,
                    abi: RENTAL_MARKETPLACE_ABI,
                    functionName: 'rentWithETH',
                    args: [BigInt(listing.tokenId), BigInt(rentalHours)],
                    value: parseEther(totalPrice),
                });
            } else {
                // Check allowance
                const needed = parseUnits(totalPrice, 6); // USDC has 6 decimals
                if (!usdcAllowance || BigInt(usdcAllowance.toString()) < needed) {
                    writeContract({
                        address: USDC_ADDRESS as `0x${string}`,
                        abi: [{
                            name: 'approve',
                            type: 'function',
                            stateMutability: 'nonpayable',
                            inputs: [
                                { name: 'spender', type: 'address' },
                                { name: 'amount', type: 'uint256' },
                            ],
                            outputs: [{ name: '', type: 'bool' }],
                        }],
                        functionName: 'approve',
                        args: [RENTAL_MARKETPLACE_ADDRESS as `0x${string}`, needed],
                    });
                    return;
                }

                writeContract({
                    address: RENTAL_MARKETPLACE_ADDRESS as `0x${string}`,
                    abi: RENTAL_MARKETPLACE_ABI,
                    functionName: 'rentWithUSDC',
                    args: [BigInt(listing.tokenId), BigInt(rentalHours)],
                });
            }
        } catch (error: any) {
            toast({
                title: "Transaction Failed",
                description: error.message || "Failed to rent access pass.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass border-border/50 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rent Access Pass #{listing.tokenId}</DialogTitle>
                    <DialogDescription>
                        {listing.isSuperAccess ? 'Super Access' : 'Regular Access'} Pass
                    </DialogDescription>
                </DialogHeader>

                {!address ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet Not Connected</AlertTitle>
                        <AlertDescription>
                            Please connect your wallet to proceed.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4 mt-4">
                        <div className="p-4 rounded-lg bg-secondary/20 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Price per Hour</span>
                                <span className="font-semibold">{listing.pricePerHour} ETH</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Lender</span>
                                <span className="font-mono text-xs">{listing.lender.slice(0, 6)}...{listing.lender.slice(-4)}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hours" className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Rental Duration (Hours)
                            </Label>
                            <Input
                                id="hours"
                                type="number"
                                value={rentalHours}
                                onChange={(e) => setRentalHours(e.target.value)}
                                min="1"
                                max={listing.maxDuration}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Max: {listing.maxDuration} hours
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Coins className="w-4 h-4" />
                                    Total Cost
                                </span>
                                <span className="text-lg font-bold">{totalPrice} ETH</span>
                            </div>
                        </div>

                        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'eth' | 'usdc')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-secondary/30">
                                <TabsTrigger value="eth">Pay with ETH</TabsTrigger>
                                <TabsTrigger value="usdc">Pay with USDC</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Note</AlertTitle>
                            <AlertDescription>
                                This transaction will grant you temporary access rights. The NFT owner retains ownership.
                            </AlertDescription>
                        </Alert>

                        <Button
                            onClick={handleRent}
                            className="w-full btn-apple-primary"
                            disabled={isPending || isConfirming}
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isPending ? 'Confirm in Wallet...' : 'Processing...'}
                                </>
                            ) : (
                                paymentMethod === 'usdc' && (!usdcAllowance || BigInt(usdcAllowance.toString()) < parseUnits(totalPrice, 6))
                                    ? "Approve USDC"
                                    : `Rent for ${totalPrice} ${paymentMethod.toUpperCase()}`
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RentModal;
