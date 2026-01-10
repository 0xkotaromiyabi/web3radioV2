
import React, { useState } from 'react';
import { Play, Pause, Plus, Search, Upload, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PlaylistLibrary() {
    const [queue, setQueue] = useState([
        { id: 1, title: 'Midnight City', artist: 'M83', duration: '04:03' },
        { id: 2, title: 'Instant Crush', artist: 'Daft Punk', duration: '05:37' },
    ]);

    const [library, setLibrary] = useState([
        { id: 3, title: 'Get Lucky', artist: 'Daft Punk', duration: '04:08' },
        { id: 4, title: 'Starboy', artist: 'The Weeknd', duration: '03:50' },
        { id: 5, title: 'Technologic', artist: 'Daft Punk', duration: '04:44' },
        { id: 6, title: 'Harder, Better, Faster', artist: 'Daft Punk', duration: '03:45' },
        { id: 7, title: 'One More Time', artist: 'Daft Punk', duration: '05:20' },
    ]);

    return (
        <Card className="flex flex-col h-full bg-black/40 backdrop-blur-xl border-zinc-800 text-white shadow-2xl overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-zinc-800/50 bg-zinc-900/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Music className="w-4 h-4 text-purple-400" />
                        PLAYLIST & LIBRARY
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-700 hover:bg-zinc-800">
                            <Upload className="w-3 h-3 mr-1" /> Import
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                {/* Helper UI */}
                <div className="p-3 border-b border-zinc-800 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1.5 w-4 h-4 text-zinc-500" />
                        <Input className="pl-8 h-8 text-xs bg-zinc-900/50 border-zinc-800" placeholder="Search tracks..." />
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Up Next / Queue */}
                <div className="flex-none p-4 bg-purple-900/10 border-b border-purple-500/20">
                    <h4 className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">Up Next (Queue)</h4>
                    <div className="space-y-2">
                        {queue.map((track, i) => (
                            <div key={track.id} className="flex items-center justify-between text-sm group p-2 rounded hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-zinc-500 text-xs w-4">{i + 1}</span>
                                    <div>
                                        <p className="font-medium text-zinc-200">{track.title}</p>
                                        <p className="text-xs text-zinc-500">{track.artist}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-zinc-600">{track.duration}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Library List */}
                <ScrollArea className="flex-1 p-2">
                    {library.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800/50 group cursor-pointer border border-transparent hover:border-zinc-800 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-cyan-500 transition-colors">
                                    <Play className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white">{track.title}</p>
                                    <p className="text-xs text-zinc-500">{track.artist}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="outline" className="text-[10px] h-5 border-zinc-700">MP3</Badge>
                                <Button size="icon" variant="ghost" className="h-6 w-6">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </ScrollArea>

            </CardContent>
        </Card>
    );
}
