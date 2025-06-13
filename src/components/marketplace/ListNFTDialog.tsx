
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

interface ListNFTDialogProps {
  nft: NFTData;
  isOpen: boolean;
  onClose: () => void;
  client: any;
  nftContract: any;
}

const ListNFTDialog = ({ nft, isOpen, onClose, client, nftContract }: ListNFTDialogProps) => {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
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

    if (!quantity || parseInt(quantity) <= 0 || parseInt(quantity) > Number(nft.supply)) {
      toast({
        title: "Invalid quantity",
        description: `Please enter a quantity between 1 and ${nft.supply}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsListing(true);
      
      // TODO: Implement actual listing with thirdweb marketplace
      // This requires the marketplace contract to be deployed first
      // Example:
      // import { createListing } from "thirdweb/extensions/marketplace";
      // const transaction = createListing({
      //   contract: marketplaceContract,
      //   assetContractAddress: nftContract.address,
      //   tokenId: nft.tokenId,
      //   quantity: BigInt(quantity),
      //   currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      //   pricePerToken: parseEther(price),
      //   startTimestamp: new Date(),
      //   endTimestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      // });
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "NFT Listed Successfully",
        description: `${nft.name} has been listed for ${price} ETH`,
      });
      
      setPrice('');
      setQuantity('1');
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
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-white">List NFT for Sale</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set a price and quantity for {nft.name} to list it on the marketplace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* NFT Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
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
              <p className="text-sm text-gray-400">Available: {nft.supply.toString()}</p>
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm text-gray-300">
              Price per NFT (ETH)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              min="0"
              step="0.0001"
            />
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm text-gray-300">
              Quantity to List
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              min="1"
              max={Number(nft.supply)}
            />
            <p className="text-xs text-gray-400">
              Maximum: {nft.supply.toString()}
            </p>
          </div>

          {/* Total Value */}
          {price && quantity && (
            <div className="p-3 bg-gray-700 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Total Value:</span>
                <span className="text-green-400 font-bold">
                  {(parseFloat(price) * parseInt(quantity)).toFixed(4)} ETH
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            disabled={isListing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleList} 
            disabled={isListing || !price || !quantity}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isListing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Listing...
              </>
            ) : (
              'List NFT'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListNFTDialog;
