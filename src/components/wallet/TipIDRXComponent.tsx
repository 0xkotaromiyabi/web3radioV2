
import React, { useState, useEffect } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, ExternalLink, Wallet } from "lucide-react";

// IDRX Config
const IDRX_ADDRESS = "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22";
const RECIPIENT_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
const IDRX_DECIMALS = 2; // confirmed from user request

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

export default function TipIDRXComponent() {
    const { open } = useAppKit();
    const { address, isConnected } = useAccount();
    const { toast } = useToast();

    const [amount, setAmount] = useState<string>('');

    const { writeContract, data: hash, isPending: isWritePending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Tip Sent! 🎉",
                description: `Thank you for tipping ${amount} IDRX!`,
            });
            setAmount('');
        }
    }, [isSuccess, amount, toast]);

    const handleTip = () => {
        if (!amount || parseFloat(amount) <= 0 || !address) return;

        try {
            writeContract({
                address: IDRX_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [RECIPIENT_ADDRESS, parseUnits(amount, IDRX_DECIMALS)],
                account: address,
            });
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Tip transaction failed", variant: "destructive" });
        }
    };

    return (
        <Card className="p-4 bg-white border-gray-200 text-gray-900 shadow-sm mt-4 md:mt-0">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                        <Send className="w-5 h-5 text-indigo-600" />
                        Tip IDRX
                    </h3>
                    <p className="text-xs text-indigo-500">Support Web3Radio Contributor</p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200">Support</Badge>
            </div>

            {!isConnected ? (
                <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-4">Connect wallet to send a tip</p>
                    <Button onClick={() => open()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="text-xs text-indigo-600 ml-1">Tip Amount (IDRX)</label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="bg-white border-gray-300 text-gray-900 focus:border-indigo-500 pr-12 shadow-sm"
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">IDRX</span>
                        </div>
                    </div>

                    {/* Quick Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {['10k', '25k', '50k', '100k'].map((label) => {
                            const val = label.replace('k', '000');
                            return (
                                <Button
                                    key={label}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmount(val)}
                                    className="bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-xs text-indigo-700 shadow-sm"
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={handleTip}
                        disabled={isWritePending || isConfirming || !amount}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
                    >
                        {isWritePending || isConfirming ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" /> Send Tip
                            </>
                        )}
                    </Button>

                    {/* Error Message */}
                    {error && (
                        <p className="text-xs text-red-600 text-center bg-red-50 p-2 rounded border border-red-200">
                            {error.message.split('.')[0]}
                        </p>
                    )}

                    {/* Success Status */}
                    {hash && (
                        <div className={`p-3 rounded-lg text-xs flex items-center justify-between ${isSuccess ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                            <span>{isSuccess ? 'Tip Sent Successfully!' : 'Confirming on Base...'}</span>
                            <a
                                href={`https://basescan.org/tx/${hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center hover:underline"
                            >
                                View <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
