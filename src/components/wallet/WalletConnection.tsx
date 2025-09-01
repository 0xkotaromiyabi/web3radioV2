import React, { useMemo } from 'react';
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import EnhancedListeningTimeTracker from './EnhancedListeningTimeTracker';
import AIChat from './AIChat';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarcasterConnectMenu from './FarcasterConnectMenu';

import "@solana/wallet-adapter-react-ui/styles.css";

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

function EthereumWalletConnection() {
  const account = useActiveAccount();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-bold text-white mb-2">Connect Ethereum Wallet</h3>
        <p className="text-xs text-gray-400 mb-4">
          Connect your Ethereum wallet to access Web3 Radio features
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

      {account?.address && (
        <div className="p-3 bg-[#111] rounded-lg border border-[#333]">
          <p className="text-xs text-gray-400 mb-1">Connected Address:</p>
          <p className="text-xs text-white font-mono break-all">{account.address}</p>
        </div>
      )}
    </div>
  );
}

function SolanaWalletConnection() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-bold text-white mb-2">Connect Solana Wallet</h3>
        <p className="text-xs text-gray-400 mb-4">
          Connect your Solana wallet to access Web3 Radio features
        </p>
      </div>
      
      <div className="flex justify-center">
        <WalletMultiButton />
      </div>

      {connected && publicKey && (
        <div className="p-3 bg-[#111] rounded-lg border border-[#333]">
          <p className="text-xs text-gray-400 mb-1">Connected Address:</p>
          <p className="text-xs text-white font-mono break-all">{publicKey.toString()}</p>
        </div>
      )}
    </div>
  );
}

const WalletConnection = ({ isPlaying }: WalletConnectionProps) => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const solanaWallets = useMemo(() => [], []);

  return (
    <div className="border-t border-[#444] p-4 space-y-4">
      {/* Wallet Connect with Tabs */}
      <Card className="p-4 bg-[#222] border-[#444]">
        <Tabs defaultValue="ethereum" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#333] border-[#444]">
            <TabsTrigger value="ethereum" className="text-white data-[state=active]:bg-[#444]">
              Ethereum
            </TabsTrigger>
            <TabsTrigger value="solana" className="text-white data-[state=active]:bg-[#444]">
              Solana
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ethereum" className="mt-4">
            <EthereumWalletConnection />
          </TabsContent>
          
          <TabsContent value="solana" className="mt-4">
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={solanaWallets}>
                <WalletModalProvider>
                  <SolanaWalletConnection />
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Farcaster Wallet Connection */}
      <FarcasterConnectMenu />

      {/* Enhanced Listening Time Tracker */}
      <EnhancedListeningTimeTracker isPlaying={isPlaying} />

      {/* AI Chat Interface */}
      <AIChat client={client} />

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
