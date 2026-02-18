
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
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const PLY = () => {
    const { address, isConnected } = useAccount();
    const { open } = useAppKit();

    // Mock data for demonstration
    const currentEpoch = {
        id: 7,
        daysRemaining: 8,
        totalTips: 1250000,
        prizePool: 125000,
        participants: 342,
        progress: 47
    };

    const previousWinners = [
        { address: '0x1234...5678', prize: 8500, epoch: 6 },
        { address: '0xabcd...efgh', prize: 6200, epoch: 5 },
        { address: '0x9876...4321', prize: 9800, epoch: 4 },
    ];

    const myTips = [
        { amount: 5000, date: '2026-01-28', epochId: 7 },
        { amount: 2500, date: '2026-01-25', epochId: 7 },
        { amount: 10000, date: '2026-01-15', epochId: 6 },
    ];

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

                    <div className="flex flex-wrap justify-center gap-4 pt-6">
                        {!isConnected ? (
                            <Button onClick={() => open()} size="lg" className="bg-[#515044] hover:bg-black text-white rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-105 active:scale-95">
                                <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                            </Button>
                        ) : (
                            <Button size="lg" className="bg-[#515044] hover:bg-black text-white rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-105 active:scale-95">
                                <Gift className="w-4 h-4 mr-2" /> Tip Now
                            </Button>
                        )}
                        <Button variant="outline" size="lg" className="rounded-2xl border-[#515044]/10 bg-white/50 backdrop-blur text-[#515044] px-8 py-7 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-xl">
                            Learn More <ArrowRight className="w-4 h-4 ml-2" />
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
                                                Epoch #{currentEpoch.id}
                                            </CardTitle>
                                            <CardDescription className="text-[#515044]/40 text-[10px] font-bold uppercase tracking-widest">
                                                {currentEpoch.daysRemaining} days remaining
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 pt-6 space-y-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#515044]/30 mb-2">Current Prize Pool</span>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-6xl md:text-7xl font-bold text-[#515044] tracking-tight">{currentEpoch.prizePool.toLocaleString()}</span>
                                            <span className="text-xs font-bold text-[#515044]/40 uppercase tracking-[0.2em] mb-2">IDRX</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                                            <span>Epoch Progression</span>
                                            <span>{currentEpoch.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#515044]/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#515044] opacity-80 transition-all duration-1000"
                                                style={{ width: `${currentEpoch.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#515044]/5">
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Total Tips</p>
                                            <p className="font-bold text-[#515044] text-lg">{currentEpoch.totalTips.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Participants</p>
                                            <p className="font-bold text-[#515044] text-lg">{currentEpoch.participants}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Your Entries</p>
                                            <p className="font-bold text-[#515044] text-lg">{isConnected ? '3' : '–'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Your Stats Card */}
                            <Card className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#515044]/5 shadow-2xl p-8 md:p-10 flex flex-col justify-between">
                                <div className="space-y-2 mb-8">
                                    <CardTitle className="text-lg font-bold text-[#515044]">Your Stats</CardTitle>
                                    <div className="bg-[#515044]/5 text-[#515044]/40 text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-lg inline-block">
                                        Epoch #{currentEpoch.id}
                                    </div>
                                </div>
                                <div className="text-center py-6">
                                    <div className="mb-6 inline-flex p-5 rounded-[24px] bg-[#515044]/5 text-[#515044]/40">
                                        <Coins className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-[#515044] mb-2">{isConnected ? '17,500' : '0'}</h3>
                                    <p className="text-[10px] font-bold text-[#515044]/30 uppercase tracking-[0.3em]">IDRX Tipped</p>
                                    {isConnected && (
                                        <div className="mt-4 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest inline-block">
                                            ~14% Win Chance
                                        </div>
                                    )}
                                </div>
                                <Button className="w-full bg-[#515044] hover:bg-black text-white rounded-2xl py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-[1.02]" disabled={!isConnected}>
                                    <Gift className="w-4 h-4 mr-2" /> Tip Now
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
                                                +{winner.prize.toLocaleString()} IDRX
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="how-it-works" className="space-y-10 mt-0 focus-visible:outline-none">
                        {/* Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: 1, title: 'Tip Streamers', icon: Coins, desc: 'Send IDRX tips to your favorite streamers. 90% goes to them, 10% enters the Prize Pool.' },
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
                                    { phase: 'Days 1-15', title: 'Tipping Phase', icon: Clock, desc: 'Listener tips for broadcaster support; smart contracts record all entries.' },
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
                                { name: 'TipRouter', desc: 'Receives IDRX' },
                                { name: 'EpochManager', desc: 'Manage Cycles' },
                                { name: 'PLYLottery', desc: 'Pyth Entropy' },
                                { name: 'ContributorVault', desc: 'Secure Rewards' },
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
                                        {myTips.map((tip, index) => (
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
                                                    {tip.amount.toLocaleString()} IDRX
                                                </div>
                                            </div>
                                        ))}
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
                                    {[6, 5, 4].map((epochId) => (
                                        <div key={epochId} className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-[#515044]/5 transition-all hover:shadow-xl group hover:scale-[1.01]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#515044]">Epoch #{epochId}</p>
                                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Completed</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#515044] text-lg font-mono">{(Math.random() * 10000 + 5000).toFixed(0)} IDRX</p>
                                                <p className="text-[8px] text-[#515044]/30 font-bold uppercase tracking-widest">Final Prize Pool</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PLY;
