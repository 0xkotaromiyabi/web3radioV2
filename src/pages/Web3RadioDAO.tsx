
import React, { useState } from "react";
import NavBar from "@/components/navigation/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import {
    Users,
    Vote,
    Trophy,
    Coins,
    ArrowRight,
    ShieldCheck,
    Wallet,
    ExternalLink,
    MessageSquare
} from "lucide-react";

export default function Web3RadioDAO() {
    const { address, isConnected } = useAccount();
    const { open } = useAppKit();

    return (
        <div className="min-h-screen w-full bg-transparent relative overflow-y-auto text-white flex flex-col items-center">
            <NavBar />

            {/* Hero Section */}
            <div className="w-full px-4 pt-24 md:pt-32 pb-12 text-center">
                <div className="container mx-auto max-w-4xl space-y-6">
                    <div className="bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-[0.4em] px-4 py-2 rounded-full inline-flex items-center gap-2 mb-2">
                        Governance Live
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                        Web3Radio DAO
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                        A decentralized community where every listener, creator, and developer has an equal voice in shaping the future of Web3 broadcasting.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-6">
                        {!isConnected ? (
                            <Button onClick={() => open()} size="lg" className="bg-white hover:bg-gray-200 text-black rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95">
                                <Wallet className="w-4 h-4 mr-2" /> Connect to Join
                            </Button>
                        ) : (
                            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-green-500/10 transition-all hover:scale-105 active:scale-95">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Member Verified
                            </Button>
                        )}
                        <Button variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 backdrop-blur text-white px-8 py-7 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all shadow-lg hover:shadow-xl">
                            Read Manifesto
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <Tabs defaultValue="governance" className="space-y-12">
                    <div className="flex justify-center">
                        <TabsList className="bg-white/10 backdrop-blur p-1.5 rounded-2xl border border-white/10 shadow-sm">
                            <TabsTrigger value="governance" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-[10px] uppercase tracking-widest transition-all">
                                <Vote className="w-3 h-3 mr-2" /> Governance
                            </TabsTrigger>
                            <TabsTrigger value="treasury" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-[10px] uppercase tracking-widest transition-all">
                                <Coins className="w-3 h-3 mr-2" /> Contributor Pool
                            </TabsTrigger>
                            <TabsTrigger value="community" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-[10px] uppercase tracking-widest transition-all">
                                <Users className="w-3 h-3 mr-2" /> Members
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="governance" className="space-y-8 mt-0 focus-visible:outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#515044]/5 shadow-2xl overflow-hidden p-8 md:p-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="bg-green-500/10 text-green-600 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">Active Proposal</div>
                                        <span className="text-[10px] text-[#515044]/40 font-bold uppercase tracking-widest">Ends in 2 days</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-[#515044] leading-tight">W3RP-12: Add 'Synthwave' Station</h3>
                                        <p className="text-sm text-[#515044]/60 font-light leading-relaxed">
                                            Proposal to allocate server resources for a new 24/7 Synthwave music station curated by community DJs.
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                                                <span>Yes (Implement)</span>
                                                <span>84%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#515044]/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 opacity-80" style={{ width: '84%' }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                                                <span>No (Status Quo)</span>
                                                <span>16%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#515044]/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-400 opacity-80" style={{ width: '16%' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-[#515044] hover:bg-black text-white rounded-2xl py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-[1.02]">Vote Now</Button>
                                </div>
                            </Card>

                            <Card className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#515044]/5 shadow-2xl overflow-hidden p-8 md:p-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="bg-[#515044]/5 text-[#515044]/40 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">Passed</div>
                                        <span className="text-[10px] text-[#515044]/40 font-bold uppercase tracking-widest">Ended 5 days ago</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-[#515044] leading-tight opacity-60">W3RP-11: IDRX Integration</h3>
                                        <p className="text-sm text-[#515044]/40 font-light leading-relaxed">
                                            Implement IDRX token for tips and micropayments to support local creators.
                                        </p>
                                    </div>
                                    <div className="p-5 bg-[#515044]/5 rounded-[24px] border border-[#515044]/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-[#515044]/5 flex items-center justify-center text-green-500 shadow-sm">
                                                <CheckCircleIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#515044] text-sm">Proposal Passed</p>
                                                <p className="text-[10px] text-[#515044]/40 font-bold uppercase tracking-widest">Feature fully implemented.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="bg-[#515044]/5 text-[#515044]/60 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">DeFi</div>
                                        <div className="bg-[#515044]/5 text-[#515044]/60 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Integration</div>
                                    </div>
                                    <Button variant="outline" className="w-full border-[#515044]/10 rounded-2xl py-7 font-bold text-xs uppercase tracking-widest hover:bg-white">View Details</Button>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="treasury" className="space-y-8 mt-0 focus-visible:outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Sponsor Pool Card */}
                            <Card className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#515044]/5 shadow-2xl md:col-span-2 overflow-hidden">
                                <CardHeader className="p-8 md:p-10 pb-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-2xl bg-[#515044]/5 flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-[#515044]/40" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-[#515044]">
                                                Monthly Sponsor Pool
                                            </CardTitle>
                                            <CardDescription className="text-[#515044]/40 text-[10px] font-bold uppercase tracking-widest">
                                                Rewards allocated for contributors
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 pt-6 space-y-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#515044]/30 mb-2">Current Rewards</span>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-6xl md:text-7xl font-bold text-[#515044] tracking-tight">5,000</span>
                                            <span className="text-xs font-bold text-[#515044]/40 uppercase tracking-[0.2em] mb-2">USD</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                                            <span>Pool Utilization</span>
                                            <span>65% Allocated</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#515044]/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#515044] opacity-80" style={{ width: '65%' }} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#515044]/5">
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Broadcasters</p>
                                            <p className="font-bold text-[#515044] text-lg">$3,000</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-[#515044]/30 uppercase tracking-[0.2em] mb-1">Cultural AI</p>
                                            <p className="font-bold text-[#515044] text-lg">$2,000</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* User Rewards Card */}
                            <Card className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#515044]/5 shadow-2xl p-8 md:p-10 flex flex-col justify-between">
                                <div className="space-y-2 mb-8 text-center md:text-left">
                                    <CardTitle className="text-lg font-bold text-[#515044]">Your Rewards</CardTitle>
                                    <div className="bg-[#515044]/5 text-[#515044]/40 text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-lg inline-block">
                                        Jan 2026 Earnings
                                    </div>
                                </div>
                                <div className="text-center py-6">
                                    <div className="mb-6 inline-flex p-5 rounded-[24px] bg-[#515044]/5 text-yellow-500">
                                        <Coins className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-[#515044] mb-2">{isConnected ? '250' : '0'}</h3>
                                    <p className="text-[10px] font-bold text-[#515044]/30 uppercase tracking-[0.3em]">USDC REWARD</p>
                                    {isConnected && (
                                        <div className="mt-4 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest inline-block">
                                            +150 this week
                                        </div>
                                    )}
                                </div>
                                <Button className="w-full bg-[#515044] hover:bg-black text-white rounded-2xl py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-[1.02]" disabled={!isConnected}>
                                    Claim Rewards
                                </Button>
                            </Card>
                        </div>

                        <Card className="bg-white/80 backdrop-blur rounded-[32px] border border-[#515044]/5 shadow-xl p-8 md:p-10">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                <div>
                                    <CardTitle className="text-xl font-bold text-[#515044]">Top Contributors</CardTitle>
                                    <CardDescription className="text-[#515044]/40 font-light">Community leaderboard for Jan 2026</CardDescription>
                                </div>
                                <Button variant="ghost" className="text-[#515044]/50 hover:text-[#515044] uppercase text-[10px] font-bold tracking-widest">View All</Button>
                            </div>
                            <CardContent className="p-0">
                                <div className="space-y-3">
                                    {[
                                        { name: "indy-barends.eth", score: 850, role: "Broadcaster" },
                                        { name: "sarah-sechan.eth", score: 720, role: "Broadcaster" },
                                        { name: "kotarominami", score: 690, role: "Producer" },
                                        { name: "0x44...b18", score: 550, role: "Music Director" },
                                    ].map((user, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-[20px] bg-white border border-[#515044]/5 transition-all hover:shadow-lg group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#515044]/5 flex items-center justify-center font-bold text-xs text-[#515044]/40 group-hover:bg-[#515044] group-hover:text-white transition-all">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#515044]">{user.name}</p>
                                                    <p className="text-[10px] text-[#515044]/40 font-bold uppercase tracking-widest">{user.role}</p>
                                                </div>
                                            </div>
                                            <div className="bg-[#515044]/5 text-[#515044] px-4 py-2 rounded-xl text-xs font-bold font-mono">
                                                {user.score} pts
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Community/Members Tab */}
                    <TabsContent value="community" className="mt-0 focus-visible:outline-none">
                        <Card className="bg-white/80 backdrop-blur rounded-[40px] border border-[#515044]/5 shadow-xl p-12 text-center">
                            <div className="max-w-md mx-auto space-y-8">
                                <div className="w-24 h-24 mx-auto rounded-[32px] bg-[#515044]/5 flex items-center justify-center text-[#515044]/20 shadow-inner">
                                    <MessageSquare className="w-12 h-12" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold text-[#515044]">Community Hub</h3>
                                    <p className="text-[#515044]/40 font-light leading-relaxed">
                                        Connect with 12,405 DAO members. Community forums and chat integration are coming soon.
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-[#515044]/5">
                                    <p className="text-[10px] font-bold text-[#515044]/30 uppercase tracking-[0.4em] mb-4">Join active discussions</p>
                                    <Button className="bg-[#515044] hover:bg-black text-white rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest transition-all">
                                        Join Discord
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
