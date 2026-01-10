
import React from 'react';
import { Activity, Cpu, HardDrive, Wifi, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function SystemHealth() {
    return (
        <Card className="h-full bg-black/40 backdrop-blur-xl border-zinc-800 text-white shadow-xl">
            <CardHeader className="py-3 px-4 border-b border-zinc-800/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    SYSTEM HEALTH
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU Load</span>
                            <span className="text-white">42%</span>
                        </div>
                        <Progress value={42} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> RAM Usage</span>
                            <span className="text-white">61%</span>
                        </div>
                        <Progress value={61} className="h-1.5" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-zinc-900/50 rounded border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-500">Bitrate</span>
                        <span className="font-mono text-emerald-400">128 kbps</span>
                    </div>
                    <div className="p-2 bg-zinc-900/50 rounded border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-500">Latency</span>
                        <span className="font-mono text-emerald-400">1.8s</span>
                    </div>
                </div>

                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 font-mono text-[10px] text-zinc-400 h-24 overflow-hidden">
                    <p className="text-green-500">[INFO] Stream connection established.</p>
                    <p>[INFO] Audio buffer stable (4096 samples).</p>
                    <p>[INFO] Listener connected from 192.168.1.5</p>
                    <p className="text-yellow-500">[WARN] High CPU usage detected momentarily.</p>
                    <p>[INFO] Playlist verified.</p>
                </div>
            </CardContent>
        </Card>
    );
}
