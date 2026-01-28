import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Wallet, Coins } from "lucide-react";
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

  // Mock Data since we removed Thirdweb SDK
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          NFT Marketplace
        </h1>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="bg-gray-800 text-blue-400 border-gray-600">
            Base Network
          </Badge>
          <Badge variant="outline" className="bg-gray-800 text-green-400 border-gray-600">
            {filteredNfts.length} NFTs Available
          </Badge>
          <Badge variant="outline" className="bg-gray-800 text-purple-400 border-gray-600">
            0.005 ETH Each
          </Badge>
        </div>
      </div>

      {/* Wallet Connection */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-blue-400 mr-2" />
            <Coins className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-gray-300 mb-4">Connect your wallet to buy NFTs with USDC or ETH</p>
          <WalletConnectButton />
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <Input
            placeholder="Search NFTs by name, description, or token ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </CardContent>
      </Card>

      {/* NFT Grid */}
      {filteredNfts.length === 0 ? (
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'No NFTs available in this collection yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
