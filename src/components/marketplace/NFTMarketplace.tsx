
import React, { useState, useEffect } from 'react';
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getNFTs, totalSupply } from "thirdweb/extensions/erc721";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Tag, Eye } from "lucide-react";
import NFTCard from './NFTCard';
import ListNFTDialog from './ListNFTDialog';
import BuyNFTDialog from './BuyNFTDialog';

// Initialize thirdweb client
const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

// Connect to your contract
const contract = getContract({
  client,
  chain: defineChain(8453), // Base chain
  address: "0x49FBd93023FB44fefa81351271fb703cab0f2EE4",
});

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

const NFTMarketplace = () => {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'listed' | 'unlisted'>('all');
  const [selectedNft, setSelectedNft] = useState<NFTData | null>(null);
  const [showListDialog, setShowListDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  
  const account = useActiveAccount();
  const { toast } = useToast();

  // Get total supply of NFTs
  const { data: totalNFTs } = useReadContract(totalSupply, {
    contract,
  });

  // Fetch NFTs from the contract
  const { data: contractNFTs, isLoading: nftsLoading } = useReadContract(getNFTs, {
    contract,
    start: 0,
    count: totalNFTs ? Number(totalNFTs) : 100,
  });

  useEffect(() => {
    if (contractNFTs) {
      const formattedNfts: NFTData[] = contractNFTs.map((nft) => ({
        id: nft.id.toString(),
        name: nft.metadata.name || `NFT #${nft.id}`,
        description: nft.metadata.description || 'No description available',
        image: nft.metadata.image || '/placeholder.svg',
        owner: nft.owner,
        tokenId: nft.id,
        isListed: Math.random() > 0.6, // Mock listing status
        price: Math.random() > 0.6 ? (Math.random() * 2 + 0.1).toFixed(3) : undefined,
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

    // Apply listing filter
    if (filter === 'listed') {
      filtered = filtered.filter(nft => nft.isListed);
    } else if (filter === 'unlisted') {
      filtered = filtered.filter(nft => !nft.isListed);
    }

    setFilteredNfts(filtered);
  }, [searchTerm, filter, nfts]);

  const handleListNFT = (nft: NFTData) => {
    setSelectedNft(nft);
    setShowListDialog(true);
  };

  const handleBuyNFT = (nft: NFTData) => {
    setSelectedNft(nft);
    setShowBuyDialog(true);
  };

  const handleViewNFT = (nft: NFTData) => {
    toast({
      title: "NFT Details",
      description: `Viewing ${nft.name} owned by ${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`,
    });
  };

  if (loading || nftsLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#00ff00]" />
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
        <p className="text-gray-300">Discover, collect, and trade unique digital assets</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333]">
            Base Network
          </Badge>
          <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333]">
            {nfts.length} NFTs Available
          </Badge>
          <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333]">
            {filteredNfts.filter(nft => nft.isListed).length} Listed
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-[#222] border-[#444]">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#333] border-[#555] text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
                className={filter === 'all' ? 'bg-[#00ff00] text-black' : 'bg-[#333] text-white border-[#555]'}
              >
                All ({nfts.length})
              </Button>
              <Button
                variant={filter === 'listed' ? 'default' : 'outline'}
                onClick={() => setFilter('listed')}
                size="sm"
                className={filter === 'listed' ? 'bg-[#00ff00] text-black' : 'bg-[#333] text-white border-[#555]'}
              >
                Listed ({nfts.filter(nft => nft.isListed).length})
              </Button>
              <Button
                variant={filter === 'unlisted' ? 'default' : 'outline'}
                onClick={() => setFilter('unlisted')}
                size="sm"
                className={filter === 'unlisted' ? 'bg-[#00ff00] text-black' : 'bg-[#333] text-white border-[#555]'}
              >
                Unlisted ({nfts.filter(nft => !nft.isListed).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      {!account && (
        <Card className="bg-[#222] border-[#444]">
          <CardContent className="p-4 text-center">
            <p className="text-gray-300 mb-3">Connect your wallet to interact with NFTs</p>
            <p className="text-sm text-gray-400">You'll be able to buy, sell, and list NFTs once connected</p>
          </CardContent>
        </Card>
      )}

      {/* NFT Grid */}
      {filteredNfts.length === 0 ? (
        <Card className="bg-[#222] border-[#444]">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters' 
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
              onList={() => handleListNFT(nft)}
              onBuy={() => handleBuyNFT(nft)}
              onView={() => handleViewNFT(nft)}
              isOwner={account?.address === nft.owner}
              isConnected={!!account}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      {selectedNft && (
        <>
          <ListNFTDialog
            nft={selectedNft}
            isOpen={showListDialog}
            onClose={() => setShowListDialog(false)}
            contract={contract}
          />
          <BuyNFTDialog
            nft={selectedNft}
            isOpen={showBuyDialog}
            onClose={() => setShowBuyDialog(false)}
            contract={contract}
          />
        </>
      )}
    </div>
  );
};

export default NFTMarketplace;
