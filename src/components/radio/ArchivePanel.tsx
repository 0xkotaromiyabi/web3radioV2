
import React from 'react';
import { Folder, Download, Play, Disc } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ArchivePanel() {
    const archives = [
        { id: 1, title: 'Morning Show - 2026-01-08', duration: '02:00:00', size: '120MB' },
        { id: 2, title: 'Tech Talk - 2026-01-07', duration: '01:00:00', size: '58MB' },
    ];

    return (
        <Card className="h-full bg-black/40 backdrop-blur-xl border-zinc-800 text-white shadow-xl">
            <CardHeader className="py-3 px-4 border-b border-zinc-800/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Folder className="w-4 h-4 text-yellow-500" />
                        ARCHIVE & RECORDING
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="auto-record" className="text-xs text-zinc-400">Auto Record</Label>
                        <Switch id="auto-record" className="data-[state=checked]:bg-red-500" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-zinc-800/50">
                    {archives.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-zinc-500">
                                    <Disc className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-300">{item.title}</p>
                                    <p className="text-[10px] text-zinc-500">{item.duration} • {item.size}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Play className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Download className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 text-center border-t border-zinc-800/50">
                    <Button variant="link" className="text-xs text-zinc-500 h-auto p-0 hover:text-white">View Full Archive</Button>
                </div>
            </CardContent>
        </Card>
    );
}
