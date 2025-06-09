
import React from 'react';
import { NFTProvider, NFTMedia } from "thirdweb/react";
import { getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NFTCollectionProps {
  client: any;
}

const NFTCollection: React.FC<NFTCollectionProps> = ({ client }) => {
  const account = useActiveAccount();

  // Example NFT contract - you'll need to replace with actual contract addresses
  const nftContract = getContract({
    client,
    chain: { id: 1 }, // Ethereum mainnet
    address: "0x..." // Replace with actual NFT contract address
  });

  if (!account) {
    return (
      <Card className="p-3 bg-[#222] border-[#444]">
        <p className="text-xs text-gray-400 text-center">
          Connect wallet to view NFT collection
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-3 bg-[#222] border-[#444]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">NFT Collection</h3>
          <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333]">
            Connected
          </Badge>
        </div>
        
        {/* Example NFT Display */}
        <div className="grid grid-cols-2 gap-2">
          <NFTProvider tokenId={0n} contract={nftContract}>
            <NFTMedia
              className="rounded-md w-full h-20 object-cover"
              loadingComponent={
                <div className="w-full h-20 bg-[#333] rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-400">Loading...</span>
                </div>
              }
            />
          </NFTProvider>
          
          <NFTProvider tokenId={1n} contract={nftContract}>
            <NFTMedia
              className="rounded-md w-full h-20 object-cover"
              loadingComponent={
                <div className="w-full h-20 bg-[#333] rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-400">Loading...</span>
                </div>
              }
            />
          </NFTProvider>
        </div>
        
        <p className="text-xs text-gray-400 text-center">
          Replace contract address with your NFT collection
        </p>
      </div>
    </Card>
  );
};

export default NFTCollection;
