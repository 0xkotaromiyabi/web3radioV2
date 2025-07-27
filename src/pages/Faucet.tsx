import React, { useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Wallet } from "lucide-react";
import NavBar from "@/components/navigation/NavBar";
import WalletConnectButton from "@/components/marketplace/WalletConnectButton";

export default function Faucet() {
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
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Coins className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                W3R Token Faucet
              </h1>
            </div>
            <p className="text-muted-foreground">
              Get free W3R tokens to start using Web3Radio
            </p>
          </div>

          {/* Faucet Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Free Token Claim</span>
              </CardTitle>
              <CardDescription>
                Claim 2 W3R tokens once per minute
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Wallet Connection Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wallet Status:</span>
                  <Badge variant={address ? "default" : "secondary"}>
                    {address ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                
                {address && (
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono truncate">
                      {address}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="space-y-3">
                {address ? (
                  <Button
                    onClick={claimFaucet}
                    disabled={loading}
                    className="w-full"
                    size="lg"
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
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-center text-muted-foreground">
                      Connect your wallet to claim tokens
                    </p>
                    <WalletConnectButton />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm">Faucet Rules:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Maximum 2 tokens per claim</li>
                  <li>• 1 minute cooldown between claims</li>
                  <li>• Tokens are distributed on Base network</li>
                  <li>• Use tokens for Web3Radio features</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About W3R Tokens</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                W3R tokens are the utility tokens for Web3Radio platform. 
                Use them to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Purchase exclusive NFTs in the marketplace</li>
                <li>Access premium radio features</li>
                <li>Participate in governance voting</li>
                <li>Earn rewards for listening time</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}