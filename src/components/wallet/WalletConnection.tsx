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
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Connect Ethereum Wallet</h3>
        <p className="text-xs text-gray-500 mb-4">
          Access Web3 Radio features via ETH
        </p>
      </div>

      <div className="flex justify-center">
        <ConnectButton
          client={client}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          theme="light"
        />
      </div>

      {account?.address && (
        <div className="p-3 bg-white/50 rounded-xl border border-gray-200/50 shadow-inner">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Connected Address</p>
          <p className="text-xs text-gray-900 font-mono break-all">{account.address}</p>
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
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Connect Solana Wallet</h3>
        <p className="text-xs text-gray-500 mb-4">
          Access Web3 Radio features via SOL
        </p>
      </div>

      <div className="flex justify-center solana-custom-btn">
        <WalletMultiButton style={{ backgroundColor: '#2563eb', borderRadius: '12px', height: '40px', fontSize: '14px' }} />
      </div>

      {connected && publicKey && (
        <div className="p-3 bg-white/50 rounded-xl border border-gray-200/50 shadow-inner">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Connected Address</p>
          <p className="text-xs text-gray-900 font-mono break-all">{publicKey.toString()}</p>
        </div>
      )}
    </div>
  );
}

const WalletConnection = ({ isPlaying }: WalletConnectionProps) => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const solanaWallets = useMemo(() => [], []);

  return (
    <div className="px-6 py-4 space-y-4">
      {/* Wallet Connect with Tabs - Apple Segmented Control Style */}
      <div className="bg-gray-100/50 p-1 rounded-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
          <Tabs defaultValue="ethereum" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
              <TabsTrigger
                value="ethereum"
                className="rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500 hover:text-gray-700"
              >
                Ethereum
              </TabsTrigger>
              <TabsTrigger
                value="solana"
                className="rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500 hover:text-gray-700"
              >
                Solana
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ethereum" className="mt-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <EthereumWalletConnection />
            </TabsContent>

            <TabsContent value="solana" className="mt-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={solanaWallets}>
                  <WalletModalProvider>
                    <SolanaWalletConnection />
                  </WalletModalProvider>
                </WalletProvider>
              </ConnectionProvider>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Farcaster Wallet Connection */}
      <FarcasterConnectMenu />

      {/* Enhanced Listening Time Tracker */}
      <EnhancedListeningTimeTracker isPlaying={isPlaying} />

      {/* Info Card */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 shadow-sm">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Web3 Radio Wallet</h3>
          <p className="text-xs text-blue-700/80">
            Connect your wallet to earn W3R tokens and access premium features
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
