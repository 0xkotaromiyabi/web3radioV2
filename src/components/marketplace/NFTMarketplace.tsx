
import React from 'react';
import { createThirdwebClient, getContract } from "thirdweb";
import { PayEmbed } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

// connect to your contract
const contract = getContract({
  client,
  chain: defineChain(8453),
  address: "0x5bEC03639DB23964fF5721FAD6a00142BC4684aC",
});

const NFTMarketplace = () => {
  const isMobile = useIsMobile();

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
          {/* Featured NFT */}
          <div className="bg-[#333] rounded-lg p-3 lg:p-4">
            <div className="flex flex-col items-center space-y-3 lg:space-y-4">
              <Badge variant="secondary" className="bg-[#00ff00] text-black text-xs lg:text-sm">
                Featured Item
              </Badge>
              <h3 className={`text-white font-bold text-center ${isMobile ? 'text-base' : 'text-lg'}`}>
                Web3 Radio T-Shirt
              </h3>
              <p className={`text-gray-400 text-center ${isMobile ? 'text-xs leading-relaxed' : 'text-sm'} max-w-sm`}>
                Limited edition Web3 Radio merchandise. Show your support for decentralized radio!
              </p>
              
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
                      chain: defineChain(8453),
                      sellerAddress: "0x242DfB7849544eE242b2265cA7E585bdec60456B",
                      amount: "0.005",
                      token: {
                        name: "web3radio T-shirt",
                        symbol: "W3R",
                        address: "0x5bEC03639DB23964fF5721FAD6a00142BC4684aC",
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
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTMarketplace;
