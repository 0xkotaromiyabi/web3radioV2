
import React from 'react';
import { Users, Globe, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ListenerAnalytics() {
    return (
        <Card className="h-full bg-black/40 backdrop-blur-xl border-zinc-800 text-white shadow-xl flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-zinc-800/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    LISTENER ANALYTICS
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">Current</span>
                        <span className="text-2xl font-bold text-cyan-400 flex items-center gap-1">
                            <Users className="w-4 h-4" /> 128
                        </span>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">Peak</span>
                        <span className="text-2xl font-bold text-white">342</span>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">Avg Time</span>
                        <span className="text-2xl font-bold text-green-400">18m</span>
                    </div>
                </div>

                {/* Simple SVG Chart Replacement for Recharts */}
                <div className="h-40 w-full bg-zinc-900/20 rounded-lg border border-zinc-800 p-2 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-end justify-center opacity-80">
                        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,40 L0,25 Q10,15 20,28 T40,20 T60,30 T80,10 T100,25 L100,40 Z"
                                fill="url(#chartGradient)"
                            />
                            <path
                                d="M0,25 Q10,15 20,28 T40,20 T60,30 T80,10 T100,25"
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="0.5"
                            />
                        </svg>
                    </div>
                    <div className="absolute top-2 right-2 text-[10px] text-zinc-500 bg-zinc-900/80 px-1 rounded border border-zinc-800">
                        Live Data (24h)
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-400 flex items-center gap-1 uppercase">
                        <Globe className="w-3 h-3" /> Top Locations
                    </h4>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-300">Indonesia</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="w-[62%] h-full bg-cyan-500 rounded-full" />
                                </div>
                                <span className="w-6 text-right text-zinc-500">62%</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-300">Japan</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="w-[15%] h-full bg-blue-500 rounded-full" />
                                </div>
                                <span className="w-6 text-right text-zinc-500">15%</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-300">Others</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="w-[23%] h-full bg-zinc-500 rounded-full" />
                                </div>
                                <span className="w-6 text-right text-zinc-500">23%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
