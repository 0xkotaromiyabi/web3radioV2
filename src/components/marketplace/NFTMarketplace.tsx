
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Wallet, Coins, Search } from "lucide-react";
import NFTCard from './NFTCard';
import BuyNFTDialog from './BuyNFTDialog';
import WalletConnectButton from './WalletConnectButton';
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

const NFTMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNft, setSelectedNft] = useState<NFTData | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  const nfts: NFTData[] = [
    {
      id: "1",
      name: "Radio NFT #1",
      description: "Exclusive access to premium radio content",
      image: "",
      tokenId: "1",
      price: "0.005",
      isListed: true
    },
    {
      id: "2",
      name: "Radio NFT #2",
      description: "Exclusive access to premium radio content",
      image: "",
      tokenId: "2",
      price: "0.005",
      isListed: true
    },
    {
      id: "3",
      name: "Radio NFT #3",
      description: "Exclusive access to premium radio content",
      image: "",
      tokenId: "3",
      price: "0.005",
      isListed: true
    },
    {
      id: "4",
      name: "Radio NFT #4",
      description: "Exclusive access to premium radio content",
      image: "",
      tokenId: "4",
      price: "0.005",
      isListed: true
    }
  ];

  const filteredNfts = nfts.filter(nft =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyNFT = (nft: NFTData) => {
    setSelectedNft(nft);
    setShowBuyDialog(true);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <Badge className="bg-[#515044]/5 text-[#515044] hover:bg-[#515044]/10 border-[#515044]/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
          Digital Collectibles
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#515044] tracking-tight">
          Marketplace
        </h1>
        <div className="flex flex-wrap gap-3 justify-center">
          <Badge variant="outline" className="bg-white/50 text-[#515044]/60 border-[#515044]/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Base Network
          </Badge>
          <Badge variant="outline" className="bg-white/50 text-[#515044]/60 border-[#515044]/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {filteredNfts.length} Available
          </Badge>
          <Badge variant="outline" className="bg-white/50 text-[#515044]/60 border-[#515044]/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            0.005 ETH Each
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Search & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-[40px] p-10 shadow-xl border border-[#515044]/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#515044]/5 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#515044]/40" />
              </div>
              <div>
                <h3 className="font-bold text-[#515044]">Collector Access</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">Connect your wallet</p>
              </div>
            </div>
            <WalletConnectButton />
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 border border-[#515044]/5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#515044]/30" />
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/50 border-none pl-12 h-14 rounded-2xl text-[#515044] placeholder-[#515044]/30 focus-visible:ring-1 focus-visible:ring-[#515044]/10"
              />
            </div>
          </div>
        </div>

        {/* Right Column: NFT Grid */}
        <div className="lg:col-span-8">
          {filteredNfts.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-20 text-center border border-[#515044]/5">
              <ShoppingCart className="w-12 h-12 text-[#515044]/10 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-[#515044]">No Assets Found</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onBuy={() => handleBuyNFT(nft)}
                  contract={null}
                  client={null}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buy Dialog */}
      {selectedNft && (
        <BuyNFTDialog
          nft={selectedNft}
          isOpen={showBuyDialog}
          onClose={() => setShowBuyDialog(false)}
          contract={null}
          client={null}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
