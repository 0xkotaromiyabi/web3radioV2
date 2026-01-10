
import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: number;
    user: string;
    text: string;
    timestamp: string;
    type: 'user' | 'system';
}

export default function LiveChat() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, user: '0xAbc...123', text: 'Mantap lagunya 🔥', timestamp: '10:02', type: 'user' },
        { id: 2, user: 'System', text: 'Welcome to the stream!', timestamp: '10:00', type: 'system' },
        { id: 3, user: 'guest_92', text: 'Request jazz dong', timestamp: '10:05', type: 'user' },
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMessage: Message = {
            id: Date.now(),
            user: 'You',
            text: inputValue,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            type: 'user'
        };
        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    return (
        <Card className="flex flex-col h-full bg-black/40 backdrop-blur-xl border-zinc-800 text-white shadow-xl overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-zinc-800/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-400" />
                    LIVE CHAT
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-2 ${msg.type === 'system' ? 'justify-center my-4' : ''}`}>
                                {msg.type === 'user' ? (
                                    <>
                                        <Avatar className="w-8 h-8 border border-zinc-700">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${msg.user}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-xs font-bold text-cyan-400">{msg.user}</span>
                                                <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                                            </div>
                                            <p className="text-sm text-zinc-300 leading-snug">{msg.text}</p>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-xs text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded-full border border-zinc-800">
                                        {msg.text}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-3 bg-zinc-900/20 border-t border-zinc-800 flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type message..."
                        className="h-9 bg-zinc-900/50 border-zinc-700 text-sm focus-visible:ring-cyan-500"
                    />
                    <Button size="sm" className="h-9 w-9 p-0 bg-cyan-600 hover:bg-cyan-700" onClick={handleSend}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
