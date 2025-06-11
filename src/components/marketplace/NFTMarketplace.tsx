
import React from 'react';
import {
  createThirdwebClient,
  getContract,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { PayEmbed } from "thirdweb/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// create the client with your clientId
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
  return (
    <div className="mt-8">
      <Card className="bg-[#222] border-[#444]">
        <CardHeader>
          <CardTitle className="text-white text-center text-lg md:text-xl">
            🛍️ Web3 Radio NFT Marketplace
          </CardTitle>
          <p className="text-gray-400 text-center text-xs md:text-sm">
            Get exclusive Web3 Radio merchandise and collectibles
          </p>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          {/* Featured NFT */}
          <div className="bg-[#333] rounded-lg p-3 md:p-4">
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <Badge variant="secondary" className="bg-[#00ff00] text-black text-xs">
                Featured Item
              </Badge>
              <h3 className="text-white font-bold text-base md:text-lg text-center">
                Web3 Radio T-Shirt
              </h3>
              <p className="text-gray-400 text-xs md:text-sm text-center px-2">
                Limited edition Web3 Radio merchandise. Show your support for decentralized radio!
              </p>
              
              {/* PayEmbed Component */}
              <div className="w-full max-w-sm md:max-w-md">
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

          {/* Contract Info */}
          <div className="bg-[#1a1a1a] rounded-lg p-3 md:p-4">
            <h4 className="text-white font-semibold mb-2 text-sm md:text-base">🔗 Contract Details</h4>
            <div className="text-gray-400 text-xs md:text-sm space-y-1">
              <p>Chain: Base (ID: 8453)</p>
              <p className="break-all">Contract: {contract.address}</p>
              <p>Symbol: W3R</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-[#1a1a1a] rounded-lg p-3 md:p-4">
            <h4 className="text-white font-semibold mb-2 text-sm md:text-base">💎 Why Buy Web3 Radio NFTs?</h4>
            <ul className="text-gray-400 text-xs md:text-sm space-y-1">
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
