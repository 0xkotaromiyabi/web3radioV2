import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  participants: string[];
}

const XMTPChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeXMTP();
  }, []);

  const initializeXMTP = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to use chat",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('xmtp-chat', {
        body: { action: 'create_client' },
      });

      if (error) throw error;

      setIsInitialized(true);
      loadConversations();
      
      toast({
        title: "Connected",
        description: "XMTP chat is ready",
      });
    } catch (error) {
      console.error('XMTP initialization error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to XMTP network",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('xmtp-chat', {
        body: { action: 'list_conversations' },
      });

      if (error) throw error;
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('xmtp-chat', {
        body: { 
          action: 'get_messages',
          data: { groupId: conversationId }
        },
      });

      if (error) throw error;
      setMessages(data.messages || []);
      setCurrentConversation(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !currentConversation) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('xmtp-chat', {
        body: { 
          action: 'send_message',
          data: { 
            groupId: currentConversation,
            message: inputValue 
          }
        },
      });

      if (error) throw error;

      const newMessage: Message = {
        id: data.messageId,
        content: inputValue,
        sender: 'You',
        timestamp: data.timestamp,
      };

      setMessages(prev => [...prev, newMessage]);
      setInputValue("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('xmtp-chat', {
        body: { 
          action: 'create_group',
          data: { 
            groupName: 'New Chatroom',
            participants: []
          }
        },
      });

      if (error) throw error;

      toast({
        title: "Group Created",
        description: data.groupName,
      });

      loadConversations();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isInitialized) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Connecting to XMTP network...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">XMTP Chatroom</h3>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Users className="w-3 h-3 mr-1" />
            {conversations.length} Rooms
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Conversations List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Conversations</h4>
              <Button 
                onClick={createGroup} 
                size="sm" 
                variant="outline"
                disabled={isLoading}
              >
                New
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No conversations yet</p>
                  <Button 
                    onClick={createGroup} 
                    size="sm" 
                    className="mt-2"
                  >
                    Create First Room
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <Button
                      key={conv.id}
                      onClick={() => loadMessages(conv.id)}
                      variant={currentConversation === conv.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      {conv.name}
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 space-y-3">
            <ScrollArea className="h-[300px] border border-border rounded-md p-3 bg-background">
              {!currentConversation ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{message.sender}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-muted p-2 rounded-md">
                        <p className="text-sm text-foreground">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || !currentConversation}
                className="bg-background border-border text-foreground"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim() || !currentConversation}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          End-to-end encrypted messaging powered by XMTP
        </p>
      </div>
    </Card>
  );
};

export default XMTPChatRoom;
