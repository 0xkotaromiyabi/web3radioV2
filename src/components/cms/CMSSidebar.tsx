import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Newspaper,
    Calendar,
    Radio,
    Image,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import logo from '@/assets/web3radio-logo.png';
import { cn } from '@/lib/utils';

interface CMSSidebarProps {
    onLogout: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const CMSSidebar: React.FC<CMSSidebarProps> = ({ onLogout, activeTab, onTabChange }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'news', label: 'News', icon: Newspaper },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'stations', label: 'Stations', icon: Radio },
        { id: 'media', label: 'Media', icon: Image },
        { id: 'radio-hub', label: 'Radio Hub', icon: Radio },
    ];

    const handleTabChange = (tab: string) => {
        onTabChange(tab);
        setMobileOpen(false);
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 sm:p-8 border-b border-[#515044]/5">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:rotate-6">
                        <img
                            src={logo}
                            alt="Web3Radio"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-[#515044] font-bold text-sm tracking-tight uppercase">Web3Radio</h1>
                        <p className="text-[#515044]/30 text-[8px] font-bold uppercase tracking-[0.3em]">Control Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 sm:p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] transition-all duration-300 group relative",
                            activeTab === item.id
                                ? 'bg-[#515044] text-white shadow-xl shadow-[#515044]/20'
                                : 'text-[#515044]/40 hover:bg-[#515044]/5 hover:text-[#515044]'
                        )}
                    >
                        <item.icon className={cn(
                            "w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                            activeTab === item.id ? 'text-white' : 'text-[#515044]/30 group-hover:text-[#515044]'
                        )} />
                        <span className="flex-1 text-left text-[10px] sm:text-xs font-bold uppercase tracking-widest">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-[#515044]/5 space-y-2">
                <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-[#515044]/40 hover:bg-[#515044]/5 hover:text-[#515044] transition-all duration-300"
                >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-red-400 hover:bg-red-500/5 hover:text-red-500 transition-all duration-300"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button - fixed at top */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-6 left-6 z-50 p-4 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-[#515044]/5 text-[#515044]"
            >
                {mobileOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <Menu className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                )}
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 xl:w-72 h-screen flex-col bg-white/50 backdrop-blur-2xl border-r border-[#515044]/5">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "lg:hidden fixed inset-0 z-40 transition-all duration-500",
                    mobileOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-[#515044]/20 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />

                {/* Sidebar Panel */}
                <div
                    className={cn(
                        "absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] flex flex-col bg-white/95 backdrop-blur-2xl border-r border-[#515044]/5 shadow-2xl transform transition-transform duration-500 ease-out",
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <SidebarContent />
                </div>
            </div>
        </>
    );
};

export default CMSSidebar;
