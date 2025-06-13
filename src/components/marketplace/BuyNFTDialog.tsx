
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, AlertTriangle } from "lucide-react";

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

interface BuyNFTDialogProps {
  nft: NFTData;
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

const BuyNFTDialog = ({ nft, isOpen, onClose, client }: BuyNFTDialogProps) => {
  const [quantity, setQuantity] = useState('1');
  const [isBuying, setIsBuying] = useState(false);
  const { toast } = useToast();

  const handleBuy = async () => {
    if (!nft.price || !quantity || parseInt(quantity) <= 0) return;

    try {
      setIsBuying(true);
      
      // TODO: Implement actual buying with thirdweb marketplace
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const totalPrice = (parseFloat(nft.price) * parseInt(quantity)).toFixed(4);
      toast({
        title: "NFT Purchased Successfully",
        description: `You've successfully purchased ${quantity}x ${nft.name} for ${totalPrice} ETH`,
      });
      
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "There was an error purchasing this NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  const totalPrice = nft.price ? (parseFloat(nft.price) * parseInt(quantity || '1')).toFixed(4) : '0';
  const marketplaceFee = parseFloat(totalPrice) * 0.025; // 2.5% fee
  const finalTotal = (parseFloat(totalPrice) + marketplaceFee).toFixed(4);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Purchase NFT
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Confirm your purchase of {nft.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* NFT Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
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

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm text-gray-300">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              min="1"
            />
          </div>

          {/* Price Details */}
          <div className="space-y-3 p-3 bg-gray-900 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Price per NFT</span>
              <span className="text-green-400 font-bold">{nft.price} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Quantity</span>
              <span className="text-white">{quantity || '1'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white">{totalPrice} ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Marketplace fee (2.5%)</span>
              <span className="text-gray-400">{marketplaceFee.toFixed(4)} ETH</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between items-center font-bold">
              <span className="text-white">Total</span>
              <span className="text-green-400 text-lg">{finalTotal} ETH</span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-200 font-medium">Important</p>
              <p className="text-yellow-300/80">
                This transaction is irreversible. Make sure you want to purchase this NFT.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            disabled={isBuying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBuy} 
            disabled={isBuying || !quantity || parseInt(quantity) <= 0}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isBuying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
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
