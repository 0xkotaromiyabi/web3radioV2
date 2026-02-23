
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Gift,
    Coins,
    Timer,
    TrendingUp,
    Shield,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Zap,
    Trophy,
    Clock,
    Shuffle,
    Wallet,
    History,
    Users
} from 'lucide-react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { IDL, PROGRAM_ID } from '../idl/sol_tip_lottery';
import { toast } from 'sonner';
import { useEffect, useCallback, useState } from 'react';

const PLY = () => {
    const { address, isConnected } = useAppKitAccount();
    const { open } = useAppKit();
    const { walletProvider } = useAppKitProvider<any>('solana');
    const [isTipping, setIsTipping] = useState(false);
    const [isClosingEpoch, setIsClosingEpoch] = useState(false);
    const [isFinalizingDraw, setIsFinalizingDraw] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tipAmountInput, setTipAmountInput] = useState("0.05");
    const [winnerInput, setWinnerInput] = useState("");

    // SOL Tip Lottery Accounts (from init_output.json)
    const GLOBAL_STATE_PUBKEY = new PublicKey("61T5AiHoXDw9Z2aLbguGxKPyVNw86AMvgMZVZ8onumYz");
    const TREASURY_PUBKEY = new PublicKey("8RFfbcfkqKJ8cC66MAhk7aPScRzsQaWZERJSbPmKR8q5");
    const PRIZE_VAULT_PUBKEY = new PublicKey("FuCXGZAs4airoKob9WYaubXMamD5F9Le9YDaJc8ak4Wo");
    const EPOCH_STATE_PUBKEY = new PublicKey("C2LJsczAxcGM6bqyP6Mn4UiwrnoXGEaas2nJjodUme9P");

    const [globalData, setGlobalData] = useState<any>(null);
    const [epochData, setEpochData] = useState<any>(null);
    const [participantData, setParticipantData] = useState<any>(null);

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    const fetchData = useCallback(async () => {
        try {
            const provider = new AnchorProvider(
                connection,
                (walletProvider || {
                    publicKey: PublicKey.default,
                    signTransaction: async (tx: any) => tx,
                    signAllTransactions: async (txs: any[]) => txs,
                }) as any,
                { preflightCommitment: "confirmed" }
            );

            const program = new Program(IDL as any, provider);

            // Fetch Global State
            try {
                const gData = await program.account.globalState.fetch(GLOBAL_STATE_PUBKEY);
                setGlobalData(gData);
                console.log("Global data fetched:", gData);
            } catch (e) {
                console.warn("Failed to fetch global state:", e);
            }

            // Fetch Current Epoch State
            try {
                const eData = await program.account.epochState.fetch(EPOCH_STATE_PUBKEY);
                setEpochData(eData);
                console.log("Epoch data fetched:", eData);
            } catch (e) {
                console.warn("Failed to fetch epoch state:", e);
            }

            // Fetch Participant State if connected
            if (address) {
                try {
                    const userPubkey = new PublicKey(address);
                    const [participantPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("participant"), userPubkey.toBuffer()],
                        new PublicKey(PROGRAM_ID)
                    );
                    const pData = await program.account.participant.fetch(participantPda);
                    setParticipantData(pData);
                    console.log("Participant data fetched:", pData);
                } catch (e) {
                    console.log("Participant account not found yet (user hasn't tipped).");
                    setParticipantData(null);
                }
            }
        } catch (error) {
            console.error("Error fetching PLY data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [address, walletProvider]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleTip = async () => {
        if (!isConnected || !address || !walletProvider) {
            toast.error("Please connect your Solana wallet first");
            return;
        }

        try {
            setIsTipping(true);
            toast.loading("Sending tip transaction to Devnet...");

            const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

            // Setup Anchor Provider with Reown's walletProvider
            const provider = new AnchorProvider(
                connection,
                walletProvider as any,
                { preflightCommitment: "confirmed" }
            );

            const program = new Program(IDL as any, provider);

            const userPubkey = new anchor.web3.PublicKey(address);

            // Find Participant PDA
            const [participantPda] = anchor.web3.PublicKey.findProgramAddressSync(
                [Buffer.from("participant"), userPubkey.toBuffer()],
                program.programId
            );

            // Tip amount from input
            const amountInSol = parseFloat(tipAmountInput);
            if (isNaN(amountInSol) || amountInSol <= 0) {
                toast.error("Please enter a valid SOL amount");
                return;
            }
            const tipAmount = new BN(amountInSol * 1e9);

            // Execute the Tip RPC Instruction
            const tx = await program.methods
                .tip(tipAmount)
                .accounts({
                    user: userPubkey,
                    treasury: TREASURY_PUBKEY,
                    prizeVault: PRIZE_VAULT_PUBKEY,
                    epoch: EPOCH_STATE_PUBKEY,
                    participant: participantPda,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("Tip transaction successful! Signature:", tx);
            toast.success(`Tip sent successfully! Tx: ${tx.slice(0, 8)}...`);

            // Refresh data after 2 seconds to allow chain to update
            setTimeout(fetchData, 2000);

        } catch (error) {
            console.error("Tip error:", error);
            toast.error("Failed to process tip. See console for details.");
        } finally {
        }
    };

    const handleCloseEpoch = async () => {
        if (!isConnected || !address || !walletProvider) return;
        try {
            setIsClosingEpoch(true);
            toast.loading("Closing epoch...");
            const provider = new AnchorProvider(connection, walletProvider as any, { preflightCommitment: "confirmed" });
            const program = new Program(IDL as any, provider);
            const tx = await program.methods.closeEpoch().accounts({ epoch: EPOCH_STATE_PUBKEY }).rpc();
            toast.success(`Epoch closed! Tx: ${tx.slice(0, 8)}...`);
            setTimeout(fetchData, 2000);
        } catch (error: any) {
            console.error("Close epoch error:", error);
            toast.error(error.message || "Failed to close epoch");
        } finally {
            setIsClosingEpoch(false);
            toast.dismiss();
        }
    };

    const handleFinalizeDraw = async () => {
        if (!isConnected || !address || !walletProvider || !winnerInput) {
            toast.error("Please provide a winner address");
            return;
        }
        try {
            const winnerPubkey = new PublicKey(winnerInput);
            setIsFinalizingDraw(true);
            toast.loading("Finalizing draw...");
            const provider = new AnchorProvider(connection, walletProvider as any, { preflightCommitment: "confirmed" });
            const program = new Program(IDL as any, provider);
            const randomness = new BN(Math.floor(Math.random() * 1000000));
            const tx = await program.methods.finalizeDraw(randomness).accounts({
                epoch: EPOCH_STATE_PUBKEY,
                prizeVault: PRIZE_VAULT_PUBKEY,
                winner: winnerPubkey,
            }).rpc();
            toast.success(`Draw finalized! Tx: ${tx.slice(0, 8)}...`);
            setTimeout(fetchData, 2000);
        } catch (error: any) {
            console.error("Finalize draw error:", error);
            const msg = error.name === "Error" ? "Invalid winner address" : (error.message || "Failed to finalize draw");
            toast.error(msg);
        } finally {
            setIsFinalizingDraw(false);
            toast.dismiss();
        }
    };



    // Derived data from fetched accounts
    const displayEpoch = {
        id: epochData?.epochId?.toNumber() || 1,
        daysRemaining: epochData ? Math.max(0, Math.ceil((epochData.endTime.toNumber() - Date.now() / 1000) / 86400)) : 15,
        totalTips: epochData ? (epochData.prizePool.toNumber() * 10 / 1e9) : 0, // Since prizePool is 10% of total tips
        prizePool: epochData ? (epochData.prizePool.toNumber() / 1e9) : 0,
        participants: epochData ? (epochData.totalEntries.toNumber() > 0 ? "Active" : "None") : "–",
        progress: epochData ? Math.min(100, Math.round(((Date.now() / 1000 - epochData.startTime.toNumber()) / (1296000)) * 100)) : 0
    };

    const myEntries = participantData ? participantData.entries.toNumber() : 0;
    const myTippedAmount = myEntries * 0.01; // Each entry is 0.01 SOL

    // For history and previous winners, we would normally fetch from an indexer or 
    // past signatures. For now, we'll keep them empty to reflect "real" state
    // where no winners have been selected yet in this deployment.
    const previousWinners: any[] = [];
    const myTips: any[] = [];

    return (
        <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
                body { font-family: 'Raleway', sans-serif; }
            `}</style>
            <NavBar />

            {/* Hero Section */}
            <div className="w-full px-4 pt-24 md:pt-32 pb-12 text-center">
                <div className="container mx-auto max-w-4xl space-y-6">
                    <div className="bg-[#515044]/5 text-[#515044]/60 text-[10px] font-bold uppercase tracking-[0.4em] px-4 py-2 rounded-full inline-flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3" />
                        Prize-Linked Yield
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#515044] tracking-tight leading-tight">
                        PLY: Tip & Win
                    </h1>
                    <p className="text-lg md:text-xl text-[#515044]/60 max-w-2xl mx-auto font-light leading-relaxed">
                        Every tip you give helps build the ecosystem and could come back to you as a reward every 15 days!
                    </p>

                    <div className="flex flex-col items-center gap-4 pt-6">
                        <div className="flex flex-wrap justify-center gap-4">
                            {!isConnected ? (
                                <Button onClick={() => open()} size="lg" className="bg-[#515044] hover:bg-black text-white rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-105 active:scale-95">
                                    <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                                </Button>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={tipAmountInput}
                                            onChange={(e) => setTipAmountInput(e.target.value)}
                                            className="bg-white/50 border border-[#515044]/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#515044]/20 w-32 font-bold text-[#515044]"
                                            placeholder="0.05"
                                            step="0.01"
                                            min="0.01"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#515044]/40 uppercase tracking-widest">SOL</span>
                                    </div>
                                    <Button size="lg" onClick={handleTip} disabled={isTipping} className="bg-[#515044] hover:bg-black text-white rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-105 active:scale-95">
                                        <Gift className="w-4 h-4 mr-2" /> {isTipping ? "Processing..." : "Tip Now"}
                                    </Button>
                                </div>
                            )}
                            <Button variant="outline" size="lg" className="rounded-2xl border-[#515044]/10 bg-white/50 backdrop-blur text-[#515044] px-8 py-7 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-xl">
                                Learn More <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                        <Button onClick={fetchData} variant="ghost" size="sm" className="text-[#515044]/40 hover:text-[#515044] text-[8px] uppercase tracking-widest">
                            <Shuffle className="w-3 h-3 mr-2" /> Refresh Data
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <Tabs defaultValue="overview" className="space-y-12">
                    <div className="flex justify-center">
                        <TabsList className="bg-white/50 backdrop-blur p-1.5 rounded-2xl border border-[#515044]/10 shadow-sm">
                            <TabsTrigger value="overview" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#515044] data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest transition-all">
                                <TrendingUp className="w-3 h-3 mr-2" /> Overview
                            </TabsTrigger>
                            <TabsTrigger value="how-it-works" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#515044] data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest transition-all">
                                <Zap className="w-3 h-3 mr-2" /> How It Works
                            </TabsTrigger>
                            <TabsTrigger value="history" className="rounded-xl px-8 py-3 data-[state=active]:bg-[#515044] data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest transition-all">
                                <History className="w-3 h-3 mr-2" /> History
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-8 mt-0 focus-visible:outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Current Epoch Card */}
                            <Card className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#515044]/5 shadow-2xl md:col-span-2 overflow-hidden">
                                <CardHeader className="p-8 md:p-10 pb-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-2xl bg-[#515044]/5 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-[#515044]/40" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-[#515044]">
                                                Epoch #{displayEpoch.id}
                                            </CardTitle>
                                            <CardDescription className="text-[#515044]/40 text-[10px] font-bold uppercase tracking-widest">
                                                {displayEpoch.daysRemaining} days remaining
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 pt-6 space-y-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#515044]/30 mb-2">Current Prize Pool</span>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-6xl md:text-7xl font-bold text-[#515044] tracking-tight">
                                                {isLoading ? "..." : displayEpoch.prizePool.toFixed(4)}
                                            </span>
                                            <span className="text-xs font-bold text-[#515044]/40 uppercase tracking-[0.2em] mb-2">SOL</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                                            <span>Epoch Progression</span>
                                            <span>{displayEpoch.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#515044]/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#515044] opacity-80 transition-all duration-1000"
                                                style={{ width: `${displayEpoch.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#515044]/5">
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Total Tips</p>
                                            <p className="font-bold text-[#515044] text-lg">
                                                {isLoading ? "..." : displayEpoch.totalTips.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Status</p>
                                            <p className="font-bold text-[#515044] text-lg text-[10px] uppercase">{epochData?.isClosed ? "Closed" : "Live"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Your Entries</p>
                                            <p className="font-bold text-[#515044] text-lg">{isConnected ? myEntries : '–'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Your Stats Card */}
                            <Card className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#515044]/5 shadow-2xl p-8 md:p-10 flex flex-col justify-between">
                                <div className="space-y-2 mb-8">
                                    <CardTitle className="text-lg font-bold text-[#515044]">Your Stats</CardTitle>
                                    <div className="bg-[#515044]/5 text-[#515044]/40 text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-lg inline-block">
                                        Epoch #{displayEpoch.id}
                                    </div>
                                </div>
                                <div className="text-center py-6">
                                    <div className="mb-6 inline-flex p-5 rounded-[24px] bg-[#515044]/5 text-[#515044]/40">
                                        <Coins className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-[#515044] mb-2">
                                        {isConnected ? (isLoading ? "..." : myTippedAmount.toFixed(2)) : '0'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-[#515044]/30 uppercase tracking-[0.3em]">SOL Tipped</p>
                                    {isConnected && !isLoading && myEntries > 0 && (
                                        <div className="mt-4 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest inline-block">
                                            {displayEpoch.id > 0 ? "Entry recorded" : "No entries"}
                                        </div>
                                    )}
                                </div>
                                <Button onClick={handleTip} className="w-full bg-[#515044] hover:bg-black text-white rounded-2xl py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-[1.02]" disabled={!isConnected || isTipping}>
                                    <Gift className="w-4 h-4 mr-2" /> {isTipping ? "Processing..." : "Tip Now"}
                                </Button>
                            </Card>
                        </div>

                        {/* Distribution */}
                        <Card className="bg-white/80 backdrop-blur rounded-[32px] border border-[#515044]/5 shadow-xl p-8 md:p-10">
                            <div className="mb-8">
                                <CardTitle className="text-xl font-bold text-[#515044]">Tip Distribution</CardTitle>
                                <CardDescription className="text-[#515044]/40 font-light">How your contributions help the ecosystem</CardDescription>
                            </div>
                            <CardContent className="p-0">
                                <div className="flex items-center gap-1.5 mb-10 h-3 w-full bg-[#515044]/5 rounded-full overflow-hidden p-0.5">
                                    <div className="h-full bg-[#515044] opacity-80 rounded-full" style={{ width: '90%' }}></div>
                                    <div className="h-full bg-[#515044] opacity-20 rounded-full flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-[24px] bg-[#515044]/5 border border-[#515044]/5 transition-all hover:bg-white hover:shadow-lg group">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <Users className="w-5 h-5 text-[#515044]" />
                                            </div>
                                            <span className="font-bold text-2xl text-[#515044]">90%</span>
                                        </div>
                                        <p className="text-sm text-[#515044]/60 font-light">Direct to Streamer/Contributor</p>
                                    </div>
                                    <div className="p-6 rounded-[24px] bg-[#515044]/5 border border-[#515044]/5 transition-all hover:bg-white hover:shadow-lg group">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <Trophy className="w-5 h-5 text-[#515044]" />
                                            </div>
                                            <span className="font-bold text-2xl text-[#515044]">10%</span>
                                        </div>
                                        <p className="text-sm text-[#515044]/60 font-light">Prize Pool (15-day Draw)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Previous Winners */}
                        <Card className="bg-white/80 backdrop-blur rounded-[32px] border border-[#515044]/5 shadow-xl p-8 md:p-10">
                            <div className="mb-8">
                                <CardTitle className="text-xl font-bold text-[#515044]">Recent Winners</CardTitle>
                                <CardDescription className="text-[#515044]/40 font-light">Winners from previous epochs</CardDescription>
                            </div>
                            <CardContent className="p-0">
                                <div className="space-y-4">
                                    {(epochData?.winner || previousWinners.length > 0) ? (
                                        <>
                                            {epochData?.winner && (
                                                <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border-2 border-[#515044]/10 transition-all shadow-xl group hover:scale-[1.01]">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#515044] flex items-center justify-center text-white transition-all">
                                                            <Trophy className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-mono text-sm font-bold text-[#515044]">{epochData.winner.toBase58().slice(0, 12)}...</p>
                                                            <p className="text-[10px] text-[#515044]/40 font-bold uppercase tracking-widest">Current Epoch Winner</p>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-[#515044] text-white">Winner</Badge>
                                                </div>
                                            )}
                                            {previousWinners.map((winner, index) => (
                                                <div key={index} className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-[#515044]/5 transition-all hover:shadow-xl group hover:scale-[1.01]">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#515044]/5 flex items-center justify-center text-[#515044]/40 group-hover:bg-[#515044] group-hover:text-white transition-all">
                                                            <Trophy className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-mono text-sm font-bold text-[#515044]">{winner.address}</p>
                                                            <p className="text-[10px] text-[#515044]/40 font-bold uppercase tracking-widest">Epoch #{winner.epoch}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#515044]/5 text-[#515044] px-4 py-2 rounded-xl text-xs font-bold font-mono group-hover:bg-[#515044] group-hover:text-white transition-all">
                                                        +{winner.prize.toLocaleString()} SOL
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 text-[#515044]/20">
                                            <p className="text-sm font-bold uppercase tracking-widest">No winners yet</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="how-it-works" className="space-y-10 mt-0 focus-visible:outline-none">
                        {/* Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: 1, title: 'Tip Streamers', icon: Coins, desc: 'Send SOL tips to your favorite streamers. 90% goes to them, 10% enters the Prize Pool.' },
                                { step: 2, title: 'Wait 15 Days', icon: Timer, desc: 'Each epoch lasts 15 days. The Prize Pool grows with every tip across the network.' },
                                { step: 3, title: 'Win & Earn!', icon: Trophy, desc: 'Winners are selected transparently with Pyth Entropy. Rewards are auto-distributed.' }
                            ].map((item) => (
                                <Card key={item.step} className="bg-white/80 backdrop-blur rounded-[40px] border border-[#515044]/5 shadow-xl text-center p-8 transition-all hover:shadow-2xl hover:scale-[1.02] group">
                                    <div className="w-20 h-20 mx-auto rounded-[30px] bg-[#515044]/5 flex items-center justify-center shadow-sm mb-6 group-hover:bg-[#515044] transition-all">
                                        <item.icon className="w-10 h-10 text-[#515044]/40 group-hover:text-white transition-all" />
                                    </div>
                                    <div className="inline-block px-3 py-1 bg-[#515044]/5 text-[#515044]/40 rounded-full text-[8px] font-bold uppercase tracking-widest mb-4">Step {item.step}</div>
                                    <h3 className="font-bold text-xl text-[#515044] mb-3">{item.title}</h3>
                                    <p className="text-[#515044]/50 text-sm font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                </Card>
                            ))}
                        </div>

                        {/* Timeline */}
                        <Card className="bg-white/80 backdrop-blur rounded-[40px] border border-[#515044]/5 shadow-xl p-8 md:p-12">
                            <CardHeader className="p-0 mb-10 text-center">
                                <CardTitle className="text-2xl font-bold text-[#515044]">The Epoch Cycle</CardTitle>
                                <CardDescription className="text-[#515044]/40 font-light">A 15-day trustless reward mechanism</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 space-y-6">
                                {[
                                    { phase: 'Days 1-15', title: 'Tipping Phase', icon: Clock, desc: 'Listener tips for broadcaster support; Solana program records weighted entries (0.01 SOL = 1 entry).' },
                                    { phase: 'Day 15 (End)', title: 'Epoch Settlement', icon: CheckCircle, desc: 'Epoch closes, protocol calculates the final Prize and Contributor pools.' },
                                    { phase: 'Draw Phase', title: 'Pyth Randomness', icon: Shuffle, desc: 'Chain-verified randomness determines winners in a transparent way.' },
                                    { phase: 'Reward Phase', title: 'Distribution', icon: Trophy, desc: 'Rewards are instantly distributed to winners and broadcasters.' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-6 p-6 rounded-[28px] bg-white border border-[#515044]/5 transition-all hover:shadow-lg group">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#515044]/5 flex items-center justify-center transition-all group-hover:bg-[#515044] group-hover:text-white">
                                            <item.icon className="w-7 h-7 text-[#515044]/30 group-hover:text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="bg-[#515044]/5 text-[#515044]/40 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
                                                    {item.phase}
                                                </div>
                                                <span className="font-bold text-[#515044] text-lg">{item.title}</span>
                                            </div>
                                            <p className="text-sm text-[#515044]/60 font-light">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Smart Contracts */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: 'sol_tip_lottery', desc: 'Main Program' },
                                { name: 'GlobalState', desc: 'Authority & Vaults' },
                                { name: 'EpochState', desc: 'Track 15-day cycle' },
                                { name: 'Participant', desc: 'Track user entries' },
                            ].map((contract, index) => (
                                <div key={index} className="p-6 rounded-[28px] bg-white/60 backdrop-blur border border-[#515044]/5 text-center shadow-lg transition-all hover:scale-105">
                                    <code className="text-xs font-mono font-bold text-[#515044]">{contract.name}</code>
                                    <p className="text-[10px] text-[#515044]/30 font-bold uppercase tracking-widest mt-2">{contract.desc}</p>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-8 mt-0 focus-visible:outline-none">
                        <Card className="bg-white/80 backdrop-blur rounded-[32px] border border-[#515044]/5 shadow-xl p-8 md:p-10">
                            <div className="mb-8">
                                <CardTitle className="text-xl font-bold text-[#515044]">Your Tipping History</CardTitle>
                                <CardDescription className="text-[#515044]/40 font-light">History of all tips you've sent</CardDescription>
                            </div>
                            <CardContent className="p-0">
                                {isConnected ? (
                                    <div className="space-y-4">
                                        {myTips.length > 0 ? myTips.map((tip, index) => (
                                            <div key={index} className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-[#515044]/5 transition-all hover:shadow-xl group hover:scale-[1.01]">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#515044]/5 flex items-center justify-center text-[#515044]/40 group-hover:bg-[#515044] group-hover:text-white transition-all">
                                                        <Gift className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#515044]">Tip to Epoch #{tip.epochId}</p>
                                                        <p className="text-[10px] text-[#515044]/40 font-bold uppercase tracking-widest">{tip.date}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-[#515044]/5 text-[#515044] px-4 py-2 rounded-xl text-xs font-bold font-mono">
                                                    {tip.amount.toLocaleString()} SOL
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 text-[#515044]/20">
                                                <p className="text-sm font-bold uppercase tracking-widest">No tips sent yet in this epoch</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-[#515044]/20 bg-[#515044]/5 rounded-[32px] border border-dashed border-[#515044]/10">
                                        <Wallet className="w-16 h-16 mx-auto mb-6 opacity-30" />
                                        <p className="text-lg font-bold text-[#515044]/40 mb-6 uppercase tracking-widest">Connect wallet to see your history</p>
                                        <Button onClick={() => open()} variant="outline" className="rounded-2xl border-[#515044]/10 bg-white text-[#515044] px-8 py-6 font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all">
                                            <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur rounded-[32px] border border-[#515044]/5 shadow-xl p-8 md:p-10">
                            <div className="mb-8">
                                <CardTitle className="text-xl font-bold text-[#515044]">Epoch History</CardTitle>
                                <CardDescription className="text-[#515044]/40 font-light">Summary of all past reward cycles</CardDescription>
                            </div>
                            <CardContent className="p-0">
                                <div className="space-y-4">
                                    {/* Real epoch history would be fetched from past accounts or an indexer */}
                                    <div className="text-center py-12 text-[#515044]/20 border border-dashed border-[#515044]/10 rounded-[24px]">
                                        <p className="text-sm font-bold uppercase tracking-widest">No past epochs recorded yet</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Admin Panel */}
                {address && globalData && address === globalData.authority.toBase58() && (
                    <Card className="mt-12 bg-[#515044] text-white rounded-[40px] border-none shadow-2xl overflow-hidden">
                        <CardHeader className="p-8 md:p-10 pb-4">
                            <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-yellow-400" />
                                <CardTitle className="text-2xl font-bold">Authority Panel</CardTitle>
                            </div>
                            <CardDescription className="text-white/60">Manage the PLY lottery system</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 md:p-10 pt-4 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-white/40">Epoch Management</h4>
                                    <Button
                                        onClick={handleCloseEpoch}
                                        disabled={isClosingEpoch || epochData?.isClosed}
                                        className="w-full bg-white text-[#515044] hover:bg-white/90 rounded-2xl py-6 font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        {epochData?.isClosed ? "Epoch Closed" : (isClosingEpoch ? "Closing..." : "Close Current Epoch")}
                                    </Button>
                                    <p className="text-[10px] text-white/40 italic">Note: Only works if epoch end time is reached.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-white/40">Draw Finalization</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={winnerInput}
                                            onChange={(e) => setWinnerInput(e.target.value)}
                                            placeholder="Winner Wallet Address"
                                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/20 text-sm font-mono text-white placeholder:text-white/20"
                                        />
                                        <Button
                                            onClick={handleFinalizeDraw}
                                            disabled={isFinalizingDraw || !epochData?.isClosed || epochData?.winner}
                                            className="w-full bg-yellow-400 text-[#515044] hover:bg-yellow-300 rounded-2xl py-6 font-bold uppercase tracking-widest text-[10px]"
                                        >
                                            {epochData?.winner ? "Draw Finalized" : (isFinalizingDraw ? "Finalizing..." : "Finalize Draw & Send Prize")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PLY;
