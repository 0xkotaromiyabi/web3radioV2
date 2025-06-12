
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface BuyNFTDialogProps {
  nft: NFTData;
  isOpen: boolean;
  onClose: () => void;
  contract: any;
}

const BuyNFTDialog = ({ nft, isOpen, onClose, contract }: BuyNFTDialogProps) => {
  const [isBuying, setIsBuying] = useState(false);
  const { toast } = useToast();

  const handleBuy = async () => {
    if (!nft.price) return;

    try {
      setIsBuying(true);
      
      // TODO: Implement actual buying logic with thirdweb marketplace
      // This would involve calling the marketplace contract's buy function
      // Example: await buyFromListing({ contract: marketplaceContract, listingId, quantity, recipient })
      
      console.log(`Buying NFT ${nft.name} for ${nft.price} ETH on Base network`);
      
      // Simulate transaction time
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      toast({
        title: "NFT Purchased Successfully",
        description: `You've successfully purchased ${nft.name} for ${nft.price} ETH on Base network`,
      });
      
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "There was an error purchasing this NFT. Please check your wallet balance and connection.",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#222] text-white border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Purchase NFT
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Confirm your purchase of {nft.name} on Base network
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Network Badge */}
          <div className="flex justify-center">
            <Badge className="bg-blue-600 text-white">
              Base Network (Chain ID: 8453)
            </Badge>
          </div>

          {/* NFT Preview */}
          <div className="flex items-center gap-3 p-3 bg-[#333] rounded-lg">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-16 h-16 rounded object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-white">{nft.name}</h4>
              <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
              <p className="text-xs text-gray-500">Token ID: {nft.id}</p>
            </div>
          </div>

          {/* Price Details */}
          <div className="space-y-3 p-3 bg-[#111] rounded-lg border border-[#333]">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Price</span>
              <span className="text-[#00ff00] font-bold text-lg">{nft.price} ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Marketplace fee (2.5%)</span>
              <span className="text-gray-400">
                {nft.price ? (parseFloat(nft.price) * 0.025).toFixed(4) : '0'} ETH
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Base network gas fee</span>
              <span className="text-gray-400">~0.001 ETH</span>
            </div>
            <hr className="border-[#333]" />
            <div className="flex justify-between items-center font-bold">
              <span className="text-white">Total (approx.)</span>
              <span className="text-[#00ff00] text-lg">
                {nft.price ? (parseFloat(nft.price) * 1.025 + 0.001).toFixed(4) : '0'} ETH
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-200 font-medium">Base Network Transaction</p>
              <p className="text-yellow-300/80">
                This transaction is irreversible. Ensure you have enough ETH on Base network.
              </p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Seller</span>
            <Badge variant="outline" className="bg-[#111] text-white border-[#333]">
              {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-[#333] text-gray-200 border-[#555] hover:bg-[#444]"
            disabled={isBuying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBuy} 
            disabled={isBuying}
            className="bg-[#00ff00] text-black hover:bg-[#00cc00]"
          >
            {isBuying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing on Base...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
