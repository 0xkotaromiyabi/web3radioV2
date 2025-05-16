
import React from 'react';
import { useConnect } from 'wagmi';
import { 
  injected, 
  walletConnect,
  safe
} from 'wagmi/connectors';
import { useToast } from "@/hooks/use-toast";
import { Wallet, Smartphone, Shield } from 'lucide-react';
import SmartAccountConnector from './SmartAccountConnector';

interface EthereumWalletConnectorProps {
  showConnectors: boolean;
  setShowConnectors: React.Dispatch<React.SetStateAction<boolean>>;
  onSmartAccountConnected: (accountAddress: string) => void;
}

const EthereumWalletConnector = ({ 
  showConnectors, 
  setShowConnectors, 
  onSmartAccountConnected 
}: EthereumWalletConnectorProps) => {
  const { connect, error, isPending } = useConnect();
  const { toast } = useToast();

  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowConnectors(false);
    toast({
      title: "Connecting wallet",
      description: "Please approve the connection request in your wallet",
    });
  };

  return (
    <div>
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        className="w-full px-3 py-2 bg-[#1a65cf] text-white text-xs rounded hover:bg-[#1254b3] transition-colors font-medium h-[36px] flex items-center justify-center"
        disabled={isPending}
      >
        <Wallet size={14} className="mr-1" />
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
          
          {/* Add our Smart Account Connector */}
          <SmartAccountConnector onConnected={onSmartAccountConnected} />
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-xs mt-2">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default EthereumWalletConnector;
