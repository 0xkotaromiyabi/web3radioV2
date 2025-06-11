
import React, { useState } from 'react';
import { createThirdwebClient, getContract } from "thirdweb";
import { PayEmbed } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { mintTo } from "thirdweb/extensions/erc1155";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';

const chainId = 8453;
const contractAddress = "0x5bEC03639DB23964fF5721FAD6a00142BC4684aC";

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

// connect to your contract
const contract = getContract({
  address: contractAddress,
  chain: defineChain(chainId),
  client: client,
});

const NFTMarketplace = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    setIsMinting(true);
    try {
      // This would typically be done on the backend with a server wallet
      // For demonstration purposes, showing the transaction structure
      const transaction = mintTo({
        contract,
        to: "0x242DfB7849544eE242b2265cA7E585bdec60456B", // Example address
        nft: {
          name: "Web3 Radio T-Shirt",
          description: "Limited edition Web3 Radio merchandise. Show your support for decentralized radio!",
          image: "ipfs://QmNuC7QxwTRwmMGwJWtRQxVphAWpAngExH6e6oHNhRPbNU/0.png",
        },
        supply: "1000",
      });

      console.log("Mint transaction prepared:", transaction);
      
      toast({
        title: "Mint Prepared",
        description: "NFT mint transaction has been prepared. Connect your wallet to proceed.",
      });
    } catch (error) {
      console.error("Error preparing mint:", error);
      toast({
        title: "Error",
        description: "Failed to prepare mint transaction.",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mt-6 lg:mt-8">
      <Card className="bg-[#222] border-[#444]">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className={`text-white text-center ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            🛍️ Web3 Radio NFT Marketplace
          </CardTitle>
          <p className={`text-gray-400 text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Get exclusive Web3 Radio merchandise and collectibles
          </p>
        </CardHeader>
        <CardContent className={`space-y-4 lg:space-y-6 ${isMobile ? 'p-4' : 'p-6 pt-0'}`}>
          {/* Contract Info */}
          <div className="bg-[#1a1a1a] rounded-lg p-3 lg:p-4">
            <h4 className={`text-white font-semibold mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              📋 Contract Details
            </h4>
            <div className={`text-gray-400 space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <p>• Chain ID: {chainId} (Base)</p>
              <p>• Contract: {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}</p>
              <p>• Supply: 1000 NFTs</p>
            </div>
          </div>

          {/* Featured NFT */}
          <div className="bg-[#333] rounded-lg p-3 lg:p-4">
            <div className="flex flex-col items-center space-y-3 lg:space-y-4">
              <Badge variant="secondary" className="bg-[#00ff00] text-black text-xs lg:text-sm">
                Featured Item
              </Badge>
              <h3 className={`text-white font-bold text-center ${isMobile ? 'text-base' : 'text-lg'}`}>
                Web3 Radio T-Shirt NFT
              </h3>
              <p className={`text-gray-400 text-center ${isMobile ? 'text-xs leading-relaxed' : 'text-sm'} max-w-sm`}>
                Limited edition Web3 Radio merchandise. Show your support for decentralized radio!
              </p>
              
              {/* Mint Button */}
              <Button 
                onClick={handleMint}
                disabled={isMinting}
                className={`bg-[#00ff00] text-black hover:bg-[#00cc00] ${isMobile ? 'text-sm px-4 py-2' : 'text-base px-6 py-3'}`}
              >
                {isMinting ? "Preparing..." : "🎯 Prepare Mint"}
              </Button>

              {/* PayEmbed Component */}
              <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
                <PayEmbed
                  client={client}
                  payOptions={{
                    metadata: {
                      image: "ipfs://QmNuC7QxwTRwmMGwJWtRQxVphAWpAngExH6e6oHNhRPbNU/0.png",
                    },
                    mode: "direct_payment",
                    paymentInfo: {
                      chain: defineChain(chainId),
                      sellerAddress: "0x242DfB7849544eE242b2265cA7E585bdec60456B",
                      amount: "0.005",
                      token: {
                        name: "web3radio T-shirt",
                        symbol: "W3R",
                        address: contractAddress,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-[#1a1a1a] rounded-lg p-3 lg:p-4">
            <h4 className={`text-white font-semibold mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              💎 Why Buy Web3 Radio NFTs?
            </h4>
            <ul className={`text-gray-400 space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <li>• Support decentralized radio broadcasting</li>
              <li>• Get exclusive access to premium features</li>
              <li>• Join the Web3 Radio community</li>
              <li>• Own a piece of radio history</li>
              <li>• Limited supply of 1000 NFTs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTMarketplace;
