import React from 'react';
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import EnhancedListeningTimeTracker from './EnhancedListeningTimeTracker';
import W3RRewardClaim from './W3RRewardClaim';
import NFTCollection from './NFTCollection';
import { Card } from "@/components/ui/card";
import FarcasterConnectMenu from './FarcasterConnectMenu';

interface WalletConnectionProps {
  isPlaying: boolean;
}

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const WalletConnection = ({ isPlaying }: WalletConnectionProps) => {
  const account = useActiveAccount();
  const address = account?.address;

  return (
    <div className="border-t border-[#444] p-4 space-y-4">
      {/* Wallet Connect */}
      <Card className="p-4 bg-[#222] border-[#444]">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-bold text-white mb-2">Connect Wallet</h3>
            <p className="text-xs text-gray-400 mb-4">
              Connect your wallet to access Web3 Radio features
            </p>
          </div>
          
          <div className="flex justify-center">
            <ConnectButton
              client={client}
              wallets={wallets}
              connectModal={{ size: "compact" }}
              theme="dark"
            />
          </div>
        </div>
      </Card>

      {/* Farcaster Wallet Connection */}
      <FarcasterConnectMenu />

      {/* Enhanced Listening Time Tracker with W3R Integration */}
      <EnhancedListeningTimeTracker isPlaying={isPlaying} />

      {/* W3R Reward Claim Component */}
      <W3RRewardClaim />

      {/* NFT Collection Display */}
      <NFTCollection client={client} />

      {/* Info Card */}
      <Card className="p-3 bg-[#222] border-[#444]">
        <div className="text-center">
          <h3 className="text-sm font-bold text-white mb-2">Web3 Radio Wallet</h3>
          <p className="text-xs text-gray-400">
            Connect your wallet to earn W3R tokens and access premium features
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WalletConnection;
