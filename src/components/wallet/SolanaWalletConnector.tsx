
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SolanaWalletConnectorProps {
  solanaWallet: string | null;
  setSolanaWallet: React.Dispatch<React.SetStateAction<string | null>>;
}

const SolanaWalletConnector = ({ solanaWallet, setSolanaWallet }: SolanaWalletConnectorProps) => {
  const { toast } = useToast();

  const connectSolanaWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        toast({
          title: "Connecting Solana wallet",
          description: "Please approve the connection request in your Phantom wallet",
        });
        
        const resp = await window.solana.connect();
        const pubKey = resp.publicKey.toString();
        setSolanaWallet(pubKey);
        
        toast({
          title: "Solana wallet connected",
          description: `Connected: ${pubKey.slice(0, 6)}...${pubKey.slice(-4)}`,
        });
      } else {
        toast({
          title: "Phantom wallet not found",
          description: "Please install Phantom wallet extension",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
      }
    } catch (err) {
      console.error('Error connecting to Solana wallet:', err);
      toast({
        title: "Connection failed",
        description: "Failed to connect to Solana wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectSolanaWallet = () => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.disconnect();
      setSolanaWallet(null);
      
      toast({
        title: "Solana wallet disconnected",
        description: "Your Solana wallet has been disconnected",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-w-0">
      {solanaWallet ? (
        <Button
          onClick={disconnectSolanaWallet}
          variant="destructive"
          size="sm"
          className="w-full text-xs h-[36px] font-medium"
        >
          SOL: {solanaWallet.slice(0, 4)}...{solanaWallet.slice(-4)}
        </Button>
      ) : (
        <Button
          onClick={connectSolanaWallet}
          size="sm"
          className="w-full text-xs h-[36px] bg-purple-600 hover:bg-purple-700 text-white font-medium"
        >
          <Link size={14} className="mr-1" /> Connect Solana
        </Button>
      )}
    </div>
  );
};

export default SolanaWalletConnector;
