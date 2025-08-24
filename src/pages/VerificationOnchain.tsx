import React, { useState, useEffect } from "react";
import {
  ThirdwebProvider,
  ConnectButton,
  useActiveAccount,
} from "thirdweb/react";
import { mainnet } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import NavBar from "@/components/navigation/NavBar";

const thirdwebClient = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const ENS_MESSAGES = {
  "kotarominami.eth": "ngapain ikut lomba?",
  "digiweave.eth": "eh lu kan di blacklist dari lomba",
};

function VerificationPlayground() {
  const account = useActiveAccount();
  const [notif, setNotif] = useState("");
  const [ensName, setEnsName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkENS() {
      if (account?.address) {
        setIsLoading(true);
        try {
          // Use reverse ENS lookup via public API as fallback
          const response = await fetch(`https://api.ensideas.com/ens/resolve/${account.address}`);
          if (response.ok) {
            const data = await response.json();
            const ens = data.name;
            
            if (ens && ens.endsWith('.eth')) {
              setEnsName(ens);
              if (ENS_MESSAGES[ens]) {
                setNotif(ENS_MESSAGES[ens]);
              } else {
                setNotif("");
              }
            } else {
              setEnsName("");
              setNotif("");
            }
          } else {
            setEnsName("");
            setNotif("");
          }
        } catch (error) {
          console.error("Error fetching ENS:", error);
          setEnsName("");
          setNotif("");
        } finally {
          setIsLoading(false);
        }
      } else {
        setEnsName("");
        setNotif("");
      }
    }
    checkENS();
  }, [account?.address]);

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
              Connect your wallet to verify your identity and ENS domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  <h3 className="font-semibold text-foreground mb-2">Wallet Connected</h3>
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
                <p>Connect your wallet to start verification process</p>
              </div>
            )}
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