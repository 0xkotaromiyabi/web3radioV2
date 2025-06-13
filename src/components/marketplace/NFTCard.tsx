
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: bigint;
  price?: string;
  isListed?: boolean;
  listingId?: bigint;
}

interface NFTCardProps {
  nft: NFTData;
  onBuy: () => void;
  isConnected: boolean;
  client: any;
}

const NFTCard = ({ nft, onBuy, isConnected }: NFTCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-600 hover:border-green-500 transition-colors group">
      <CardContent className="p-0">
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-600 text-white">For Sale</Badge>
          </div>
        </div>

        {/* NFT Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white truncate">{nft.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
          </div>

          {/* Price */}
          {nft.price && (
            <div className="text-lg font-bold text-green-400">
              {nft.price} ETH
            </div>
          )}

          {/* Buy Button */}
          <div className="flex gap-2">
            {isConnected ? (
              <Button
                onClick={onBuy}
                size="sm"
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Buy Now
              </Button>
            ) : (
              <Button
                disabled
                size="sm"
                className="flex-1 bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
