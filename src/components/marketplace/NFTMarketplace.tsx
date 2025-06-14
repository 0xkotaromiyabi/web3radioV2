import React, { useState } from 'react';
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc1155";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Wallet, Coins } from "lucide-react";
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

// Contract address and client setup
const NFT_CONTRACT_ADDRESS = "0x49FBd93023FB44fefa81351271fb703cab0f2EE4";

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const contract = getContract({
  client,
  chain: defineChain(8453), // Base chain
  address: NFT_CONTRACT_ADDRESS,
});

const NFTMarketplace = () => {
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNft, setSelectedNft] = useState<NFTData | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  
  const { toast } = useToast();

  // Get NFTs using thirdweb v5
  const { data: nfts, isLoading, error } = useReadContract(getNFTs, {
    contract,
    start: 0,
    count: 100,
  });

  // Process NFTs when data loads
  React.useEffect(() => {
    if (nfts && nfts.length > 0) {
      console.log('Raw NFT data:', nfts);
      
      const formattedNfts: NFTData[] = nfts.map((nft, index) => {
        console.log(`NFT ${index}:`, nft);
        
        return {
          id: nft.id.toString(),
          name: nft.metadata?.name?.toString() || `NFT #${nft.id}`,
          description: nft.metadata?.description?.toString() || 'Digital collectible NFT',
          image: nft.metadata?.image?.toString() || '/placeholder.svg',
          tokenId: nft.id.toString(),
          isListed: true,
          price: "0.005", // Fixed price of 0.005 ETH
        };
      });
      
      console.log('Formatted NFTs:', formattedNfts);
      setFilteredNfts(formattedNfts);
    }
  }, [nfts]);

  // Filter NFTs based on search
  React.useEffect(() => {
    if (!nfts) return;
    
    let filtered = nfts.map((nft) => ({
      id: nft.id.toString(),
      name: nft.metadata?.name?.toString() || `NFT #${nft.id}`,
      description: nft.metadata?.description?.toString() || 'Digital collectible NFT',
      image: nft.metadata?.image?.toString() || '/placeholder.svg',
      tokenId: nft.id.toString(),
      isListed: true,
      price: "0.005", // Fixed price of 0.005 ETH
    }));

    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.tokenId.includes(searchTerm)
      );
    }

    setFilteredNfts(filtered);
  }, [searchTerm, nfts]);

  const handleBuyNFT = (nft: NFTData) => {
    console.log('Buying NFT:', nft);
    setSelectedNft(nft);
    setShowBuyDialog(true);
  };

  if (error) {
    console.error('Error loading NFTs:', error);
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="bg-red-900/20 border-red-600">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading NFTs</h3>
            <p className="text-red-300">Failed to load NFT collection. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          NFT Marketplace
        </h1>
        <p className="text-gray-300">
          Buy premium NFTs with USDC or ETH from contract {NFT_CONTRACT_ADDRESS.slice(0, 6)}...{NFT_CONTRACT_ADDRESS.slice(-4)}
        </p>
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
              contract={contract}
              client={client}
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
          client={client}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
