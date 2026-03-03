import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import logo from '@/assets/web3radio-logo.png';

const PintuMasuk = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Check if already logged in
    useEffect(() => {
        const auth = localStorage.getItem('cms_auth');
        if (auth === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (username === 'web3radio' && password === 'web3radio2024') {
                localStorage.setItem('cms_auth', 'true');
                toast({
                    title: "Akses Diberikan",
                    description: "Selamat datang di Control Panel Web3Radio.",
                });
                navigate('/dashboard');
            } else {
                toast({
                    title: "Akses Ditolak",
                    description: "Username atau Password salah. Silakan coba lagi.",
                    variant: "destructive",
                });
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen w-full bg-transparent relative overflow-hidden text-white flex items-center justify-center p-6">

            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-12 border border-[#515044]/5 shadow-2xl overflow-hidden group">
                    {/* Interior Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#515044]/10 to-transparent"></div>

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-20 h-20 mb-8 rounded-3xl overflow-hidden shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-white">
                            <img
                                src={logo}
                                alt="Web3Radio"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-2">
                            <Badge className="bg-white/10 text-white/60 border-none px-4 py-1 rounded-full text-[8px] font-bold uppercase tracking-[0.3em] inline-flex items-center gap-2 mb-2">
                                <Sparkles className="w-2.5 h-2.5" />
                                Secured Access
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight">Pintu Masuk</h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Masuk ke Control Panel Web3Radio</p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Username</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#515044]/30">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-[#515044]/5 border-none h-14 pl-11 rounded-2xl focus:ring-2 focus:ring-[#515044]/10 focus:bg-white transition-all font-medium text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Password</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#515044]/30">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-[#515044]/5 border-none h-14 pl-11 rounded-2xl focus:ring-2 focus:ring-[#515044]/10 focus:bg-white transition-all font-medium text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#515044] hover:bg-black text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#515044]/20 group/btn active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="uppercase text-xs tracking-widest">Akses Control Panel</span>
                                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 leading-relaxed">
                            Web3Radio CMS v2.0<br />
                            Authorized personnel only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Badge component if not imported
const Badge = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div className={`inline-flex items-center ${className}`}>
        {children}
    </div>
);

export default PintuMasuk;
