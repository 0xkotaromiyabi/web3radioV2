import React from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Newspaper,
    Calendar,
    Radio,
    Image,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import logo from '@/assets/web3radio-logo.png';

interface CMSSidebarProps {
    onLogout: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const CMSSidebar: React.FC<CMSSidebarProps> = ({ onLogout, activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'news', label: 'News', icon: Newspaper },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'stations', label: 'Radio Stations', icon: Radio },
        { id: 'media', label: 'Media Library', icon: Image },
    ];

    return (
        <div className="w-64 min-h-screen flex flex-col glass-subtle border-r border-border/30">
            {/* Logo */}
            <div className="p-5 border-b border-border/30">
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src={logo}
                        alt="Web3Radio"
                        className="w-10 h-10 rounded-xl shadow-apple transition-all duration-300 group-hover:scale-105"
                    />
                    <div>
                        <h1 className="text-foreground font-semibold text-base">Web3Radio</h1>
                        <p className="text-muted-foreground text-xs">Content Management</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-blue-500 text-white shadow-apple'
                            : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'
                            }`}
                    >
                        <item.icon className={`w-4 h-4 ${activeTab === item.id
                            ? 'text-white'
                            : 'text-muted-foreground group-hover:text-blue-500'
                            }`} />
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        {activeTab === item.id && (
                            <ChevronRight className="w-4 h-4 opacity-70" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/30 space-y-1">
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-all duration-200"
                >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default CMSSidebar;
