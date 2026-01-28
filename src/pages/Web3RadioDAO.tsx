
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
        <div className="min-h-screen bg-gray-50/50">
            <NavBar />

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 px-4 py-16 md:py-24 text-center">
                <div className="container mx-auto max-w-4xl space-y-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 mb-2">
                        Governance Live
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Web3Radio DAO
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        A decentralized community where every listener, creator, and developer has an equal voice in shaping the future of Web3 broadcasting.
                    </p>

                    <div className="flex justify-center gap-4 pt-4">
                        {!isConnected ? (
                            <Button onClick={() => open()} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20">
                                <Wallet className="w-4 h-4 mr-2" /> Connect to Join
                            </Button>
                        ) : (
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Member Verifed
                            </Button>
                        )}
                        <Button variant="outline" size="lg" className="rounded-xl">
                            Read Manifesto
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <Tabs defaultValue="governance" className="space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                            <TabsTrigger value="governance" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                <Vote className="w-4 h-4 mr-2" /> Governance
                            </TabsTrigger>
                            <TabsTrigger value="treasury" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                <Coins className="w-4 h-4 mr-2" /> Contributor Pool
                            </TabsTrigger>
                            <TabsTrigger value="community" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                <Users className="w-4 h-4 mr-2" /> Members
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Governance Tab */}
                    <TabsContent value="governance" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="shadow-sm border-gray-200">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-green-100 text-green-700">Active Proposal</Badge>
                                        <span className="text-xs text-gray-500">Ends in 2 days</span>
                                    </div>
                                    <CardTitle className="text-xl mt-2">W3RP-12: Add 'Synthwave' Station</CardTitle>
                                    <CardDescription>
                                        Proposal to allocate server resources for a new 24/7 Synthwave music station curated by community DJs.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">Yes (Implement)</span>
                                            <span className="font-bold text-gray-900">84%</span>
                                        </div>
                                        <Progress value={84} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">No (Status Quo)</span>
                                            <span className="font-bold text-gray-900">16%</span>
                                        </div>
                                        <Progress value={16} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">Vote Now</Button>
                                </CardFooter>
                            </Card>

                            <Card className="shadow-sm border-gray-200">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-gray-100 text-gray-600">Passed</Badge>
                                        <span className="text-xs text-gray-500">Ended 5 days ago</span>
                                    </div>
                                    <CardTitle className="text-xl mt-2">W3RP-11: IDRX Integration</CardTitle>
                                    <CardDescription>
                                        Implement IDRX token for tips and micropayments to support local creators.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-full">
                                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Proposal Passed</p>
                                                <p className="text-sm text-gray-500">Feature has been implemented.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline">DeFi</Badge>
                                        <Badge variant="outline">Integration</Badge>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">View Details</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Contributor Pool Tab */}
                    <TabsContent value="treasury" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Sponsor Pool Card */}
                            <Card className="shadow-lg border-blue-100 bg-gradient-to-br from-blue-50 to-white md:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-blue-900">
                                        <Trophy className="w-6 h-6 text-blue-600" />
                                        Monthly Sponsor Pool
                                    </CardTitle>
                                    <CardDescription className="text-blue-700/80">
                                        Rewards allocated for active contributors this month
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-blue-900">$5,000</span>
                                        <span className="text-lg text-blue-600 font-medium">USD</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-blue-800">
                                            <span>Pool Utilization</span>
                                            <span>65% Allocated</span>
                                        </div>
                                        <Progress value={65} className="h-3 bg-blue-100" indicatorClassName="bg-blue-600" />
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-blue-100 flex-1">
                                            <p className="text-xs text-blue-500 uppercase font-bold">Base</p>
                                            <p className="font-bold text-gray-900">$2,500</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-blue-100 flex-1">
                                            <p className="text-xs text-red-500 uppercase font-bold">Cultural-Nodes AI</p>
                                            <p className="font-bold text-gray-900">$1,500</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-blue-100 flex-1">
                                            <p className="text-xs text-indigo-500 uppercase font-bold">Decentranews</p>
                                            <p className="font-bold text-gray-900">$1,000</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* User Rewards Card */}
                            <Card className="shadow-md border-gray-200 bg-white flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Your Rewards</CardTitle>
                                    <CardDescription>Based on your recent activity</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-8">
                                    <div className="mb-4 inline-flex p-4 rounded-full bg-yellow-50 text-yellow-600">
                                        <Coins className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">250</h3>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">USDC</p>
                                    <p className="text-xs text-green-600 mt-2 font-medium">+150 this week</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={!isConnected}>
                                        Claim Rewards
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Contributors</CardTitle>
                                    <CardDescription>Leaderboard for Jan 2026</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { name: "indy-barends.eth", score: 850, role: "Broadcaster" },
                                            { name: "sarah-sechan.eth", score: 720, role: "Broadcaster" },
                                            { name: "kotarominami", score: 690, role: "Producer" },
                                            { name: "0x44...b18", score: 550, role: "Music Director" },
                                        ].map((user, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center font-bold text-xs text-gray-600">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.role}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="font-mono">{user.score} pts</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" className="w-full text-blue-600">View Full Leaderboard</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Community/Members Tab */}
                    <TabsContent value="community">
                        <Card>
                            <CardHeader>
                                <CardTitle>Community Hub</CardTitle>
                                <CardDescription>Connect with 12,405 DAO members</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center py-12 text-gray-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Community forum and chat integration coming soon.</p>
                                <p className="text-sm mt-2">Join our Discord for active discussions.</p>
                            </CardContent>
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
