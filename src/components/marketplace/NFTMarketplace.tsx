
import React, { useState, useEffect } from 'react';
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc1155";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  tokenId: bigint;
  price?: string;
  isListed?: boolean;
  listingId?: bigint;
}

interface NFTMarketplaceProps {
  client: any;
}

// Contract addresses
const NFT_CONTRACT_ADDRESS = "0x49FBd93023FB44fefa81351271fb703cab0f2EE4";

const NFTMarketplace = ({ client }: NFTMarketplaceProps) => {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNft, setSelectedNft] = useState<NFTData | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  
  const account = useActiveAccount();
  const { toast } = useToast();

  // NFT Contract
  const nftContract = getContract({
    client,
    chain: base,
    address: NFT_CONTRACT_ADDRESS,
  });

  // Fetch NFTs from the contract
  const { data: contractNFTs, isLoading: nftsLoading } = useReadContract(getNFTs, {
    contract: nftContract,
    start: 0,
    count: 100,
  });

  useEffect(() => {
    if (contractNFTs) {
      const formattedNfts: NFTData[] = contractNFTs.map((nft) => ({
        id: nft.id.toString(),
        name: nft.metadata.name || `NFT #${nft.id}`,
        description: nft.metadata.description || 'No description available',
        image: nft.metadata.image || '/placeholder.svg',
        tokenId: nft.id,
        // Mock data for buy-only marketplace
        isListed: true,
        price: (Math.random() * 0.5 + 0.01).toFixed(4),
      }));
      
      setNfts(formattedNfts);
      setFilteredNfts(formattedNfts);
      setLoading(false);
    }
  }, [contractNFTs]);

  useEffect(() => {
    let filtered = nfts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNfts(filtered);
  }, [searchTerm, nfts]);

  const handleBuyNFT = (nft: NFTData) => {
    if (!account) {
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

  if (loading || nftsLoading) {
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
            {nfts.length} NFTs Available
          </Badge>
        </div>
      </div>

      {/* Wallet Connection */}
      {!account && (
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-6 text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-4">Connect your wallet to buy NFTs</p>
            <WalletConnectButton client={client} />
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
              isConnected={!!account}
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
          client={client}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
