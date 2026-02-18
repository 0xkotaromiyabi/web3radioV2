import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart } from "lucide-react";

const DESTINATION_WALLET = "9xhz4Cb4C2Z4z9xdD2geCafovNYVngC4E4XpWtQmeEuv";

export default function SolanaTipComponent() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { toast } = useToast();
    const [amount, setAmount] = useState<string>('0.1');
    const [isSending, setIsSending] = useState(false);

    const handleSendTip = async () => {
        if (!publicKey) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your Solana wallet first.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSending(true);
            const recipientPubKey = new PublicKey(DESTINATION_WALLET);
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');

            toast({
                title: "Tip Sent! 💖",
                description: `Thank you for tipping ${amount} SOL to Web3Radio!`,
            });
            setAmount('0.1');
        } catch (error: any) {
            console.error("Tip failed:", error);
            toast({
                title: "Transaction Failed",
                description: error.message || "Failed to send tip.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="mt-6 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-[#515044]/10 shadow-xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                    <h3 className="text-sm font-bold text-[#515044] mb-1">Support the Broadcaster</h3>
                    <p className="text-[10px] text-[#515044]/60 uppercase tracking-widest">Send a tip via Solana</p>
                </div>

                <div className="flex gap-2 w-full max-w-xs">
                    <div className="relative flex-1">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 bg-[#fef29c]/20 border border-[#515044]/10 rounded-xl text-sm font-bold text-[#515044] focus:outline-none focus:border-[#515044]/40 transition-all pr-12"
                            step="0.1"
                            min="0.01"
                            placeholder="0.1"
                        />
                        <span className="absolute right-3 top-3 text-[10px] font-bold text-[#515044]/40">SOL</span>
                    </div>

                    <button
                        onClick={handleSendTip}
                        disabled={isSending || !amount}
                        className="px-6 py-3 bg-[#515044] text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Heart className="w-4 h-4 fill-current" />
                        )}
                        Send Tip
                    </button>
                </div>

                <p className="text-[9px] text-[#515044]/40 break-all font-mono">
                    Rec: {DESTINATION_WALLET}
                </p>
            </div>
        </div>
    );
}
