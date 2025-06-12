
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart, Tag, User } from "lucide-react";

interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  owner: string;
  price?: string;
  isListed?: boolean;
  tokenId: bigint;
}

interface NFTCardProps {
  nft: NFTData;
  onList: () => void;
  onBuy: () => void;
  onView: () => void;
  isOwner: boolean;
  isConnected: boolean;
}

const NFTCard = ({ nft, onList, onBuy, onView, isOwner, isConnected }: NFTCardProps) => {
  return (
    <Card className="bg-[#222] border-[#444] hover:border-[#00ff00] transition-colors group">
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
            {nft.isListed ? (
              <Badge className="bg-[#00ff00] text-black">Listed</Badge>
            ) : (
              <Badge variant="outline" className="bg-[#111] text-white border-[#333]">
                Not Listed
              </Badge>
            )}
          </div>
        </div>

        {/* NFT Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white truncate">{nft.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
          </div>

          {/* Owner Info */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User className="w-4 h-4" />
            <span>
              {isOwner ? 'You' : `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`}
            </span>
          </div>

          {/* Price */}
          {nft.price && (
            <div className="text-lg font-bold text-[#00ff00]">
              {nft.price} ETH
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onView}
              variant="outline"
              size="sm"
              className="flex-1 bg-[#333] text-white border-[#555] hover:bg-[#444]"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>

            {isConnected && (
              <>
                {isOwner && !nft.isListed && (
                  <Button
                    onClick={onList}
                    size="sm"
                    className="flex-1 bg-[#00ff00] text-black hover:bg-[#00cc00]"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    List
                  </Button>
                )}

                {!isOwner && nft.isListed && nft.price && (
                  <Button
                    onClick={onBuy}
                    size="sm"
                    className="flex-1 bg-[#00ff00] text-black hover:bg-[#00cc00]"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
