import React, { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, ExternalLink, ShieldCheck, AlertTriangle, RefreshCw, Coins, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EVM_DESTINATION = "0x242dfb7849544ee242b2265ca7e585bdec60456b";
const SOLANA_DESTINATION = "9xhz4Cb4C2Z4z9xdD2geCafovNYVngC4E4XpWtQmeEuv";

const IDR_PRESETS = [
    { label: '1K', value: 1000 },
    { label: '5K', value: 5000 },
    { label: '10K', value: 10000 },
    { label: '50K', value: 50000 },
    { label: '100K', value: 100000 },
];

function getCoinGeckoId(chainName: string | undefined, isSolana: boolean): string {
    if (isSolana) return 'solana';
    const name = (chainName || '').toLowerCase();
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

    const isSolana = caipAddress?.startsWith('solana:') ?? false;
    const isEvm = isConnected && !isSolana;

    const { sendTransaction: sendEvmTx, data: evmHash } = useSendTransaction();
    const { isLoading: isEvmConfirming, isSuccess: isEvmSuccess } = useWaitForTransactionReceipt({ hash: evmHash });

    const { connection } = useConnection();
    const { publicKey: solanaPubKey, sendTransaction: sendSolanaTx } = useWallet();

    const nativeSymbol = isSolana ? 'SOL' : (caipNetwork?.nativeCurrency?.symbol || 'ETH');
    const destination = isSolana ? SOLANA_DESTINATION : EVM_DESTINATION;
    const networkLabel = caipNetwork?.name || (isSolana ? 'Solana' : 'EVM');
    const coinGeckoId = getCoinGeckoId(caipNetwork?.name, isSolana);

    const fetchPrice = useCallback(async () => {
        setIsLoadingPrice(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const res = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=idr`,
                { signal: controller.signal }
            );
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error('API or CORS error');
            const data = await res.json();
            const price = data[coinGeckoId]?.idr;
            if (price) setPriceIdr(price);
        } catch (err: any) {
            console.error('Failed to fetch price:', err);
            if (!priceIdr) {
                if (coinGeckoId === 'ethereum') setPriceIdr(45000000);
                if (coinGeckoId === 'solana') setPriceIdr(1500000);
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
        if (isEvmSuccess) {
            toast({ title: "Tip Sent! 💖", description: "Thank you for supporting Web3Radio!" });
            setIsProcessing(false);
        }
    }, [isEvmSuccess, toast]);

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

            if (isEvm) {
                sendEvmTx({ to: EVM_DESTINATION as `0x${string}`, value: parseEther(cryptoAmount) });
            } else if (isSolana && solanaPubKey) {
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
                const recipientPubKey = new PublicKey(SOLANA_DESTINATION);
                const transaction = new Transaction({
                    recentBlockhash: blockhash,
                    feePayer: solanaPubKey
                }).add(
                    SystemProgram.transfer({
                        fromPubkey: solanaPubKey,
                        toPubkey: recipientPubKey,
                        lamports: Math.floor(parseFloat(cryptoAmount) * LAMPORTS_PER_SOL)
                    })
                );

                const signature = await sendSolanaTx(transaction, connection);
                await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'processed');

                toast({ title: "Tip Sent! 💖", description: `Thank you for tipping ${cryptoAmount} SOL!` });
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error("Tip failed:", error);
            const isRejected = error.message?.includes('rejected') || error.message?.includes('denied') || error.code === 4001;
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
        <div className="w-full max-w-sm font-['Raleway',_sans-serif]">
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
                                    <span className="font-mono text-[#515044]">{destination.slice(0, 6)}...{destination.slice(-4)}</span>
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
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Coins className="w-32 h-32 text-[#515044]" />
                </div>

                <div className="relative space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Badge className="bg-[#515044]/5 text-[#515044]/60 hover:bg-[#515044]/10 border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                                Community support
                            </Badge>
                            <h2 className="text-xl font-bold text-[#515044] tracking-tight">Direct Tip</h2>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                                <div className={`w-1.5 h-1.5 rounded-full ${isEvmConfirming ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                                {networkLabel}
                                {!isLoadingPrice && (
                                    <button onClick={fetchPrice} className="hover:text-[#515044] transition-colors"><RefreshCw className="w-3 h-3" /></button>
                                )}
                            </div>
                            {!isLoadingPrice && priceIdr > 0 && (
                                <p className="text-[9px] font-bold text-[#515044]/20 mt-0.5">1 {nativeSymbol} = Rp {Math.floor(priceIdr).toLocaleString('id-ID')}</p>
                            )}
                        </div>
                    </div>

                    {/* Presets Grid */}
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

                    {/* Input/Estimation Box */}
                    <div className="bg-[#515044]/2 rounded-3xl p-6 border border-[#515044]/5 space-y-4">
                        {isCustom ? (
                            <div className="relative">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#515044]/30">Rp</span>
                                <input
                                    type="number"
                                    value={customIdr}
                                    onChange={(e) => setCustomIdr(e.target.value)}
                                    className="w-full pl-6 bg-transparent border-none text-xl font-bold text-[#515044] focus:outline-none placeholder-[#515044]/10"
                                    placeholder="0"
                                    autoFocus
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#515044]/10" />
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mb-1">Estimated Value</p>
                                <div className="text-2xl font-bold text-[#515044]">
                                    {isLoadingPrice ? (
                                        <Loader2 className="w-5 h-5 animate-spin mx-auto opacity-20" />
                                    ) : (
                                        <>
                                            {cryptoAmount} <span className="text-sm font-light text-[#515044]/40">{nativeSymbol}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {!isCustom && (
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#515044]/20 text-center">
                                Approx. Rp {activeIdr.toLocaleString('id-ID')}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleTipClick}
                        disabled={isProcessing || isEvmConfirming || isLoadingPrice || parseFloat(cryptoAmount) <= 0}
                        className="w-full bg-[#515044] hover:bg-black text-white font-bold py-5 rounded-[24px] transition-all shadow-xl shadow-[#515044]/10 uppercase text-[10px] tracking-[0.3em] disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 group"
                    >
                        {isProcessing || isEvmConfirming ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Heart className="w-4 h-4 transition-transform group-hover:scale-125 group-hover:fill-current" />
                                Send Tip
                            </>
                        )}
                    </button>

                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#515044]/20 text-center flex items-center justify-center gap-2">
                        <Wallet className="w-2.5 h-2.5" />
                        Secure Transact via {networkLabel}
                    </p>
                </div>
            </div>
        </div>
    );
}
