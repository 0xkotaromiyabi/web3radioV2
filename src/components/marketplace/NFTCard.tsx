
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";

interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  price?: string;
  isListed?: boolean;
}

interface NFTCardProps {
  nft: NFTData;
  onBuy: () => void;
  contract: any;
  client: any;
}

const NFTCard = ({ nft, onBuy }: NFTCardProps) => {
  const account = useActiveAccount();

  // Function to get IPFS image URL
  const getImageUrl = (imageUri: string) => {
    if (!imageUri) return '/placeholder.svg';
    
    // Handle IPFS URLs
    if (imageUri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${imageUri.replace('ipfs://', '')}`;
    }
    
    // Handle HTTP URLs
    if (imageUri.startsWith('http')) {
      return imageUri;
    }
    
    // Fallback
    return '/placeholder.svg';
  };

  return (
    <Card className="bg-gray-800 border-gray-600 hover:border-green-500 transition-all duration-300 group">
      <CardContent className="p-0">
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-700">
          <img
            src={getImageUrl(nft.image)}
            alt={nft.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.log('Image failed to load:', nft.image);
              e.currentTarget.src = '/placeholder.svg';
            }}
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-600 text-white shadow-lg">Available</Badge>
          </div>
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        {/* NFT Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-green-400 transition-colors">
              {nft.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {nft.description}
            </p>
          </div>

          {/* Token ID */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
              #{nft.tokenId}
            </Badge>
          </div>

          {/* Price */}
          {nft.price && (
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-green-400">
                {nft.price} USDC
              </div>
              <div className="text-sm text-gray-400">
                ≈ {(parseFloat(nft.price) * 0.00027).toFixed(4)} ETH
              </div>
            </div>
          )}

          {/* Buy Button */}
          <Button
            onClick={onBuy}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105"
            disabled={!account}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {account ? 'Buy NFT' : 'Connect Wallet'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
