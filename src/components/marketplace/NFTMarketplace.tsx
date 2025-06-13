
import React, { useState } from 'react';
import { useContract, useNFTs, useAddress } from "@thirdweb-dev/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Wallet } from "lucide-react";
import NFTCard from './NFTCard';
import BuyNFTDialog from './BuyNFTDialog';
import WalletConnectButton from './WalletConnectButton';

interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  price?: string;
  isListed?: boolean;
}

// Contract address
const NFT_CONTRACT_ADDRESS = "0x49FBd93023FB44fefa81351271fb703cab0f2EE4";

const NFTMarketplace = () => {
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNft, setSelectedNft] = useState<NFTData | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  
  const address = useAddress();
  const { toast } = useToast();

  // Get NFT contract
  const { contract } = useContract(NFT_CONTRACT_ADDRESS, "edition");
  const { data: nfts, isLoading } = useNFTs(contract);

  // Process NFTs when data loads
  React.useEffect(() => {
    if (nfts) {
      const formattedNfts: NFTData[] = nfts.map((nft) => ({
        id: nft.metadata.id?.toString() || "0",
        name: nft.metadata.name || `NFT #${nft.metadata.id}`,
        description: nft.metadata.description || 'No description available',
        image: nft.metadata.image || '/placeholder.svg',
        tokenId: nft.metadata.id?.toString() || "0",
        // Mock data for buy-only marketplace
        isListed: true,
        price: (Math.random() * 0.5 + 0.01).toFixed(4),
      }));
      
      setFilteredNfts(formattedNfts);
    }
  }, [nfts]);

  // Filter NFTs based on search
  React.useEffect(() => {
    if (!nfts) return;
    
    let filtered = nfts.map((nft) => ({
      id: nft.metadata.id?.toString() || "0",
      name: nft.metadata.name || `NFT #${nft.metadata.id}`,
      description: nft.metadata.description || 'No description available',
      image: nft.metadata.image || '/placeholder.svg',
      tokenId: nft.metadata.id?.toString() || "0",
      isListed: true,
      price: (Math.random() * 0.5 + 0.01).toFixed(4),
    }));

    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNfts(filtered);
  }, [searchTerm, nfts]);

  const handleBuyNFT = (nft: NFTData) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to buy NFTs",
        variant: "destructive",
      });
      return;
    }
    setSelectedNft(nft);
    setShowBuyDialog(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          <span className="ml-2 text-white">Loading NFT marketplace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">NFT Marketplace</h1>
        <p className="text-gray-300">
          Buy NFTs from contract {NFT_CONTRACT_ADDRESS.slice(0, 6)}...{NFT_CONTRACT_ADDRESS.slice(-4)}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="bg-gray-800 text-blue-400 border-gray-600">
            Base Network
          </Badge>
          <Badge variant="outline" className="bg-gray-800 text-green-400 border-gray-600">
            {filteredNfts.length} NFTs Available
          </Badge>
        </div>
      </div>

      {/* Wallet Connection */}
      {!address && (
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-6 text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-4">Connect your wallet to buy NFTs</p>
            <WalletConnectButton />
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <Input
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
                ? 'Try adjusting your search' 
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
              isConnected={!!address}
              contract={contract}
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
          contract={contract}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
