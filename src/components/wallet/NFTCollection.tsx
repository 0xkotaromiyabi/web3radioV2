
import React from 'react';
import { useAccount } from 'wagmi';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NFTCollectionProps {
  // client prop removed
}

const NFTCollection: React.FC<NFTCollectionProps> = () => {
  const { address, isConnected } = useAccount();

  // Example NFT contract address - using a valid format but placeholder
  const contractAddress = "0x0000000000000000000000000000000000000000";

  if (!isConnected) {
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

        {/* Placeholder for NFT Grid - Wagmi data fetching needed */}
        <div className="grid grid-cols-2 gap-2">
          <div className="w-full h-20 bg-[#333] rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-400">NFT 1 (Placeholder)</span>
          </div>
          <div className="w-full h-20 bg-[#333] rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-400">NFT 2 (Placeholder)</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          NFT display temporarily unavailable during migration.
        </p>
      </div>
    </Card>
  );
};

export default NFTCollection;
