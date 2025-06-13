
import React, { useState } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart } from "lucide-react";

interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: string;
  price?: string;
}

interface BuyNFTDialogProps {
  nft: NFTData;
  isOpen: boolean;
  onClose: () => void;
  contract: any;
}

const BuyNFTDialog = ({ nft, isOpen, onClose, contract }: BuyNFTDialogProps) => {
  const [isMinting, setIsMinting] = useState(false);
  const address = useAddress();
  const { toast } = useToast();

  const handleMintNFT = async () => {
    if (!address || !contract) {
      toast({
        title: "Error",
        description: "Wallet not connected or contract not available",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    
    try {
      // For now, we'll use direct mint. In production, you would:
      // 1. Call your backend to generate mint signature
      // 2. Use contract.erc1155.signature.mint(signature)
      
      // Simulated signature-based mint process
      console.log("Generating mint signature for:", {
        address,
        tokenId: nft.tokenId,
        quantity: 1,
        metadata: {
          name: nft.name,
          description: nft.description,
          image: nft.image
        }
      });

      // For demo purposes, we'll use claim instead of signature mint
      // In production, replace this with signature-based minting
      await contract.erc1155.claim(nft.tokenId, 1);

      toast({
        title: "Success!",
        description: `Successfully minted ${nft.name}`,
      });
      
      onClose();
    } catch (error) {
      console.error("Minting failed:", error);
      toast({
        title: "Minting Failed",
        description: "There was an error minting the NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Mint NFT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* NFT Preview */}
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* NFT Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{nft.name}</h3>
            <p className="text-sm text-gray-400">{nft.description}</p>
            
            <div className="flex items-center justify-between">
              <Badge className="bg-green-600">Token ID: {nft.tokenId}</Badge>
              {nft.price && (
                <span className="text-lg font-bold text-green-400">
                  {nft.price} ETH
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isMinting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMintNFT}
              disabled={isMinting || !address}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isMinting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Mint NFT
                </ShoppingCart>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
