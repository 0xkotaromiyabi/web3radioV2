
import React, { useState, useEffect } from 'react';
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import ListeningTimeTracker from './ListeningTimeTracker';
import NFTCollection from './NFTCollection';
import WebhookConfig from '../webhook/WebhookConfig';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { webhookDispatcher } from '@/utils/webhookEvents';

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
  const { toast } = useToast();
  const account = useActiveAccount();
  const [hasTriggeredConnection, setHasTriggeredConnection] = useState(false);

  // Trigger webhook when wallet connects
  useEffect(() => {
    if (account?.address && !hasTriggeredConnection) {
      console.log('Wallet connected, triggering webhook:', account.address);
      webhookDispatcher.triggerWalletConnected(account.address);
      setHasTriggeredConnection(true);
      
      toast({
        title: "Wallet Connected",
        description: `Webhook event sent for address: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
      });
    } else if (!account?.address) {
      setHasTriggeredConnection(false);
    }
  }, [account?.address, hasTriggeredConnection, toast]);

  return (
    <div className="border-t border-[#444] p-4 space-y-4">
      {/* Thirdweb Connect Button */}
      <div className="flex justify-center">
        <ConnectButton
          client={client}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          theme="dark"
        />
      </div>

      {/* Webhook Configuration */}
      <WebhookConfig />

      {/* Listening Time Tracker */}
      <ListeningTimeTracker isPlaying={isPlaying} />

      {/* NFT Collection Display */}
      <NFTCollection client={client} />

      {/* Info Card */}
      <Card className="p-3 bg-[#222] border-[#444]">
        <div className="text-center">
          <h3 className="text-sm font-bold text-white mb-2">Web3 Radio Wallet</h3>
          <p className="text-xs text-gray-400">
            Connect your wallet to track listening time and trigger webhook events
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WalletConnection;
