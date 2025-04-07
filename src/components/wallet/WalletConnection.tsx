
import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { TonConnectButton } from '@tonconnect/ui-react';
import ListeningTimeTracker from './ListeningTimeTracker';

interface WalletConnectionProps {
  isPlaying: boolean;
}

const WalletConnection = ({ isPlaying }: WalletConnectionProps) => {
  const { connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="border-t border-[#444] p-4 space-y-4">
      {/* Ethereum Wallet */}
      {address ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-mono">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <ListeningTimeTracker isPlaying={isPlaying} />
          <button
            onClick={() => disconnect()}
            className="w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: injected() })}
          className="w-full px-3 py-1 bg-[#444] text-white text-xs rounded hover:bg-[#555] transition-colors"
        >
          Connect ETH Wallet
        </button>
      )}

      {/* TON Wallet */}
      <div className="mt-2">
        <TonConnectButton />
      </div>
    </div>
  );
};

export default WalletConnection;
