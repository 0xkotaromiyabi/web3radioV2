
import React from 'react';
import { MicropaymentButton } from '../components/MicropaymentButton';
import NavBar from '@/components/navigation/NavBar';
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Lock } from "lucide-react";

const PremiumContent = () => {
    return (
        <div className="min-h-screen w-full bg-transparent relative overflow-y-auto text-white flex flex-col items-center">
            <NavBar />

            <main className="container py-24 md:py-32 px-6 max-w-lg mx-auto text-center flex flex-col items-center">
                <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] p-12 shadow-2xl border border-[#515044]/5 w-full flex flex-col items-center space-y-10">
                    {/* Badge */}
                    <Badge className="bg-[#515044]/5 text-[#515044] hover:bg-[#515044]/10 border-none px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
                        <Crown className="w-3 h-3 mr-2 text-amber-500" />
                        Premium Access
                    </Badge>

                    {/* Content Preview */}
                    <div className="w-32 h-32 rounded-[40px] bg-[#515044]/5 flex items-center justify-center relative">
                        <Lock className="w-12 h-12 text-[#515044]/20" />
                        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-[#fef29c] shadow-lg flex items-center justify-center border border-white">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-[#515044]">
                            Unlock the Studio
                        </h1>
                        <p className="text-sm font-light leading-relaxed text-[#515044]/60 max-w-[280px] mx-auto">
                            Get instant access to exclusive behind-the-scenes content and early releases by making a one-time secure payment.
                        </p>
                    </div>

                    <div className="w-full pt-4">
                        <MicropaymentButton />
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20">
                        Secure transaction powered by web3
                    </p>
                </div>
            </main>
        </div>
    );
};

export default PremiumContent;
