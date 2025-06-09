
import React from 'react';
import { NFTProvider, NFTMedia } from "thirdweb/react";
import { getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ethereum } from "thirdweb/chains";

interface NFTCollectionProps {
  client: any;
}

const NFTCollection: React.FC<NFTCollectionProps> = ({ client }) => {
  const account = useActiveAccount();

  // Example NFT contract address - using a valid format but placeholder
  // Replace with your actual NFT contract address
  const contractAddress = "0x0000000000000000000000000000000000000000";

  if (!account) {
    return (
      <Card className="p-3 bg-[#222] border-[#444]">
        <p className="text-xs text-gray-400 text-center">
          Connect wallet to view NFT collection
        </p>
      </Card>
    );
  }

  // Only create contract if we have a valid non-zero address
  let nftContract = null;
  try {
    if (contractAddress !== "0x0000000000000000000000000000000000000000") {
      nftContract = getContract({
        client,
        chain: ethereum, // Use the proper ethereum chain from thirdweb
        address: contractAddress
      });
    }
  } catch (error) {
    console.log("Error creating contract:", error);
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
        
        {nftContract ? (
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
        ) : (
          <div className="text-center py-4">
            <div className="w-full h-20 bg-[#333] rounded-md flex items-center justify-center mb-2">
              <span className="text-xs text-gray-400">No NFT Contract</span>
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-400 text-center">
          Add your NFT contract address to display your collection
        </p>
      </div>
    </Card>
  );
};

export default NFTCollection;
