
import Radio from '@/components/Radio';
import NavBar from '@/components/navigation/NavBar';
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useCallback, useState } from 'react';
import { useMiniKitContext } from '@/hooks/useMiniKitContext';
import Particles from 'react-particles';
import type { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Wallet } from "lucide-react";
import WalletConnectButton from "@/components/marketplace/WalletConnectButton";

const FaucetComponent = () => {
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
    <Card className="border-2 border-primary/20 mb-6">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Coins className="h-5 w-5" />
          <span>W3R Token Faucet</span>
        </CardTitle>
        <CardDescription>
          Claim 2 W3R tokens once per minute
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Wallet Status:</span>
          <Badge variant={address ? "default" : "secondary"}>
            {address ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        
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
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const { isFrameReady, user, client, location } = useMiniKitContext();
  
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded:', container);
  }, []);

  return (
    <ThirdwebProvider>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 60,
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: {
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.3,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 3 },
                },
              },
              detectRetina: true,
            }}
            className="absolute inset-0"
          />
          <div className="relative z-10 flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto space-y-6">
                <FaucetComponent />
                <Radio />
              </div>
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </ThirdwebProvider>
  );
};

export default Index;
