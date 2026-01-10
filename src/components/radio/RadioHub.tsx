
import React, { useState } from 'react';
import { LayoutDashboard, Radio, ListMusic, CalendarDays, BarChart3, MessageSquare, Archive, Activity, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Import Panels
import BroadcastControls from '@/components/radio/BroadcastControls';
import PlaylistLibrary from '@/components/radio/PlaylistLibrary';
import ProgramSchedule from '@/components/radio/ProgramSchedule';
import ListenerAnalytics from '@/components/radio/ListenerAnalytics';
import LiveChat from '@/components/radio/LiveChat';
import ArchivePanel from '@/components/radio/ArchivePanel';
import SystemHealth from '@/components/radio/SystemHealth';
import SettingsPanel from '@/components/radio/SettingsPanel';

export default function RadioHub() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'on-air', label: 'On Air / Control', icon: Radio },
        { id: 'playlist', label: 'Playlist & Lib', icon: ListMusic },
        { id: 'schedule', label: 'Schedule', icon: CalendarDays },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'chat', label: 'Live Chat', icon: MessageSquare },
        { id: 'archive', label: 'Archive', icon: Archive },
        { id: 'system', label: 'System Health', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-zinc-100 overflow-hidden font-sans">

            {/* SIDEBAR */}
            <aside
                className={cn(
                    "flex flex-col border-r border-zinc-800 bg-black/80 backdrop-blur-md transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-16"
                )}
            >
                <div className="h-14 flex items-center px-4 border-b border-zinc-800">
                    {sidebarOpen && <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Web3Radio</span>}
                    <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu className="w-4 h-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-2">
                        {menuItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", !sidebarOpen && "justify-center px-0")}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon className={cn("w-4 h-4", sidebarOpen && "mr-2")} />
                                {sidebarOpen && item.label}
                            </Button>
                        ))}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-zinc-700">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>DJ</AvatarFallback>
                        </Avatar>
                        {sidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold">DJ Kotaro</span>
                                <span className="text-[10px] text-zinc-500">Station Admin</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* TOP BAR */}
                <header className="h-14 border-b border-zinc-800 bg-black/60 backdrop-blur-sm flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold tracking-wider text-red-500">ON AIR</span>
                        </div>
                        <div className="h-4 w-[1px] bg-zinc-800" />
                        <span className="text-sm font-medium text-zinc-300">Station: <span className="text-white">Web3Radio Global</span></span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-green-500" /> System: Optimal</span>
                        <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-cyan-500" /> Listeners: 128</span>
                    </div>
                </header>

                {/* DASHBOARD GRID CONTENT */}
                <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-br from-zinc-900 to-black">

                    {/* MODE: DASHBOARD (Overview - Grid View) */}
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto min-h-full pb-4">
                            {/* Row 1: Controls (Span 8) & System Health (Span 4) */}
                            <div className="md:col-span-8 h-[320px]">
                                <BroadcastControls />
                            </div>
                            <div className="md:col-span-4 h-[320px]">
                                <SystemHealth />
                            </div>

                            {/* Row 2: Playlist (Span 6) & Chat (Span 6) */}
                            <div className="md:col-span-6 h-[400px]">
                                <PlaylistLibrary />
                            </div>
                            <div className="md:col-span-6 h-[400px]">
                                <LiveChat />
                            </div>

                            {/* Row 3: Schedule (Span 4) & Analytics (Span 4) & Archive (Span 4) */}
                            <div className="md:col-span-4 h-[300px]">
                                <ProgramSchedule />
                            </div>
                            <div className="md:col-span-4 h-[300px]">
                                <ListenerAnalytics />
                            </div>
                            <div className="md:col-span-4 h-[300px]">
                                <ArchivePanel />
                            </div>
                        </div>
                    )}

                    {/* INDIVIDUAL TAB VIEWS (Full Screen Mode) */}
                    {activeTab === 'on-air' && <div className="h-full"><BroadcastControls /></div>}
                    {activeTab === 'playlist' && <div className="h-full"><PlaylistLibrary /></div>}
                    {activeTab === 'schedule' && <div className="h-full"><ProgramSchedule /></div>}
                    {activeTab === 'analytics' && <div className="h-full"><ListenerAnalytics /></div>}
                    {activeTab === 'chat' && <div className="h-full"><LiveChat /></div>}
                    {activeTab === 'archive' && <div className="h-full"><ArchivePanel /></div>}
                    {activeTab === 'system' && <div className="h-full"><SystemHealth /></div>}
                    {activeTab === 'settings' && <div className="h-full"><SettingsPanel /></div>}

                </div>
            </main>
        </div>
    );
}
