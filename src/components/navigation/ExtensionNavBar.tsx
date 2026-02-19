
import React from 'react';
import { Home, Calendar, Radio, Users, LogIn, Gift, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from '@/assets/web3radio-logo.png';

const ExtensionNavBar = () => {
    const openExternal = (path: string) => {
        window.open(`https://webthreeradio.xyz${path}`, '_blank');
    };

    const navLinks = [
        { to: '/stations', label: 'Stations', icon: Radio },
    ];

    return (
        <header className="w-full border-b border-border/50 bg-background py-3">
            <div className="px-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Web3Radio"
                        className="w-8 h-8 rounded-lg shadow-sm"
                    />
                    <span className="font-semibold text-base text-foreground">
                        Web3Radio
                    </span>
                </div>

                {/* Simple Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openExternal('/')}
                        title="Open Web App"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Quick Links Row */}
            <div className="flex items-center justify-center gap-4 mt-2 pb-1">
                {navLinks.map((link) => (
                    <button
                        key={link.to}
                        onClick={() => openExternal(link.to)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                        <link.icon className="w-3 h-3" />
                        {link.label}
                    </button>
                ))}
                <button
                    onClick={() => openExternal('/dashboard')}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                    <LogIn className="w-3 h-3" />
                    Login
                </button>
            </div>
        </header>
    );
};

export default ExtensionNavBar;
