
import React, { useState } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Coins, ArrowRightLeft, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// IDRX Config
const IDRX_ADDRESS = "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22";
const TIP_RECIPIENT = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
const IDRX_DECIMALS = 2;
const IDRX_IMAGE = "https://s2.coinmarketcap.com/static/img/coins/64x64/26732.png";

const ERC20_ABI = [
    {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    }
] as const;

export function IdrxBuy() {
    const { open } = useAppKit();
    const [amount, setAmount] = useState<string>('');

    const handleBuy = () => {
        // Open Reown Swap/OnRamp View
        // Note: Deep linking specific tokens isn't fully supported in all AppKit versions yet via open(),
        // but view: 'Swap' gets them to the right place.
        open({ view: 'Swap' });
    };

    return (
        <Card className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <div className="flex items-center gap-3 mb-4">
                <img src={IDRX_IMAGE} alt="IDRX" className="w-8 h-8 rounded-full" />
                <div>
                    <h3 className="font-bold text-white">Buy IDRX</h3>
                    <p className="text-xs text-blue-400">Available on Base Network</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <Input
                        type="number"
                        placeholder="Amount to Buy (Reference)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white pr-16"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium">IDRX</span>
                </div>

                <Button
                    onClick={handleBuy}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Swap / Buy via AppKit
                </Button>
                <p className="text-[10px] text-gray-400 text-center">
                    Opens Reown AppKit Swap. Select IDRX (Base) manually if not pre-selected.
                </p>
            </div>
        </Card>
    );
}

export function IdrxTip() {
    const { address } = useAccount();
    const [amount, setAmount] = useState<string>('');
    const { toast } = useToast();

    const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleTip = () => {
        if (!amount || parseFloat(amount) <= 0) return;

        try {
            const value = parseUnits(amount, IDRX_DECIMALS);

            writeContract({
                address: IDRX_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [TIP_RECIPIENT, value],
            });
        } catch (error) {
            console.error("Tip failed:", error);
            toast({
                title: "Error",
                description: "Invalid amount or configuration",
                variant: "destructive"
            });
        }
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Tip Sent! 🚀",
                description: `Successfully sent ${amount} IDRX`,
            });
            setAmount('');
        }
    }, [isSuccess, amount, toast]);

    const isPending = isWritePending || isConfirming;

    return (
        <Card className="p-4 bg-gradient-to-br from-indigo-900 to-gray-900 border-indigo-700/50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-full">
                        <Coins className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Tip Web3Radio</h3>
                        <p className="text-xs text-indigo-300">Support us with IDRX</p>
                    </div>
                </div>
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                    Base
                </Badge>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-800/50 border-indigo-500/30 text-white pr-16 focus:border-indigo-500"
                    />
                    <span className="absolute right-3 top-2.5 text-indigo-300 text-sm font-medium">IDRX</span>
                </div>

                <Button
                    onClick={handleTip}
                    disabled={!address || isPending || !amount}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Tip
                        </>
                    )}
                </Button>

                {writeError && (
                    <p className="text-xs text-red-400 text-center">
                        {writeError.message.slice(0, 50)}...
                    </p>
                )}
            </div>
        </Card>
    );
}

export default function IdrxOperations() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <IdrxBuy />
            <IdrxTip />
        </div>
    );
}
