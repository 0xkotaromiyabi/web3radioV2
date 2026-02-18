import React, { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, ExternalLink, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";

const EVM_DESTINATION = "0x242dfb7849544ee242b2265ca7e585bdec60456b";
const SOLANA_DESTINATION = "9xhz4Cb4C2Z4z9xdD2geCafovNYVngC4E4XpWtQmeEuv";

const IDR_PRESETS = [
    { label: '1K', value: 1000 },
    { label: '5K', value: 5000 },
    { label: '10K', value: 10000 },
    { label: '20K', value: 20000 },
    { label: '50K', value: 50000 },
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
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=idr`);
            const data = await res.json();
            const price = data[coinGeckoId]?.idr;
            if (price) setPriceIdr(price);
        } catch (err) {
            console.error('Failed to fetch price:', err);
        } finally {
            setIsLoadingPrice(false);
        }
    }, [coinGeckoId]);

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
            toast({ title: "Tip Sent! 💖", description: "Thank you for your tip!" });
            setIsProcessing(false);
        }
    }, [isEvmSuccess]);

    useEffect(() => {
        if (evmHash && !isEvmConfirming && !isEvmSuccess) setIsProcessing(false);
    }, [isEvmConfirming]);

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
        toast({ title: "⏳ Waiting for Wallet Approval", description: "Please approve the transaction in your wallet..." });
        try {
            setIsProcessing(true);
            if (isEvm) {
                sendEvmTx({ to: EVM_DESTINATION as `0x${string}`, value: parseEther(cryptoAmount) });
            } else if (isSolana && solanaPubKey) {
                const recipientPubKey = new PublicKey(SOLANA_DESTINATION);
                const transaction = new Transaction().add(
                    SystemProgram.transfer({ fromPubkey: solanaPubKey, toPubkey: recipientPubKey, lamports: parseFloat(cryptoAmount) * LAMPORTS_PER_SOL })
                );
                const signature = await sendSolanaTx(transaction, connection);
                await connection.confirmTransaction(signature, 'processed');
                toast({ title: "Tip Sent! 💖", description: `Thank you for tipping ${cryptoAmount} SOL!` });
                setIsProcessing(false);
            }
        } catch (error: any) {
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
        <>
            {/* Confirmation Overlay */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm mx-4 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-base font-bold text-[#515044]">Confirm Transaction</h3>
                            <div className="w-full bg-[#fef29c]/30 rounded-xl p-4 space-y-3 border border-[#515044]/5">
                                <div className="flex justify-between text-xs"><span className="text-[#515044]/50">Network</span><span className="font-bold text-[#515044]">{networkLabel}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#515044]/50">Tip (IDR)</span><span className="font-bold text-[#515044]">Rp {activeIdr.toLocaleString('id-ID')}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#515044]/50">Amount</span><span className="font-bold text-[#515044]">{cryptoAmount} {nativeSymbol}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#515044]/50">From</span><span className="font-mono text-[10px] text-[#515044]">{address?.slice(0, 8)}...{address?.slice(-6)}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-[#515044]/50">To</span><span className="font-mono text-[10px] text-[#515044]">{destination.slice(0, 8)}...{destination.slice(-6)}</span></div>
                            </div>
                            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg w-full">
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-700 leading-relaxed">Your wallet will ask for a <strong>second approval</strong>. Always verify the details before signing.</p>
                            </div>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 border border-[#515044]/20 rounded-xl text-xs font-bold text-[#515044] hover:bg-gray-50 transition-all">Cancel</button>
                                <button onClick={handleConfirmSend} className="flex-1 px-4 py-3 bg-[#515044] text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-2"><ShieldCheck className="w-3.5 h-3.5" />Confirm & Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tip Card */}
            <div className="mt-6 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-[#515044]/10 shadow-xl animate-in zoom-in-95 duration-300 w-full max-w-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <h3 className="text-sm font-bold text-[#515044] mb-1">Support the Broadcaster</h3>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-[10px] text-[#515044]/60 uppercase tracking-widest">via {networkLabel}</p>
                            {!isLoadingPrice && priceIdr > 0 && (
                                <button onClick={fetchPrice} className="text-[#515044]/30 hover:text-[#515044]/60 transition-colors"><RefreshCw className="w-3 h-3" /></button>
                            )}
                        </div>
                        {!isLoadingPrice && priceIdr > 0 && (
                            <p className="text-[9px] text-[#515044]/40 mt-1">1 {nativeSymbol} ≈ Rp {priceIdr.toLocaleString('id-ID')}</p>
                        )}
                        {isLoadingPrice && (
                            <p className="text-[9px] text-[#515044]/40 mt-1 flex items-center justify-center gap-1"><Loader2 className="w-2 h-2 animate-spin" /> Loading price...</p>
                        )}
                    </div>

                    {/* IDR Preset Buttons */}
                    <div className="flex flex-wrap justify-center gap-2 w-full">
                        {IDR_PRESETS.map((preset) => (
                            <button
                                key={preset.value}
                                onClick={() => { setIdrAmount(preset.value); setIsCustom(false); }}
                                className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border ${!isCustom && idrAmount === preset.value
                                    ? 'bg-[#515044] text-white border-[#515044] shadow-md scale-105'
                                    : 'bg-white text-[#515044] border-[#515044]/15 hover:border-[#515044]/40'
                                    }`}
                            >
                                Rp {preset.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsCustom(true)}
                            className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border ${isCustom
                                ? 'bg-[#515044] text-white border-[#515044] shadow-md scale-105'
                                : 'bg-white text-[#515044] border-[#515044]/15 hover:border-[#515044]/40'
                                }`}
                        >
                            Custom
                        </button>
                    </div>

                    {/* Custom IDR Input */}
                    {isCustom && (
                        <div className="relative w-full">
                            <span className="absolute left-3 top-3 text-[10px] font-bold text-[#515044]/40">Rp</span>
                            <input
                                type="number"
                                value={customIdr}
                                onChange={(e) => setCustomIdr(e.target.value)}
                                className="w-full pl-9 pr-4 py-3 bg-[#fef29c]/20 border border-[#515044]/10 rounded-xl text-sm font-bold text-[#515044] focus:outline-none focus:border-[#515044]/40 transition-all"
                                step="1000" min="100" placeholder="Enter amount in IDR"
                            />
                        </div>
                    )}

                    {/* Crypto Equivalent */}
                    <div className="w-full bg-[#fef29c]/20 rounded-xl p-3 text-center border border-[#515044]/5">
                        <p className="text-[10px] text-[#515044]/50 mb-1">You'll send approximately</p>
                        <p className="text-lg font-bold text-[#515044]">
                            {parseFloat(cryptoAmount) > 0 ? cryptoAmount : '—'} <span className="text-sm font-normal text-[#515044]/60">{nativeSymbol}</span>
                        </p>
                        <p className="text-[9px] text-[#515044]/40">≈ Rp {activeIdr.toLocaleString('id-ID')}</p>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleTipClick}
                        disabled={isProcessing || isEvmConfirming || isLoadingPrice || parseFloat(cryptoAmount) <= 0}
                        className="w-full px-6 py-3.5 bg-[#515044] text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing || isEvmConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 fill-current" />}
                        Send Tip
                    </button>

                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[9px] text-[#515044]/40 break-all font-mono text-center">
                            To: <span className="text-[#515044]/60">{destination.slice(0, 10)}...{destination.slice(-8)}</span>
                        </p>
                        {evmHash && isEvm && (
                            <a href={`${caipNetwork?.blockExplorers?.default?.url}/tx/${evmHash}`} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-500 hover:underline flex items-center gap-1">
                                View Transaction <ExternalLink className="w-2 h-2" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
