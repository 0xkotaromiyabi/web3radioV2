import React, { useState, useEffect, useMemo } from "react";
import {
  ThirdwebProvider,
  ConnectButton,
  useActiveAccount,
} from "thirdweb/react";
import { mainnet } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/navigation/NavBar";

import "@solana/wallet-adapter-react-ui/styles.css";

const thirdwebClient = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const REGISTERED_WALLETS = {
  "kotarominami.eth": "ngapain ikut lomba?",
  "0xdigiweave.eth": "eh lu kan di blacklist dari lomba",
  "0xe4b19fcbb0c8ace2098bacc7a495c6c524ace29e": "Selamat yah... kamu Juara 1 - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0xe11a28587ea6f9cbef23f4d241760c628f17a533": "Selamat yah... kamu Juara 2 - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0x97784f68681969213c5f086821a615fb3ccc2251": "Selamat yah... kamu Juara 3 - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0x44093cacd048b9e0f7ed5227fda8d77c27d05b18": "Selamat yah... kamu Juara 4 - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0x0e86f8ca9974e321a56c4033178e02e2051f8248": "Selamat yah... kamu Juara 5 - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0x03cf1a2dbeaf53077c6bb1fd28b52b41ef730a25": "Selamat yah... kamu Juara harapan, ga tau harapan apa - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0x2320f3c72d1fac30defec17e65e622b516bf251e": "Selamat yah... kamu Juara harapan, ga tau harapan apa - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0x4636fab7dbf13a5071e519a6e7c021d4b89ffff4": "Selamat yah... kamu Juara harapan, ga tau harapan apa - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
  "0x925c001c23ae3fbdc37ea2775c92abb37b48f529": "Selamat yah... kamu Juara harapan, ga tau harapan apa - Tunggu informasi selanjutnya untuk distribusi hadiahnya",
};

function EthereumVerification() {
  const account = useActiveAccount();
  const [notif, setNotif] = useState("");
  const [ensName, setEnsName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkWallet() {
      if (account?.address) {
        setIsLoading(true);
        try {
          // Check if wallet address is directly registered
          const walletAddress = account.address.toLowerCase();
          if (REGISTERED_WALLETS[walletAddress]) {
            setNotif(REGISTERED_WALLETS[walletAddress]);
            setEnsName("");
            setIsLoading(false);
            return;
          }

          // Check ENS if wallet address not found
          const response = await fetch(`https://api.ensideas.com/ens/resolve/${account.address}`);
          if (response.ok) {
            const data = await response.json();
            const ens = data.name;
            
            if (ens && ens.endsWith('.eth')) {
              setEnsName(ens);
              if (REGISTERED_WALLETS[ens]) {
                setNotif(REGISTERED_WALLETS[ens]);
              } else {
                setNotif("anda belum beruntung, coba di event selanjutnya");
              }
            } else {
              setEnsName("");
              setNotif("anda belum beruntung, coba di event selanjutnya");
            }
          } else {
            setEnsName("");
            setNotif("anda belum beruntung, coba di event selanjutnya");
          }
        } catch (error) {
          console.error("Error checking wallet:", error);
          setEnsName("");
          setNotif("anda belum beruntung, coba di event selanjutnya");
        } finally {
          setIsLoading(false);
        }
      } else {
        setEnsName("");
        setNotif("");
      }
    }
    checkWallet();
  }, [account?.address]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <ConnectButton 
          client={thirdwebClient} 
          chain={mainnet}
          theme="dark"
        />
      </div>

      {account?.address && (
        <div className="space-y-4">
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Ethereum Wallet Connected</h3>
            <p className="text-sm text-muted-foreground font-mono break-all">
              {account.address}
            </p>
          </div>

          {isLoading && (
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Checking ENS domain...
            </div>
          )}

          {ensName && !isLoading && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">ENS Domain Found</h3>
              <p className="text-primary font-mono">{ensName}</p>
            </div>
          )}

          {notif && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {notif}
              </AlertDescription>
            </Alert>
          )}

          {account.address && !notif && !isLoading && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Wallet terverifikasi! {ensName ? `Welcome, ${ensName}` : "No ENS domain found, but wallet is connected successfully."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {!account?.address && (
        <div className="text-center text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Connect your Ethereum wallet to start verification process</p>
        </div>
      )}
    </div>
  );
}

function SolanaVerification() {
  const { publicKey, connected } = useWallet();
  const [notif, setNotif] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkSolanaWallet() {
      if (publicKey && connected) {
        setIsLoading(true);
        try {
          const walletAddress = publicKey.toString().toLowerCase();
          
          // Check if Solana wallet address is registered
          if (REGISTERED_WALLETS[walletAddress]) {
            setNotif(REGISTERED_WALLETS[walletAddress]);
          } else {
            setNotif("anda belum beruntung, coba di event selanjutnya");
          }
        } catch (error) {
          console.error("Error checking Solana wallet:", error);
          setNotif("anda belum beruntung, coba di event selanjutnya");
        } finally {
          setIsLoading(false);
        }
      } else {
        setNotif("");
      }
    }
    checkSolanaWallet();
  }, [publicKey, connected]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <WalletMultiButton />
      </div>

      {connected && publicKey && (
        <div className="space-y-4">
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Solana Wallet Connected</h3>
            <p className="text-sm text-muted-foreground font-mono break-all">
              {publicKey.toString()}
            </p>
          </div>

          {isLoading && (
            <div className="text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Checking wallet registration...
            </div>
          )}

          {notif && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {notif}
              </AlertDescription>
            </Alert>
          )}

          {connected && !notif && !isLoading && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Solana wallet terverifikasi!
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {!connected && (
        <div className="text-center text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Connect your Solana wallet to start verification process</p>
        </div>
      )}
    </div>
  );
}

function VerificationPlayground() {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            17an Onchain
          </h1>
          <p className="text-muted-foreground text-lg">
            Verification system untuk memastikan identitas onchain Anda
          </p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Wallet Verification
            </CardTitle>
            <CardDescription>
              Connect your wallet to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="ethereum" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                <TabsTrigger value="solana">Solana</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ethereum" className="mt-6">
                <EthereumVerification />
              </TabsContent>
              
              <TabsContent value="solana" className="mt-6">
                <ConnectionProvider endpoint={endpoint}>
                  <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                      <SolanaVerification />
                    </WalletModalProvider>
                  </WalletProvider>
                </ConnectionProvider>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Sistem verifikasi onchain untuk memastikan keaslian identitas digital Anda</p>
        </div>
      </div>
    </div>
  );
}

export default function VerificationOnchain() {
  return (
    <ThirdwebProvider>
      <VerificationPlayground />
    </ThirdwebProvider>
  );
}
