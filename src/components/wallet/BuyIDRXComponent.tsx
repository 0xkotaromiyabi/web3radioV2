
import React, { useState, useEffect } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRightLeft, ExternalLink, Wallet } from "lucide-react";

// Admin Treasury Address for "Buying" IDRX via Direct Transfer
const TREASURY_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC

// Exchange Rates (Approximate for Demo)
const IDR_PER_USD = 16250;
const IDRX_PER_ETH = 48750000;
const ETH_PRICE_USD = 3000;

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

export default function BuyIDRXComponent() {
    const { open } = useAppKit();
    const { address, isConnected } = useAccount();
    const { toast } = useToast();

    const [paymentToken, setPaymentToken] = useState<'ETH' | 'USDC'>('USDC');
    const [buyAmount, setBuyAmount] = useState<string>('');
    const [payAmount, setPayAmount] = useState<string>('0');

    useEffect(() => {
        if (!buyAmount || isNaN(parseFloat(buyAmount))) {
            setPayAmount('0');
            return;
        }

        const idrxQty = parseFloat(buyAmount);

        if (paymentToken === 'USDC') {
            const cost = idrxQty / IDR_PER_USD;
            setPayAmount(cost.toFixed(4));
        } else {
            const cost = idrxQty / IDRX_PER_ETH;
            setPayAmount(cost.toFixed(6));
        }
    }, [buyAmount, paymentToken]);

    const { sendTransaction, data: ethHash, isPending: isEthPending } = useSendTransaction();
    const { writeContract, data: usdcHash, isPending: isUsdcPending } = useWriteContract();

    const hash = paymentToken === 'ETH' ? ethHash : usdcHash;
    const isPending = isEthPending || isUsdcPending;

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleQuickAmount = (val: string) => {
        const numericVal = parseInt(val.replace('k', '000'));
        setBuyAmount(numericVal.toString());
    };

    const executeTransaction = () => {
        if (!payAmount || parseFloat(payAmount) <= 0) return;

        try {
            if (paymentToken === 'ETH') {
                sendTransaction({
                    to: TREASURY_ADDRESS,
                    value: parseEther(payAmount),
                });
            } else {
                writeContract({
                    address: USDC_ADDRESS,
                    abi: ERC20_ABI,
                    functionName: 'transfer',
                    args: [TREASURY_ADDRESS, parseUnits(payAmount, 6)],
                });
            }
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Transaction failed to initiate", variant: "destructive" });
        }
    };

    return (
        <Card className="p-4 bg-white border-gray-200 text-gray-900 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/26732.png" alt="IDRX" className="w-6 h-6 rounded-full" />
                        Buy IDRX
                    </h3>
                    <p className="text-xs text-blue-600">Direct Purchase via Treasury</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Base</Badge>
            </div>

            {!isConnected ? (
                <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-4">Connect wallet to purchase IDRX</p>
                    <Button onClick={() => open()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 ml-1">Pay With</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={paymentToken === 'USDC' ? 'default' : 'outline'}
                                onClick={() => setPaymentToken('USDC')}
                                className={paymentToken === 'USDC' ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"}
                            >
                                USDC
                            </Button>
                            <Button
                                variant={paymentToken === 'ETH' ? 'default' : 'outline'}
                                onClick={() => setPaymentToken('ETH')}
                                className={paymentToken === 'ETH' ? "bg-purple-600 hover:bg-purple-700 text-white shadow-sm" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"}
                            >
                                ETH
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 ml-1">Amount to Buy (IDRX)</label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(e.target.value)}
                                placeholder="0"
                                className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 pr-16 shadow-sm"
                            />
                            <span className="absolute right-3 top-2.5 text-gray-500 text-sm font-bold">IDRX</span>
                        </div>
                        <div className="flex justify-between items-center text-xs px-1">
                            <span className="text-gray-600">
                                Est. Cost: <span className="text-gray-900 font-mono font-semibold">{payAmount} {paymentToken}</span>
                            </span>
                            <span className="text-gray-500">
                                (≈ ${(parseFloat(payAmount) * (paymentToken === 'ETH' ? ETH_PRICE_USD : 1)).toFixed(2)})
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {['50k', '100k', '250k', '500k'].map((label) => (
                            <Button
                                key={label}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickAmount(label)}
                                className="bg-white border-gray-200 hover:bg-gray-50 text-xs text-gray-700 shadow-sm"
                            >
                                {label}
                            </Button>
                        ))}
                    </div>

                    <Button
                        onClick={executeTransaction}
                        disabled={isPending || isConfirming || !buyAmount || parseFloat(buyAmount) <= 0}
                        className={`w-full font-bold shadow-md ${paymentToken === 'USDC' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                    >
                        {isPending || isConfirming ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                Buy {buyAmount ? buyAmount : '0'} IDRX
                            </>
                        )}
                    </Button>

                    {isPending && !hash && (
                        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-xs text-center border border-yellow-200">
                            ⏳ Waiting for wallet confirmation...
                        </div>
                    )}

                    {hash && !isSuccess && (
                        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-xs text-center border border-blue-200">
                            ⏳ Confirming on Base network...
                        </div>
                    )}

                    {isSuccess && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs flex items-center justify-between border border-green-200">
                            <span className="font-medium">✅ Purchase Successful!</span>
                            <a
                                href={`https://basescan.org/tx/${hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center hover:underline text-green-800"
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
