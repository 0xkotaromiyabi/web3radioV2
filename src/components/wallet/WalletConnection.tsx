
import React, { useState } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Shield, Wallet } from 'lucide-react';

interface WalletConnectionProps {
  isPlaying: boolean;
}

const WalletConnection = ({ isPlaying }: WalletConnectionProps) => {
  const { connect, connectors, error, isPending } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [showConnectors, setShowConnectors] = useState(false);

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

      {/* TON Wallet */}
      <div className="mt-2">
        <TonConnectButton />
      </div>
    </div>
  );
};

export default WalletConnection;
