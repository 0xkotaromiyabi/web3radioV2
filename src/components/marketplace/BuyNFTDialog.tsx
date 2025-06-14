
import React, { useState } from 'react';
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
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
  client: any;
}

const BuyNFTDialog = ({ nft, isOpen, onClose, contract }: BuyNFTDialogProps) => {
  const [isMinting, setIsMinting] = useState(false);
  const account = useActiveAccount();
  const { toast } = useToast();
  const { mutate: sendTransaction } = useSendTransaction();

  const handleMintNFT = async () => {
    if (!account || !contract) {
      toast({
        title: "Error",
        description: "Wallet not connected or contract not available",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    
    try {
      console.log("Minting NFT for:", {
        address: account.address,
        tokenId: nft.tokenId,
        quantity: 1,
      });

      // Prepare the mint transaction using thirdweb v5
      const transaction = prepareContractCall({
        contract,
        method: "function mintTo(address to, uint256 tokenId, uint256 amount)",
        params: [account.address, BigInt(nft.tokenId), BigInt(1)],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `Successfully minted ${nft.name}`,
          });
          onClose();
          setIsMinting(false);
        },
        onError: (error) => {
          console.error("Minting failed:", error);
          toast({
            title: "Minting Failed",
            description: "There was an error minting the NFT. Please try again.",
            variant: "destructive",
          });
          setIsMinting(false);
        },
      });
    } catch (error) {
      console.error("Minting failed:", error);
      toast({
        title: "Minting Failed",
        description: "There was an error minting the NFT. Please try again.",
        variant: "destructive",
      });
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
              disabled={isMinting || !account}
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
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
