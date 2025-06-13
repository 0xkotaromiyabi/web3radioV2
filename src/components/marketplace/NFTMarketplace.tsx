
import React, { useState, useEffect } from 'react';
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getNFTs, totalSupply } from "thirdweb/extensions/erc1155";
import { getAllListings } from "thirdweb/extensions/marketplace";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, Wallet } from "lucide-react";
import NFTCard from './NFTCard';
import ListNFTDialog from './ListNFTDialog';
import BuyNFTDialog from './BuyNFTDialog';
import WalletConnectButton from './WalletConnectButton';

interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: bigint;
  supply: bigint;
  price?: string;
  isListed?: boolean;
  listingId?: bigint;
}

interface NFTMarketplaceProps {
  client: any;
}

// Contract addresses
const NFT_CONTRACT_ADDRESS = "0x49FBd93023FB44fefa81351271fb703cab0f2EE4";
const MARKETPLACE_CONTRACT_ADDRESS = "0x..."; // Deploy marketplace contract first

const NFTMarketplace = ({ client }: NFTMarketplaceProps) => {
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

  // NFT Contract
  const nftContract = getContract({
    client,
    chain: base,
    address: NFT_CONTRACT_ADDRESS,
  });

  // Marketplace Contract (uncomment when deployed)
  // const marketplaceContract = getContract({
  //   client,
  //   chain: base,
  //   address: MARKETPLACE_CONTRACT_ADDRESS,
  // });

  // Get total supply of NFTs
  const { data: totalNFTs } = useReadContract(totalSupply, {
    contract: nftContract,
  });

  // Fetch NFTs from the contract
  const { data: contractNFTs, isLoading: nftsLoading } = useReadContract(getNFTs, {
    contract: nftContract,
    start: 0,
    count: totalNFTs ? Number(totalNFTs) : 100,
  });

  // Fetch marketplace listings (uncomment when marketplace is deployed)
  // const { data: listings } = useReadContract(getAllListings, {
  //   contract: marketplaceContract,
  // });

  useEffect(() => {
    if (contractNFTs) {
      const formattedNfts: NFTData[] = contractNFTs.map((nft) => ({
        id: nft.id.toString(),
        name: nft.metadata.name || `NFT #${nft.id}`,
        description: nft.metadata.description || 'No description available',
        image: nft.metadata.image || '/placeholder.svg',
        tokenId: nft.id,
        supply: nft.supply,
        // Mock data for now - replace with actual marketplace data
        isListed: Math.random() > 0.6,
        price: Math.random() > 0.6 ? (Math.random() * 0.5 + 0.01).toFixed(4) : undefined,
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
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to list NFTs",
        variant: "destructive",
      });
      return;
    }
    setSelectedNft(nft);
    setShowListDialog(true);
  };

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
          Discover and trade NFTs from contract {NFT_CONTRACT_ADDRESS.slice(0, 6)}...{NFT_CONTRACT_ADDRESS.slice(-4)}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="bg-gray-800 text-blue-400 border-gray-600">
            Base Network
          </Badge>
          <Badge variant="outline" className="bg-gray-800 text-green-400 border-gray-600">
            {nfts.length} NFTs Available
          </Badge>
          <Badge variant="outline" className="bg-gray-800 text-yellow-400 border-gray-600">
            {filteredNfts.filter(nft => nft.isListed).length} Listed
          </Badge>
        </div>
      </div>

      {/* Wallet Connection */}
      {!account && (
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-6 text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-4">Connect your wallet to buy, sell, and list NFTs</p>
            <WalletConnectButton client={client} />
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
                className={filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-700 text-white border-gray-600'}
              >
                All ({nfts.length})
              </Button>
              <Button
                variant={filter === 'listed' ? 'default' : 'outline'}
                onClick={() => setFilter('listed')}
                size="sm"
                className={filter === 'listed' ? 'bg-green-600 text-white' : 'bg-gray-700 text-white border-gray-600'}
              >
                Listed ({nfts.filter(nft => nft.isListed).length})
              </Button>
              <Button
                variant={filter === 'unlisted' ? 'default' : 'outline'}
                onClick={() => setFilter('unlisted')}
                size="sm"
                className={filter === 'unlisted' ? 'bg-green-600 text-white' : 'bg-gray-700 text-white border-gray-600'}
              >
                Unlisted ({nfts.filter(nft => !nft.isListed).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid */}
      {filteredNfts.length === 0 ? (
        <Card className="bg-gray-800 border-gray-600">
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
              isConnected={!!account}
              client={client}
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
            client={client}
            nftContract={nftContract}
          />
          <BuyNFTDialog
            nft={selectedNft}
            isOpen={showBuyDialog}
            onClose={() => setShowBuyDialog(false)}
            client={client}
          />
        </>
      )}
    </div>
  );
};

export default NFTMarketplace;
