
import React from 'react';
import { Users, Globe, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '00:00', listeners: 40 },
    { time: '04:00', listeners: 30 },
    { time: '08:00', listeners: 85 },
    { time: '12:00', listeners: 120 },
    { time: '16:00', listeners: 90 },
    { time: '20:00', listeners: 70 },
    { time: '24:00', listeners: 50 },
];

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

                <div className="h-40 w-full bg-zinc-900/20 rounded-lg border border-zinc-800 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorListeners" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                itemStyle={{ color: '#06b6d4' }}
                            />
                            <Area type="monotone" dataKey="listeners" stroke="#06b6d4" fillOpacity={1} fill="url(#colorListeners)" />
                        </AreaChart>
                    </ResponsiveContainer>
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
