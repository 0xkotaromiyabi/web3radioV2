
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createAlchemySmartAccount } from "@/utils/smartAccount";

interface SmartAccountConnectorProps {
  onSmartAccountConnected: (address: string) => void;
}

const SmartAccountConnector: React.FC<SmartAccountConnectorProps> = ({ onSmartAccountConnected }) => {
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const connectSmartAccount = async () => {
    setConnecting(true);

    try {
      // In a real implementation we'd use the user's connected address
      // For demo purposes we'll use a mock address
      const mockOwnerAddress = "0x1234567890123456789012345678901234567890";
      
      // Create smart account
      const smartAccount = await createAlchemySmartAccount(mockOwnerAddress);
      
      if (!smartAccount || !smartAccount.address) {
        throw new Error("Failed to create smart account");
      }
      
      onSmartAccountConnected(smartAccount.address);
      
      toast({
        title: "Smart Account Connected",
        description: `Connected to ${smartAccount.address.slice(0, 6)}...${smartAccount.address.slice(-4)} on ${smartAccount.chain}`,
      });
    } catch (error) {
      console.error("Smart account connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to smart account",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 bg-purple-900/30 border-purple-700/50 hover:bg-purple-900/50 text-purple-200"
      onClick={connectSmartAccount}
      disabled={connecting}
    >
      <Wallet className="h-4 w-4" />
      {connecting ? "Connecting..." : "Smart Account"}
    </Button>
  );
};

export default SmartAccountConnector;
