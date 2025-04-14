
import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { 
  injected, 
  walletConnect,
  safe
} from 'wagmi/connectors';
import { TonConnectButton } from '@tonconnect/ui-react';
import ListeningTimeTracker from './ListeningTimeTracker';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Shield, Wallet, Link } from 'lucide-react';
import { Button } from "@/components/ui/button";
import * as web3 from '@solana/web3.js';
import { Card } from "@/components/ui/card";

interface WalletConnectionProps {
  isPlaying: boolean;
}

// IDRX token addresses on different networks
const IDRX_TOKENS = {
  base: "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
  solana: "idrxTdNftk6tYedPv2M7tCFHBVCpk5rkiNRd8yUArhr"
};

const WalletConnection = ({ isPlaying }: WalletConnectionProps) => {
  const { connect, connectors, error, isPending } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [showConnectors, setShowConnectors] = useState(false);
  const [solanaWallet, setSolanaWallet] = useState<string | null>(null);
  const [idrxBalances, setIdrxBalances] = useState({
    base: "0",
    solana: "0"
  });

  // Mock function to fetch IDRX balance on Base
  const fetchBaseIdrxBalance = async (ethAddress: string) => {
    try {
      // In a real implementation, you would use ethers or viem to query the contract
      // For now we'll mock the balance with a random number
      const randomBalance = (Math.random() * 1000).toFixed(2);
      return randomBalance;
    } catch (error) {
      console.error('Error fetching Base IDRX balance:', error);
      return "0";
    }
  };

  // Mock function to fetch IDRX balance on Solana
  const fetchSolanaIdrxBalance = async (solAddress: string) => {
    try {
      // In a real implementation, you would use @solana/spl-token to query the token account
      // For now we'll mock the balance with a random number
      const randomBalance = (Math.random() * 1000).toFixed(2);
      return randomBalance;
    } catch (error) {
      console.error('Error fetching Solana IDRX balance:', error);
      return "0";
    }
  };

  // Update balances when wallet addresses change
  useEffect(() => {
    const updateBalances = async () => {
      if (address) {
        const baseBalance = await fetchBaseIdrxBalance(address);
        setIdrxBalances(prev => ({ ...prev, base: baseBalance }));
      }
      
      if (solanaWallet) {
        const solanaBalance = await fetchSolanaIdrxBalance(solanaWallet);
        setIdrxBalances(prev => ({ ...prev, solana: solanaBalance }));
      }
    };
    
    updateBalances();
    
    // Set up polling to update balances every 30 seconds
    const interval = setInterval(updateBalances, 30000);
    return () => clearInterval(interval);
  }, [address, solanaWallet]);

  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowConnectors(false);
    toast({
      title: "Connecting wallet",
      description: "Please approve the connection request in your wallet",
    });
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
      variant: "destructive",
    });
  };

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
    <div className="border-t border-[#444] p-4 space-y-4">
      {/* Ethereum Wallet */}
      {address ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-mono">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333]">
              {mainnet.name}
            </Badge>
          </div>
          
          <ListeningTimeTracker isPlaying={isPlaying} />
          
          <button
            onClick={handleDisconnect}
            className="w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            disabled={isPending}
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setShowConnectors(!showConnectors)}
            className="w-full px-3 py-1 bg-[#444] text-white text-xs rounded hover:bg-[#555] transition-colors"
            disabled={isPending}
          >
            {isPending ? 'Connecting...' : 'Connect ETH Wallet'}
          </button>
          
          {showConnectors && (
            <div className="mt-2 bg-[#222] rounded border border-[#444] p-2 space-y-2">
              <button
                onClick={() => handleConnect(injected())}
                className="w-full px-3 py-2 bg-[#333] text-white text-xs rounded hover:bg-[#444] transition-colors flex items-center justify-center gap-2"
              >
                <Wallet size={16} />
                <span>Metamask / Browser Wallet</span>
              </button>
              
              <button
                onClick={() => handleConnect(walletConnect({
                  projectId: 'c8b9a9d2a8ca3ff2b6db8a1681b1a9b5', 
                  showQrModal: true,
                  metadata: {
                    name: 'Web3 Radio',
                    description: 'Web3 Radio - Listen to crypto podcasts',
                    url: window.location.origin,
                    icons: [window.location.origin + '/web3radio-logo.png']
                  }
                }))}
                className="w-full px-3 py-2 bg-[#333] text-white text-xs rounded hover:bg-[#444] transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone size={16} />
                <span>WalletConnect (Mobile)</span>
              </button>

              <button
                onClick={() => handleConnect(safe())}
                className="w-full px-3 py-2 bg-[#333] text-white text-xs rounded hover:bg-[#444] transition-colors flex items-center justify-center gap-2"
              >
                <Shield size={16} />
                <span>Smart Account (Safe)</span>
              </button>
            </div>
          )}
          
          {error && (
            <p className="text-red-500 text-xs mt-2">
              {error.message}
            </p>
          )}
        </div>
      )}

      {/* Wallet Connect Buttons Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* TON Wallet */}
        <div className="min-w-0">
          <TonConnectButton />
        </div>

        {/* Solana Wallet */}
        <div className="min-w-0">
          {solanaWallet ? (
            <Button
              onClick={disconnectSolanaWallet}
              variant="destructive"
              size="sm"
              className="w-full text-xs"
            >
              SOL: {solanaWallet.slice(0, 4)}...{solanaWallet.slice(-4)}
            </Button>
          ) : (
            <Button
              onClick={connectSolanaWallet}
              size="sm"
              className="w-full text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Link size={14} className="mr-1" /> Connect Solana
            </Button>
          )}
        </div>
      </div>

      {/* IDRX Token Balances */}
      {(address || solanaWallet) && (
        <Card className="p-3 bg-[#222] border-[#444]">
          <h3 className="text-sm font-bold text-center mb-2 text-white">IDRX Balances</h3>
          
          <div className="space-y-2">
            {address && (
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300">Base:</span>
                </div>
                <span className="font-mono text-[#00ff00]">{idrxBalances.base} IDRX</span>
              </div>
            )}
            
            {solanaWallet && (
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-300">Solana:</span>
                </div>
                <span className="font-mono text-[#00ff00]">{idrxBalances.solana} IDRX</span>
              </div>
            )}
          </div>
          
          <div className="mt-2 pt-2 border-t border-[#444] text-center">
            <a 
              href="#" 
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://explorer.base.org/token/0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22', '_blank');
              }}
            >
              <Link size={12} />
              <span>View on Explorer</span>
            </a>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WalletConnection;
