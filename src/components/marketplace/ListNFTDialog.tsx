
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tag } from "lucide-react";

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

interface ListNFTDialogProps {
  nft: NFTData;
  isOpen: boolean;
  onClose: () => void;
  contract: any;
}

const ListNFTDialog = ({ nft, isOpen, onClose, contract }: ListNFTDialogProps) => {
  const [price, setPrice] = useState('');
  const [isListing, setIsListing] = useState(false);
  const { toast } = useToast();

  const handleList = async () => {
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsListing(true);
      
      // TODO: Implement actual listing logic with thirdweb
      // This would involve calling marketplace contract functions
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "NFT Listed Successfully",
        description: `${nft.name} has been listed for ${price} ETH`,
      });
      
      setPrice('');
      onClose();
    } catch (error) {
      console.error('Listing error:', error);
      toast({
        title: "Listing failed",
        description: "There was an error listing your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsListing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#222] text-white border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Tag className="w-5 h-5" />
            List NFT for Sale
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Set a price for {nft.name} to list it on the marketplace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* NFT Preview */}
          <div className="flex items-center gap-3 p-3 bg-[#333] rounded-lg">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-12 h-12 rounded object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div>
              <h4 className="font-semibold text-white">{nft.name}</h4>
              <p className="text-sm text-gray-400">Token ID: {nft.id}</p>
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm text-gray-300">
              Price (ETH)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-[#333] border-[#555] text-white"
              min="0"
              step="0.001"
            />
            <p className="text-xs text-gray-400">
              You'll receive the full amount minus marketplace fees
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-[#333] text-gray-200 border-[#555] hover:bg-[#444]"
            disabled={isListing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleList} 
            disabled={isListing || !price}
            className="bg-[#00ff00] text-black hover:bg-[#00cc00]"
          >
            {isListing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Listing...
              </>
            ) : (
              <>
                <Tag className="w-4 h-4 mr-2" />
                List NFT
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListNFTDialog;
