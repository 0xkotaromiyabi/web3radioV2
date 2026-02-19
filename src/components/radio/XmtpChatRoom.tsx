import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { useAppKitProvider } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { X, Send, Loader2, MessageSquare, ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: string;
    senderAddress: string;
    content: string;
    sent: Date;
}

interface XmtpChatRoomProps {
    stationId: string;
    stationName: string;
    onClose: () => void;
}

// Map stations to common recipient addresses or specific conversation keys
// In a real app, these would be specific group inbox IDs or known addresses.
// For demo purposes, we'll use a specific constant address for each station's "hub"
const STATION_HUBS: Record<string, string> = {
    'web3': '0x242dfB7849544Ee242B2265CA7E585BdEc60456B', // Use same as EVM_DESTINATION
    'ozradio': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    'female': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    'delta': '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    'prambors': '0xFFcf8FDEE72ac11b5c542428B35EEF576bd295b2'
};

export default function XmtpChatRoom({ stationId, stationName, onClose }: XmtpChatRoomProps) {
    const { address, isConnected } = useAccount();
    const { walletProvider } = useAppKitProvider('eip155');

    const [client, setClient] = useState<Client | null>(null);
    const [conv, setConv] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isInitializing, setIsInitializing] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const hubAddress = STATION_HUBS[stationId] || STATION_HUBS['web3'];

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const initXmtp = async () => {
        if (!walletProvider || !address) return;

        setIsInitializing(true);
        setError(null);

        try {
            // Create ethers provider/signer from AppKit's walletProvider
            const provider = new ethers.providers.Web3Provider(walletProvider as any);
            const signer = provider.getSigner();

            // Initialize XMTP client
            const xmtp = await Client.create(signer, { env: 'production' });
            setClient(xmtp);

            // Find or create conversation with the station's hub address
            const conversation = await xmtp.conversations.newConversation(hubAddress);
            setConv(conversation);

            // Load existing messages
            const existingMessages = await conversation.messages();
            setMessages(existingMessages.map(m => ({
                id: m.id,
                senderAddress: m.senderAddress,
                content: m.content as string,
                sent: m.sent
            })));

            // Start streaming
            const stream = await conversation.streamMessages();
            for await (const message of stream) {
                setMessages(prev => {
                    if (prev.some(m => m.id === message.id)) return prev;
                    return [...prev, {
                        id: message.id,
                        senderAddress: message.senderAddress,
                        content: message.content as string,
                        sent: message.sent
                    }];
                });
            }

        } catch (err: any) {
            console.error('XMTP Init Error:', err);
            setError(err.message || 'Gagal tersambung ke XMTP. Pastikan dompet EOA aktif.');
        } finally {
            setIsInitializing(false);
        }
    };

    const sendMessage = async () => {
        if (!conv || !inputValue.trim() || isSending) return;

        setIsSending(true);
        try {
            await conv.send(inputValue);
            setInputValue('');
        } catch (err: any) {
            console.error('Send Error:', err);
            setError('Gagal mengirim pesan.');
        } finally {
            setIsSending(false);
        }
    };

    if (!isConnected) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-2xl w-full max-w-lg h-[80vh] flex flex-col border border-white/20 animate-in zoom-in-95 duration-500 overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-[#515044]/5 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#515044]/5 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-[#515044]/40" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#515044]">{stationName} Chat</h3>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-500/5 text-green-600 border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">
                                    Decentralized
                                </Badge>
                                <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-[#515044]/30">
                                    <ShieldCheck className="w-2.5 h-2.5" /> E2E Encrypted
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl hover:bg-[#515044]/5 text-[#515044]/40 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 flex flex-col relative">
                    {!client ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                            <div className="w-20 h-20 rounded-[32px] bg-[#515044]/5 flex items-center justify-center animate-pulse">
                                <ShieldCheck className="w-10 h-10 text-[#515044]/20" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-[#515044]">Inisialisasi XMTP</h4>
                                <p className="text-xs text-[#515044]/50 leading-relaxed max-w-[280px]">
                                    Pesan Anda akan dienkripsi secara end-to-end. Silakan setujui permintaan tanda tangan di dompet Anda.
                                </p>
                            </div>
                            <Button
                                onClick={initXmtp}
                                disabled={isInitializing}
                                className="bg-[#515044] hover:bg-black text-white px-8 py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#515044]/10"
                            >
                                {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hubungkan Chat'}
                            </Button>
                            {error && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/5 px-4 py-2 rounded-lg">
                                    {error}
                                </p>
                            )}
                        </div>
                    ) : (
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                {messages.length === 0 && (
                                    <div className="py-10 text-center space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20">Belum ada pesan</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#515044]/10">Mulai obrolan di frekuensi ini</p>
                                    </div>
                                )}
                                {messages.map((msg) => {
                                    const isMe = msg.senderAddress.toLowerCase() === address?.toLowerCase();
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                                            <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${isMe
                                                    ? 'bg-[#515044] text-white rounded-br-none shadow-lg'
                                                    : 'bg-white border border-[#515044]/5 text-[#515044] rounded-bl-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/20 px-2">
                                                {isMe ? 'Anda' : `${msg.senderAddress.slice(0, 6)}...${msg.senderAddress.slice(-4)}`} • {msg.sent.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    )}

                    {/* Warning Banner */}
                    {!client && (
                        <div className="p-4 bg-amber-50 mx-6 mb-6 rounded-2xl flex gap-3 border border-amber-500/10">
                            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[9px] font-medium text-amber-700 leading-relaxed uppercase tracking-wider">
                                XMTP hanya mendukung dompet EVM (Ethereum, Polygon, Base, etc). Solana belum didukung sepenuhnya di versi ini.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {client && (
                    <div className="p-6 border-t border-[#515044]/5 bg-white/50 flex gap-3">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ketik pesan..."
                            className="flex-1 bg-white/80 border-[#515044]/10 rounded-2xl h-14 px-6 text-sm focus-visible:ring-[#515044]"
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={isSending || !inputValue.trim()}
                            className="w-14 h-14 rounded-2xl bg-[#515044] hover:bg-black text-white p-0 shadow-lg shadow-[#515044]/10 transition-transform active:scale-95"
                        >
                            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
