
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CreateListingModal = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Form states
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("24");

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Implement contract interaction and Supabase insert
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating delay

            toast({
                title: "Listing Created",
                description: `Pass #${tokenId} listed for rent successfully.`,
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
                <form onSubmit={handleCreateListing} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="tokenId">Token ID</Label>
                        <Input
                            id="tokenId"
                            placeholder="e.g. 101"
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                            required
                        />
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
                        />
                    </div>
                    <Button type="submit" className="w-full btn-apple-primary mt-4" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                creating...
                            </>
                        ) : (
                            "Create Listing"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateListingModal;
