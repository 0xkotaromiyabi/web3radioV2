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
            <div className="p-4 sm:p-5 border-b border-border/30">
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src={logo}
                        alt="Web3Radio"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-apple transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="hidden sm:block">
                        <h1 className="text-foreground font-semibold text-sm sm:text-base">Web3Radio</h1>
                        <p className="text-muted-foreground text-xs">CMS</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 sm:p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={cn(
                            "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl transition-all duration-200 group",
                            activeTab === item.id
                                ? 'bg-blue-500 text-white shadow-apple'
                                : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'
                        )}
                    >
                        <item.icon className={cn(
                            "w-4 h-4 flex-shrink-0",
                            activeTab === item.id
                                ? 'text-white'
                                : 'text-muted-foreground group-hover:text-blue-500'
                        )} />
                        <span className="flex-1 text-left text-xs sm:text-sm font-medium truncate">{item.label}</span>
                        {activeTab === item.id && (
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-70 flex-shrink-0" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-2 sm:p-4 border-t border-border/30 space-y-1">
                <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-all duration-200"
                >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Settings</span>
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button - fixed at top */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-lg shadow-apple border border-border/30"
            >
                {mobileOpen ? (
                    <X className="w-5 h-5 text-foreground" />
                ) : (
                    <Menu className="w-5 h-5 text-foreground" />
                )}
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-56 xl:w-64 min-h-screen flex-col glass-subtle border-r border-border/30">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "lg:hidden fixed inset-0 z-40 transition-all duration-300",
                    mobileOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />

                {/* Sidebar Panel */}
                <div
                    className={cn(
                        "absolute left-0 top-0 bottom-0 w-64 max-w-[80vw] flex flex-col bg-white/95 backdrop-blur-xl border-r border-border/30 shadow-2xl transform transition-transform duration-300",
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
