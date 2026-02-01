
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Zap, Loader2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { WEB3_RADIO_ACCESS_PASS_ADDRESS, WEB3_RADIO_ACCESS_PASS_ABI } from '@/config/contracts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTimeSlotFromTokenId, getCurrentUTCTime } from '@/utils/timeSlots';

interface ClaimSuperHourModalProps {
    tokenId: string; // The Super Access Token ID owned by the user
}

const ClaimSuperHourModal: React.FC<ClaimSuperHourModalProps> = ({ tokenId }) => {
    const [open, setOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState<string>("");
    const { toast } = useToast();
    const { address } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();

    // Parse Token Info
    const timeSlot = getTimeSlotFromTokenId(parseInt(tokenId));
    const { dayIndex: currentDayIndex } = getCurrentUTCTime();

    // Check if it's the right day to claim
    // (Assuming Super Access Token for Monday can only be used to claim an hour on Monday)
    const isCorrectDay = timeSlot.dayIndex === currentDayIndex;

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Read current claim status
    const { data: claimData } = useReadContract({
        address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
        abi: WEB3_RADIO_ACCESS_PASS_ABI,
        functionName: 'superClaims',
        args: [BigInt(tokenId)],
    });

    // Parse claim data (claimedHour, weekIndex)
    // If weekIndex matches current week, it's already claimed
    // Logic to check week index matching contract's global week index would be better
    // But for UI, we can just let the user try or read currentWeekIndex from contract too.

    const handleClaim = async () => {
        if (!address) return;
        if (!selectedHour) return;

        try {
            writeContract({
                address: WEB3_RADIO_ACCESS_PASS_ADDRESS,
                abi: WEB3_RADIO_ACCESS_PASS_ABI,
                functionName: 'claimSuperHour',
                args: [BigInt(tokenId), parseInt(selectedHour)],
            });
        } catch (error: any) {
            toast({
                title: "Transaction Failed",
                description: error.message || "Failed to claim hour.",
                variant: "destructive",
            });
        }
    };

    React.useEffect(() => {
        if (isConfirmed) {
            toast({
                title: "Hour Claimed! ⚡",
                description: `You have activated ${selectedHour}:00 - ${parseInt(selectedHour) + 1}:00.`,
            });
            setOpen(false);
        }
    }, [isConfirmed]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 gap-2">
                    <Zap className="w-4 h-4" />
                    Activate Hour
                </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border/50 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Activate Super Access
                    </DialogTitle>
                    <DialogDescription>
                        Pass #{tokenId} • {timeSlot.day} - Select an hour to activate your access for this week.
                    </DialogDescription>
                </DialogHeader>

                {!isCorrectDay ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wrong Day</AlertTitle>
                        <AlertDescription>
                            This pass is for {timeSlot.day}s. Today is not {timeSlot.day}.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4 mt-4">
                        <div className="p-4 rounded-lg bg-secondary/20 space-y-2 text-sm">
                            <p>You can activate <strong>1 hour</strong> of access for today.</p>
                            <p className="text-muted-foreground">Once activated, it cannot be changed for this week.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Hour (UTC)</Label>
                            <Select onValueChange={setSelectedHour} value={selectedHour}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose activation hour" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <SelectItem key={i} value={i.toString()}>
                                            {i.toString().padStart(2, '0')}:00 - {(i + 1) % 24}:00 UTC
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleClaim}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                            disabled={!selectedHour || isPending || isConfirming}
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Activating...
                                </>
                            ) : (
                                "Confirm Activation"
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ClaimSuperHourModal;
