import React, { useState } from 'react';
import { useChat } from "@ai-sdk/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

interface AIChatProps {
  client: any;
}

const supabaseUrl = 'https://zxyoidfksqmccwvdduxk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eW9pZGZrc3FtY2N3dmRkdXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTMwNDEsImV4cCI6MjA2NTQ4OTA0MX0.sjAUWjkuJAp-RVskCTa9BwanW6PSKj94fMmFCv3lghM';
const supabase = createClient(supabaseUrl, supabaseKey);

const AIChat: React.FC<AIChatProps> = ({ client }) => {
  const [sessionId, setSessionId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: inputValue,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, userMessage],
          sessionId,
        },
      });
      
      if (error) throw error;
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: data.content || "Sorry, I couldn't process that request.",
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      if (data.session_id) {
        setSessionId(data.session_id);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="p-3 bg-[#222] border-[#444]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">AI Assistant</h3>
          <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333]">
            <Bot className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
        
        <ScrollArea className="h-40 w-full">
          <div className="space-y-2">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <div className="w-full h-16 bg-[#333] rounded-md flex items-center justify-center mb-2">
                  <Bot className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-gray-400">
                  Ask me about blockchain, tokens, or trading!
                </span>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 text-[#00ff00] mt-1 flex-shrink-0" />
                )}
                <div
                  className={`max-w-[80%] p-2 rounded-md text-xs ${
                    message.role === 'user'
                      ? 'bg-[#00ff00] text-black'
                      : 'bg-[#333] text-white'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <User className="w-4 h-4 text-[#00ff00] mt-1 flex-shrink-0" />
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 text-[#00ff00] mt-1 flex-shrink-0" />
                <div className="bg-[#333] text-white p-2 rounded-md text-xs">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about blockchain, tokens, etc..."
            className="bg-[#333] border-[#444] text-white text-xs"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="bg-[#00ff00] hover:bg-[#00dd00] text-black"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-400 text-center">
          AI assistant powered by thirdweb blockchain models
        </p>
      </div>
    </Card>
  );
};

export default AIChat;