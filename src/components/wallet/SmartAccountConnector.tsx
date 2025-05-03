
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateSmartAccount, hasStoredWallet } from '@/utils/smartAccount';

interface SmartAccountConnectorProps {
  onConnected: (address: string) => void;
}

const SmartAccountConnector = ({ onConnected }: SmartAccountConnectorProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  
  const connectSmartAccount = async () => {
    try {
      setIsConnecting(true);
      
      const result = await getOrCreateSmartAccount();
      
      if (result.success && result.address) {
        toast({
          title: "Smart Account Connected",
          description: `Connected to address: ${result.address.slice(0, 6)}...${result.address.slice(-4)}`,
        });
        
        onConnected(result.address);
      } else {
        throw new Error("Failed to connect smart account");
      }
    } catch (error) {
      console.error("Smart account connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to smart account",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <Button
      onClick={connectSmartAccount}
      size="sm"
      className="w-full px-3 py-2 bg-[#333] text-white text-xs rounded hover:bg-[#444] transition-colors flex items-center justify-center gap-2"
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Shield size={16} />
          <span>Smart Account (AA)</span>
        </>
      )}
    </Button>
  );
};

export default SmartAccountConnector;
