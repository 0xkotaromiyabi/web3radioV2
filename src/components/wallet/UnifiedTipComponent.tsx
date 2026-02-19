import React, { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import {
    Connection,
    Transaction,
    SystemProgram,
    PublicKey,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, RefreshCw, Coins, Wallet, ShieldCheck, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EVM_DESTINATION = "0x242dfb7849544ee242b2265ca7e585bdec60456b";
const SOLANA_DESTINATION = "9xhz4Cb4C2Z4z9xdD2geCafovNYVngC4E4XpWtQmeEuv";
const SOLANA_RPC = import.meta.env.VITE_SOLANA_RPC || 'https://rpc.ankr.com/solana';

const IDR_PRESETS = [
    { label: '5K', value: 5000 },
    { label: '10K', value: 10000 },
    { label: '20K', value: 20000 },
];

function getCoinGeckoId(caipNetwork: any): string {
    const chainId = caipNetwork?.id;
    const name = (caipNetwork?.name || '').toLowerCase();

    if (chainId && String(chainId).startsWith('solana')) return 'solana';
    if (name.includes('bnb') || name.includes('bsc')) return 'binancecoin';
    if (name.includes('polygon') || name.includes('matic')) return 'matic-network';
    return 'ethereum';
}

export default function UnifiedTipComponent() {
    const { toast } = useToast();
    const [idrAmount, setIdrAmount] = useState<number>(10000);
    const [customIdr, setCustomIdr] = useState<string>('');
    const [isCustom, setIsCustom] = useState(false);
    const [cryptoAmount, setCryptoAmount] = useState<string>('0');
    const [priceIdr, setPriceIdr] = useState<number>(0);
    const [isLoadingPrice, setIsLoadingPrice] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { address, isConnected, caipAddress } = useAppKitAccount();
    const { caipNetwork } = useAppKitNetwork();
    const { walletProvider } = useAppKitProvider('solana');

    const isSolana = caipAddress && String(caipAddress).startsWith('solana:');
    const networkLabel = caipNetwork?.name || (isSolana ? 'Solana' : 'EVM');
    const nativeSymbol = caipNetwork?.nativeCurrency?.symbol || (isSolana ? 'SOL' : 'ETH');
    const coinGeckoId = getCoinGeckoId(caipNetwork);

    // EVM Hooks
    const { sendTransaction, data: hash } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const fetchPrice = useCallback(async () => {
        setIsLoadingPrice(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const res = await fetch(
                `https://oiciwwjpfypcivbbwjwa.supabase.co/functions/v1/w3r-api`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'get_price',
                        ids: coinGeckoId,
                        vs_currencies: 'idr'
                    }),
                    signal: controller.signal
                }
            );
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error('API or CORS error');
            const data = await res.json();
            const price = data[coinGeckoId]?.idr;
            if (price) setPriceIdr(price);
        } catch (err: any) {
            console.error('Failed to fetch price:', err);
            // Dynamic fallbacks to avoid zero division
            if (!priceIdr) {
                if (coinGeckoId === 'ethereum') setPriceIdr(45000000);
                else if (coinGeckoId === 'binancecoin') setPriceIdr(9000000);
                else if (coinGeckoId === 'solana') setPriceIdr(1500000);
                else setPriceIdr(1000000);
            }
        } finally {
            setIsLoadingPrice(false);
        }
    }, [coinGeckoId, priceIdr]);

    useEffect(() => { if (isConnected) fetchPrice(); }, [isConnected, coinGeckoId, fetchPrice]);

    useEffect(() => {
        if (priceIdr > 0) {
            const activeIdr = isCustom ? (parseFloat(customIdr) || 0) : idrAmount;
            const crypto = activeIdr / priceIdr;
            setCryptoAmount(crypto > 0 ? crypto.toFixed(8) : '0');
        }
    }, [idrAmount, customIdr, isCustom, priceIdr]);

    useEffect(() => {
        if (isSuccess) {
            toast({ title: "Tip Sent! 💖", description: "Thank you for supporting Web3Radio Contributor!" });
            setIsProcessing(false);
        }
    }, [isSuccess, toast]);

    const handleTipClick = () => {
        const activeIdr = isCustom ? (parseFloat(customIdr) || 0) : idrAmount;
        if (activeIdr <= 0 || parseFloat(cryptoAmount) <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a valid tip amount.", variant: "destructive" });
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirmSend = async () => {
        setShowConfirm(false);
        if (!isConnected || parseFloat(cryptoAmount) <= 0) return;

        try {
            setIsProcessing(true);

            if (isSolana) {
                if (!walletProvider || !address) {
                    throw new Error("Solana wallet provider not found");
                }

                const RPCS = [
                    import.meta.env.VITE_SOLANA_RPC,
                    'https://rpc.ankr.com/solana',
                    'https://solana-mainnet.rpc.extrnode.com',
                    'https://api.mainnet-beta.solana.com'
                ].filter(Boolean);

                let lastError = null;
                let success = false;

                for (const rpcUrl of RPCS) {
                    try {
                        console.log(`Trying Solana RPC: ${rpcUrl}`);
                        // @ts-ignore
                        const solanaConnection = new Connection(rpcUrl, {
                            commitment: "confirmed",
                            confirmTransactionInitialTimeout: 30000,
                        });

                        const transaction = new Transaction().add(
                            SystemProgram.transfer({
                                fromPubkey: new PublicKey(address),
                                toPubkey: new PublicKey(SOLANA_DESTINATION),
                                lamports: Math.floor(parseFloat(cryptoAmount) * LAMPORTS_PER_SOL),
                            })
                        );

                        const { blockhash } = await solanaConnection.getLatestBlockhash('confirmed');
                        transaction.recentBlockhash = blockhash;
                        transaction.feePayer = new PublicKey(address);

                        // @ts-ignore
                        const signedTransaction = await walletProvider.signTransaction(transaction);
                        const signature = await solanaConnection.sendRawTransaction(signedTransaction.serialize(), {
                            skipPreflight: false,
                            preflightCommitment: 'confirmed'
                        });

                        await solanaConnection.confirmTransaction(signature, 'confirmed');
                        success = true;
                        console.log(`Solana transaction successful via ${rpcUrl}`);
                        break; // Exit loop on success
                    } catch (err: any) {
                        console.warn(`RPC ${rpcUrl} failed:`, err.message);
                        lastError = err;
                        // Continue to next RPC
                    }
                }

                if (!success) {
                    throw lastError || new Error("All Solana RPC endpoints failed");
                }

                toast({ title: "Tip Sent! 💖", description: "Thank you for supporting Web3Radio!" });
                setIsProcessing(false);
            } else {
                // EVM
                sendTransaction({
                    to: EVM_DESTINATION as `0x${string}`,
                    value: parseEther(cryptoAmount)
                });
            }
        } catch (error: any) {
            console.error("Tip failed:", error);
            const isRejected = error.message?.toLowerCase().includes('rejected') ||
                error.message?.toLowerCase().includes('denied') ||
                error.code === 4001;
            toast({
                title: isRejected ? "Transaction Rejected" : "Transaction Failed",
                description: isRejected ? "You declined the transaction in your wallet." : (error.message || "Failed to send tip."),
                variant: "destructive",
            });
            setIsProcessing(false);
        }
    };

    if (!isConnected) return null;
    const activeIdr = isCustom ? (parseFloat(customIdr) || 0) : idrAmount;

    return (
        <div className="w-full max-w-[460px] md:max-w-[700px] font-['Raleway',_sans-serif]">
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
            `}</style>

            {/* Confirmation Overlay */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setShowConfirm(false)}>
                    <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-2xl p-8 w-full max-w-sm border border-[#515044]/10 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-6">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-14 h-14 rounded-3xl bg-[#515044]/5 flex items-center justify-center mb-2">
                                    <ShieldCheck className="w-7 h-7 text-[#515044]/60" />
                                </div>
                                <h3 className="text-xl font-bold text-[#515044]">Confirm Support</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 leading-relaxed max-w-[200px]">
                                    Verify your transaction details before approving in your wallet.
                                </p>
                            </div>

                            <div className="bg-[#fef29c]/30 rounded-[32px] p-6 space-y-4 border border-[#515044]/5">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-[#515044]/40">Network</span>
                                    <span className="text-[#515044]">{networkLabel}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-[#515044]/40">Amount</span>
                                    <div className="text-right">
                                        <div className="text-[#515044]">Rp {activeIdr.toLocaleString('id-ID')}</div>
                                        <div className="text-[#515044]/30 text-[8px]">{cryptoAmount} {nativeSymbol}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-[#515044]/40">To</span>
                                    <span className="font-mono text-[#515044]">
                                        {isSolana
                                            ? `${SOLANA_DESTINATION.slice(0, 6)}...${SOLANA_DESTINATION.slice(-4)}`
                                            : `${EVM_DESTINATION.slice(0, 6)}...${EVM_DESTINATION.slice(-4)}`
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-[#515044]/5 rounded-2xl">
                                <AlertTriangle className="w-4 h-4 text-[#515044]/40 flex-shrink-0 mt-0.5" />
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#515044]/40 leading-relaxed">
                                    Approval required in your <strong>wallet extension</strong>. Double check address & chains.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-6 py-4 rounded-2xl border border-[#515044]/10 text-[10px] font-bold uppercase tracking-widest text-[#515044]/60 hover:bg-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmSend}
                                    className="px-6 py-4 bg-[#515044] hover:bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#515044]/10"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Tip Card */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] p-8 border border-[#515044]/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Coins className="w-48 h-48 text-[#515044]" />
                </div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    {/* Left Column: Preset Selection */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Badge className="bg-[#515044]/5 text-[#515044]/60 hover:bg-[#515044]/10 border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                    Community support
                                </Badge>
                                <h2 className="text-xl font-bold text-[#515044] tracking-tight">Direct Support</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {IDR_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    onClick={() => { setIdrAmount(preset.value); setIsCustom(false); }}
                                    className={`px-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${!isCustom && idrAmount === preset.value
                                        ? 'bg-[#515044] text-white border-[#515044] shadow-lg shadow-[#515044]/20'
                                        : 'bg-white/50 text-[#515044]/60 border-[#515044]/5 hover:border-[#515044]/20 hover:bg-white'
                                        }`}
                                >
                                    Rp {preset.label}
                                </button>
                            ))}
                            <button
                                onClick={() => setIsCustom(true)}
                                className={`px-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${isCustom
                                    ? 'bg-[#515044] text-white border-[#515044] shadow-lg shadow-[#515044]/20'
                                    : 'bg-white/50 text-[#515044]/60 border-[#515044]/5 hover:border-[#515044]/20 hover:bg-white'
                                    }`}
                            >
                                Custom
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                            <div className={`w-1.5 h-1.5 rounded-full ${isProcessing || isConfirming ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                            {networkLabel}
                            {!isLoadingPrice ? (
                                <button onClick={fetchPrice} className="hover:text-[#515044] transition-colors ml-2"><RefreshCw className="w-3 h-3" /></button>
                            ) : (
                                <Loader2 className="w-3 h-3 animate-spin ml-2 opacity-30" />
                            )}
                        </div>
                    </div>

                    {/* Right Column: Amount & Send */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="bg-[#515044]/[0.02] rounded-3xl p-6 border border-[#515044]/5 min-h-[140px] flex flex-col justify-center">
                            {isCustom ? (
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 text-center">Enter Custom Amount</p>
                                    <div className="relative">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#515044]/30">Rp</span>
                                        <input
                                            type="number"
                                            value={customIdr}
                                            onChange={(e) => setCustomIdr(e.target.value)}
                                            className="w-full pl-8 bg-transparent border-none text-2xl font-bold text-[#515044] focus:outline-none placeholder-[#515044]/10"
                                            placeholder="0"
                                            autoFocus
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#515044]/10" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-[#515044]/40">
                                            {cryptoAmount} <span className="text-[10px] font-light">{nativeSymbol}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30">Estimated Value</p>
                                    <div className="text-3xl font-black text-[#515044] tracking-tight">
                                        {isLoadingPrice ? (
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto opacity-20" />
                                        ) : (
                                            <>
                                                {cryptoAmount} <span className="text-base font-light text-[#515044]/40">{nativeSymbol}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#515044]/20 border-t border-[#515044]/5 pt-2 inline-block">
                                        Approx. Rp {activeIdr.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleTipClick}
                            disabled={isProcessing || isConfirming || isLoadingPrice || parseFloat(cryptoAmount) <= 0}
                            className="w-full bg-[#515044] hover:bg-black text-white font-bold py-6 rounded-[28px] transition-all shadow-xl shadow-[#515044]/10 uppercase text-[12px] tracking-[0.3em] disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 group active:scale-[0.98]"
                        >
                            {isProcessing || isConfirming ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Heart className="w-5 h-5 transition-transform group-hover:scale-125 group-hover:fill-current" />
                                    Send Support
                                </>
                            )}
                        </button>

                        {!isLoadingPrice && priceIdr > 0 && (
                            <p className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/20 text-center flex items-center justify-center gap-2">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Rate: 1 {nativeSymbol} = Rp {Math.floor(priceIdr).toLocaleString('id-ID')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
