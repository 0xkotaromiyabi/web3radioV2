
import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { 
  injected, 
  walletConnect,
  safe
} from 'wagmi/connectors';
import { TonConnectButton } from '@tonconnect/ui-react';
import ListeningTimeTracker from './ListeningTimeTracker';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Link, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { Card } from "@/components/ui/card";
import TransferDialog from './TransferDialog';
import SmartAccountConnector from './SmartAccountConnector';
import EthereumWalletConnector from './EthereumWalletConnector';
import SolanaWalletConnector from './SolanaWalletConnector';
import TokenBalances from './TokenBalances';

// Constants moved to separate files
import { IDRX_TOKENS, SOLANA_RPC } from './constants/TokenConstants';

interface WalletConnectionProps {
  isPlaying: boolean;
}

const WalletConnection = ({ isPlaying }: WalletConnectionProps) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [showConnectors, setShowConnectors] = useState(false);
  const [solanaWallet, setSolanaWallet] = useState<string | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [idrxBalances, setIdrxBalances] = useState({
    base: "0",
    solana: "0"
  });
  const [loadingBalances, setLoadingBalances] = useState({
    base: false,
    solana: false
  });
  const [transferDialogState, setTransferDialogState] = useState<{
    isOpen: boolean;
    network: 'base' | 'solana';
  }>({
    isOpen: false,
    network: 'base'
  });

  // Use the extracted hooks for balance fetching
  const { fetchBaseIdrxBalance, fetchSolanaIdrxBalance } = useTokenBalances({
    setLoadingBalances,
    toast
  });
  
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
    
    // Set up polling to update balances every 60 seconds
    const interval = setInterval(updateBalances, 60000);
    return () => clearInterval(interval);
  }, [address, solanaWallet, fetchBaseIdrxBalance, fetchSolanaIdrxBalance]);

  const handleDisconnect = () => {
    disconnect();
    setIdrxBalances(prev => ({ ...prev, base: "0" }));
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
      variant: "destructive",
    });
  };

  const disconnectSolanaWallet = () => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.disconnect();
      setSolanaWallet(null);
      setIdrxBalances(prev => ({ ...prev, solana: "0" }));
      toast({
        title: "Solana wallet disconnected",
        description: "Your Solana wallet has been disconnected",
        variant: "destructive",
      });
    }
  };

  const refreshBalances = async () => {
    toast({
      title: "Refreshing balances",
      description: "Fetching your latest IDRX token balances",
      duration: 1500,
    });
    
    if (address) {
      const baseBalance = await fetchBaseIdrxBalance(address);
      setIdrxBalances(prev => ({ ...prev, base: baseBalance }));
    }
    
    if (solanaWallet) {
      const solanaBalance = await fetchSolanaIdrxBalance(solanaWallet);
      setIdrxBalances(prev => ({ ...prev, solana: solanaBalance }));
    }
  };

  const openTransferDialog = (network: 'base' | 'solana') => {
    setTransferDialogState({
      isOpen: true,
      network
    });
  };

  const closeTransferDialog = () => {
    setTransferDialogState({
      ...transferDialogState,
      isOpen: false
    });
  };

  const handleBaseTransfer = async (recipient: string, amount: string) => {
    try {
      console.log(`Initiating Base IDRX transfer: ${amount} to ${recipient}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would use ethers or viem to send the token transfer
      // This is a mock implementation for demonstration
      
      // Update balance after transfer (simplified)
      const newBalance = (parseFloat(idrxBalances.base) - parseFloat(amount)).toFixed(2);
      setIdrxBalances(prev => ({ ...prev, base: newBalance }));
      
      console.log(`Base IDRX transfer completed: ${amount} to ${recipient}`);
    } catch (error) {
      console.error('Error during Base IDRX transfer:', error);
      throw new Error('Failed to transfer IDRX tokens');
    }
  };

  const handleSolanaTransfer = async (recipient: string, amount: string) => {
    try {
      console.log(`Initiating Solana IDRX transfer: ${amount} to ${recipient}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would use @solana/spl-token to send the token transfer
      // This is a mock implementation for demonstration
      
      // Update balance after transfer (simplified)
      const newBalance = (parseFloat(idrxBalances.solana) - parseFloat(amount)).toFixed(2);
      setIdrxBalances(prev => ({ ...prev, solana: newBalance }));
      
      console.log(`Solana IDRX transfer completed: ${amount} to ${recipient}`);
    } catch (error) {
      console.error('Error during Solana IDRX transfer:', error);
      throw new Error('Failed to transfer IDRX tokens');
    }
  };

  const handleTransfer = async (recipient: string, amount: string) => {
    if (transferDialogState.network === 'base') {
      return handleBaseTransfer(recipient, amount);
    } else {
      return handleSolanaTransfer(recipient, amount);
    }
  };

  // Handle smart account connection
  const handleSmartAccountConnected = (accountAddress: string) => {
    setSmartAccountAddress(accountAddress);
    setShowConnectors(false);
  };

  return (
    <div className="border-t border-[#444] p-4 space-y-4">
      {/* Ethereum Wallet */}
      {address || smartAccountAddress ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-mono">
              Connected: {(smartAccountAddress || address)?.slice(0, 6)}...{(smartAccountAddress || address)?.slice(-4)}
            </p>
            <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333]">
              {smartAccountAddress ? "Polygon Mumbai" : mainnet.name}
            </Badge>
          </div>
          
          <ListeningTimeTracker isPlaying={isPlaying} />
          
          <button
            onClick={handleDisconnect}
            className="w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <EthereumWalletConnector 
          showConnectors={showConnectors} 
          setShowConnectors={setShowConnectors} 
          onSmartAccountConnected={handleSmartAccountConnected} 
        />
      )}

      {/* Wallet Connect Buttons Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* TON Wallet - Custom styling wrapper */}
        <div className="min-w-0">
          <button 
            className="w-full text-xs h-[36px] bg-[#6a57d5] hover:bg-[#5946c4] text-white font-medium rounded flex items-center justify-center" 
            onClick={() => {
              // This is a wrapper button that will be positioned over the TonConnectButton
              // The actual TonConnectButton will be triggered via click events
              const tonButton = document.querySelector('.tc-button');
              if (tonButton) {
                (tonButton as HTMLElement).click();
              }
            }}
          >
            <Link size={14} className="mr-1" /> Connect TON
          </button>
          
          {/* Hidden TonConnectButton that will be triggered by our custom button */}
          <div className="hidden">
            <TonConnectButton />
          </div>
        </div>

        {/* Solana Wallet */}
        <SolanaWalletConnector 
          solanaWallet={solanaWallet} 
          setSolanaWallet={setSolanaWallet} 
        />
      </div>

      {/* IDRX Token Balances */}
      {(address || solanaWallet || smartAccountAddress) && (
        <TokenBalances 
          address={address}
          solanaWallet={solanaWallet}
          idrxBalances={idrxBalances}
          loadingBalances={loadingBalances}
          refreshBalances={refreshBalances}
          openTransferDialog={openTransferDialog}
        />
      )}
      
      {/* Transfer Dialog */}
      <TransferDialog 
        isOpen={transferDialogState.isOpen}
        onClose={closeTransferDialog}
        network={transferDialogState.network}
        balance={idrxBalances[transferDialogState.network]}
        onTransfer={handleTransfer}
      />
    </div>
  );
};

export default WalletConnection;
