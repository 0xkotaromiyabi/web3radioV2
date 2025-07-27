import React, { useState } from 'react';
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import EnhancedListeningTimeTracker from './EnhancedListeningTimeTracker';
import W3RRewardClaim from './W3RRewardClaim';
import NFTCollection from './NFTCollection';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Coins } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const claimFaucet = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://zxyoidfksqmccwvdduxk.supabase.co/functions/v1/claim-faucet", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eW9pZGZrc3FtY2N3dmRkdXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTMwNDEsImV4cCI6MjA2NTQ4OTA0MX0.sjAUWjkuJAp-RVskCTa9BwanW6PSKj94fMmFCv3lghM`,
        },
        body: JSON.stringify({ address }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast({
          title: "Success!",
          description: "Successfully claimed 2 W3R tokens!",
        });
      } else {
        toast({
          title: "Claim Failed",
          description: data.error || "Failed to claim tokens",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "An error occurred while claiming tokens",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="border-t border-[#444] p-4 space-y-4">
      {/* Wallet Connect & Faucet */}
      <Card className="p-4 bg-[#222] border-[#444]">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-bold text-white mb-2">W3R Token Faucet</h3>
            <p className="text-xs text-gray-400 mb-4">
              Connect wallet and claim 2 W3R tokens once per minute
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

          {address && (
            <Button
              onClick={claimFaucet}
              disabled={loading}
              className="w-full"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming Tokens...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Claim 2 W3R Tokens
                </>
              )}
            </Button>
          )}
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
