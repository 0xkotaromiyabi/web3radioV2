
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { useAccount } from 'wagmi';
import placeholderData from '@/assets/placeholder.svg';

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
  const { address: account } = useAccount();

  // Function to get IPFS image URL
  const getImageUrl = (imageUri: string) => {
    if (!imageUri) return placeholderData;

    // Handle IPFS URLs
    if (imageUri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${imageUri.replace('ipfs://', '')}`;
    }

    // Handle HTTP URLs
    if (imageUri.startsWith('http')) {
      return imageUri;
    }

    // Fallback
    return placeholderData;
  };

  return (
    <div className="group relative bg-white/90 backdrop-blur-xl rounded-[40px] overflow-hidden border border-[#515044]/5 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden m-3 rounded-[32px] bg-[#515044]/5">
        <img
          src={getImageUrl(nft.image)}
          alt={nft.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = placeholderData;
          }}
          loading="lazy"
        />
        <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <Badge className="bg-white/90 backdrop-blur-md text-[#515044] border-none shadow-xl font-bold text-[8px] uppercase tracking-widest px-3 py-1.5">
            #{nft.tokenId}
          </Badge>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-8 pt-4 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#515044] tracking-tight">
            {nft.name}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-2 line-clamp-1">
            {nft.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30">Price</p>
            <p className="text-lg font-bold text-[#515044]">{nft.price} ETH</p>
          </div>
          <button
            onClick={onBuy}
            disabled={!account}
            className="bg-[#515044] hover:bg-black text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-[#515044]/10 disabled:opacity-20 disabled:grayscale"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#515044]/0 via-[#515044]/10 to-[#515044]/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
    </div>
  );
};

export default NFTCard;
