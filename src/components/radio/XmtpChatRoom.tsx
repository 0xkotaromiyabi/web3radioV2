import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppKitProvider } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { X, Send, Loader2, MessageSquare, ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface XmtpChatRoomProps {
    stationId: string;
    stationName: string;
    onClose: () => void;
}

const STATION_HUBS: Record<string, string> = {
    'web3': '0x242dfB7849544Ee242B2265CA7E585BdEc60456B',
    'ozradio': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    'female': '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    'delta': '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    'prambors': '0xFFcf8FDEE72ac11b5c542428B35EEF576bd295b2'
};

import {
    useClient,
    useSendMessage,
    useMessages,
} from '@xmtp/react-sdk';

export default function XmtpChatRoom({ stationId, stationName, onClose }: XmtpChatRoomProps) {
    const { address, isConnected } = useAccount();
    const { walletProvider } = useAppKitProvider('eip155');

    const { client, initialize, isLoading: isInitializing } = useClient();
    const hubAddress = STATION_HUBS[stationId] || STATION_HUBS['web3'];

    const [conv, setConv] = useState<any>(null);
    const [inputValue, setInputValue] = useState('');
    const [initError, setInitError] = useState<string | null>(null);

    useEffect(() => {
        if (client && hubAddress) {
            const setupConversation = async () => {
                try {
                    // XMTP V3 (MLS) usesGroups for everything. 
                    // We look for an existing group with this hub or create a new one.
                    const allGroups = await client.conversations.listGroups();
                    let group = allGroups.find(g => g.peerAddresses.includes(hubAddress.toLowerCase()));

                    if (!group) {
                        group = await client.conversations.newGroup([hubAddress]);
                    }

                    setConv(group);
                } catch (err: any) {
                    console.error('Conversation Error:', err);
                    setInitError('Failed to load V3 conversation. Ensure your wallet supports MLS.');
                }
            };
            setupConversation();
        }
    }, [client, hubAddress]);

    const handleInit = async () => {
        if (!walletProvider || !address) return;
        setInitError(null);

        try {
            const provider = new ethers.providers.Web3Provider(walletProvider as any);
            const signer = provider.getSigner();
            await initialize({ signer, env: 'production' });
        } catch (err: any) {
            console.error('XMTP Init Error:', err);
            setInitError(err.message || 'Failed to connect to XMTP. Ensure an EOA wallet is active.');
        }
    };

    if (!isConnected) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-2xl w-full max-w-lg h-[80vh] flex flex-col border border-white/20 animate-in zoom-in-95 duration-500 overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-[#515044]/5 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#515044]/5 flex items-center justify-center overflow-hidden">
                            <img src="https://i.imgur.com/g3FTYNs.png" alt="XMTP Logo" className="w-8 h-8 object-contain" />
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

                {/* Content Area */}
                <div className="flex-1 min-h-0 flex flex-col relative">
                    {initError && (
                        <div className="px-6 pt-4">
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border border-red-100 italic">
                                ⚠️ {initError}
                            </div>
                        </div>
                    )}

                    {!client ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                            <div className="w-20 h-20 rounded-3xl bg-[#515044]/5 flex items-center justify-center animate-pulse">
                                <MessageSquare className="w-10 h-10 text-[#515044]/20" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-[#515044]">Connect to XMTP</h4>
                                <p className="text-sm text-[#515044]/60 max-w-[240px]">
                                    Use decentralized chat to interact with other listeners.
                                </p>
                            </div>
                            <button
                                onClick={handleInit}
                                disabled={isInitializing}
                                className="w-full max-w-[200px] py-4 bg-[#515044] text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all disabled:opacity-50"
                            >
                                {isInitializing ? 'Connecting...' : 'Enable Chat'}
                            </button>
                        </div>
                    ) : conv ? (
                        <ChatContainer
                            conv={conv}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            setInitError={setInitError}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#515044]/10 border-t-[#515044] rounded-full animate-spin" />
                            <p className="text-sm font-bold text-[#515044]/40 uppercase tracking-widest">Starting Conversation...</p>
                        </div>
                    )}

                    {!client && (
                        <div className="p-4 bg-amber-50 mx-6 mb-6 rounded-2xl flex gap-3 border border-amber-500/10">
                            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[9px] font-medium text-amber-700 leading-relaxed uppercase tracking-wider">
                                XMTP currently only supports EVM wallets (Ethereum, Polygon, Base, etc). Solana is not yet fully supported in this version.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ChatContainer({ conv, inputValue, setInputValue, setInitError }: any) {
    const { address } = useAccount();
    const { messages, isLoading: isLoadingMessages } = useMessages(conv);
    const { sendMessage: sendXmtpMessage, isLoading: isSending } = useSendMessage(conv);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isSending) return;
        try {
            await sendXmtpMessage(inputValue);
            setInputValue('');
        } catch (err: any) {
            console.error('Send Error:', err);
            setInitError('Failed to send message.');
        }
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#515044]/[0.02]">
                {isLoadingMessages ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#515044]/10 border-t-[#515044] rounded-full animate-spin" />
                        <p className="text-sm font-bold text-[#515044]/40 uppercase tracking-widest">Loading Messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <p className="text-sm text-[#515044]/40 font-medium italic">No messages yet. Be the first to say hi!</p>
                    </div>
                ) : (
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-4">
                            {messages.map((msg: any) => {
                                const isMe = msg.senderAddress === address;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${isMe
                                            ? 'bg-[#515044] text-white rounded-tr-none'
                                            : 'bg-white text-[#515044] border border-[#515044]/5 rounded-tl-none'
                                            }`}>
                                            {!isMe && (
                                                <p className="text-[10px] font-bold opacity-40 mb-1 uppercase tracking-wider">
                                                    {msg.senderAddress.slice(0, 6)}...{msg.senderAddress.slice(-4)}
                                                </p>
                                            )}
                                            <p className="leading-relaxed font-medium">{msg.content}</p>
                                            <p className={`text-[9px] mt-2 opacity-40 font-bold ${isMe ? 'text-right' : 'text-left'}`}>
                                                {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                )}
            </div>

            <div className="p-6 border-t border-[#515044]/5 bg-white/50 flex gap-3">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border border-[#515044]/10 rounded-2xl h-14 px-6 text-sm focus-visible:ring-[#515044]"
                />
                <Button
                    onClick={handleSend}
                    disabled={isSending || !inputValue.trim()}
                    className="w-14 h-14 rounded-2xl bg-[#515044] hover:bg-black text-white p-0 shadow-lg shadow-[#515044]/10 transition-transform active:scale-95"
                >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
            </div>
        </>
    );
}
