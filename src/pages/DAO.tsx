
import React, { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vote, Wallet, Donate, Ethereum, ArrowUp, ArrowDown } from 'lucide-react';
import { useCallback } from 'react';
import Particles from 'react-particles';
import type { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Mock proposals data
const proposalsMock = [
  {
    id: 1,
    title: 'Add new radio station genres',
    description: 'Add hip-hop, classical, and jazz genres to our station lineup',
    votesFor: 342,
    votesAgainst: 103,
    status: 'active',
  },
  {
    id: 2,
    title: 'Integrate with Lens Protocol',
    description: 'Integrate Web3Radio with Lens Protocol for enhanced social features',
    votesFor: 523,
    votesAgainst: 48,
    status: 'active',
  },
  {
    id: 3,
    title: 'Launch Web3Radio token',
    description: 'Launch a governance token for the Web3Radio DAO with initial distribution to active users',
    votesFor: 621,
    votesAgainst: 217,
    status: 'active',
  }
];

const DAO = () => {
  const { toast } = useToast();
  const [proposals, setProposals] = useState(proposalsMock);

  const handleDonate = (network: string) => {
    // In a real application, this would trigger a web3 wallet connection
    const walletAddress = "0x53dfe235484465b723D81E56988263b50BafEA33";
    
    // Copy wallet address to clipboard
    navigator.clipboard.writeText(walletAddress).then(
      () => {
        toast({
          title: `${network} wallet address copied to clipboard`,
          description: "0x53dfe235484465b723D81E56988263b50BafEA33",
        });
      },
      () => {
        toast({
          title: "Failed to copy wallet address",
          description: "Please try again",
          variant: "destructive",
        });
      }
    );
  };

  const handleVote = (proposalId: number, support: boolean) => {
    // In a real application, this would interact with a blockchain 
    setProposals(proposals.map(proposal => {
      if (proposal.id === proposalId) {
        if (support) {
          return { ...proposal, votesFor: proposal.votesFor + 1 };
        } else {
          return { ...proposal, votesAgainst: proposal.votesAgainst + 1 };
        }
      }
      return proposal;
    }));
    
    toast({
      title: `Vote cast successfully!`,
      description: `You voted ${support ? 'FOR' : 'AGAINST'} proposal #${proposalId}`,
    });
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded:', container);
  }, []);

  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
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
          <div className="relative z-10">
            <NavBar />
            
            {/* Donation Card */}
            <div className="container py-8">
              <Card className="bg-gradient-to-r from-purple-800/90 to-blue-900/90 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Donate className="h-6 w-6" />
                    Support Web3Radio DAO
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Your donations help us build the future of decentralized radio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-4">
                    Help fund development, hosting, and community initiatives by donating to our treasury. All funds are managed transparently through the DAO.
                  </p>
                  <p className="text-sm text-purple-200 mb-2">Send donations to:</p>
                  <code className="bg-gray-800 p-2 rounded block text-gray-100 mb-4 overflow-auto">
                    0x53dfe235484465b723D81E56988263b50BafEA33
                  </code>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button 
                    onClick={() => handleDonate("Ethereum")}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    <Ethereum className="h-4 w-4 mr-2" />
                    Donate with ETH
                  </Button>
                  <Button 
                    onClick={() => handleDonate("Arbitrum")}
                    className="bg-blue-800 hover:bg-blue-900 flex-1"
                  >
                    <Ethereum className="h-4 w-4 mr-2" />
                    Donate with Arbitrum
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* DAO Proposals */}
            <div className="container pb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <Vote className="h-6 w-6" /> 
                  Active Proposals
                </h2>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Vote className="h-4 w-4 mr-2" />
                  Create Proposal
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {proposals.map((proposal) => (
                  <Card key={proposal.id} className="bg-gray-800/90 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">{proposal.title}</CardTitle>
                      <CardDescription className="text-gray-300">
                        Proposal #{proposal.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{proposal.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">For: {proposal.votesFor}</span>
                          <span className="text-red-400">Against: {proposal.votesAgainst}</span>
                        </div>
                        
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-400" 
                            style={{ 
                              width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                      <Button 
                        onClick={() => handleVote(proposal.id, true)} 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Vote For
                      </Button>
                      <Button 
                        onClick={() => handleVote(proposal.id, false)} 
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Vote Against
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <Toaster />
        </div>
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default DAO;
