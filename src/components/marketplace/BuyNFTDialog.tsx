
import React from 'react';
import { PayEmbed, getDefaultToken } from "thirdweb/react";
import { base } from "thirdweb/chains";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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

const BuyNFTDialog = ({ nft, isOpen, onClose, client }: BuyNFTDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-between">
            Purchase NFT
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
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
                  {nft.price} USDC
                </span>
              )}
            </div>
          </div>

          {/* PayEmbed Component */}
          <div className="pt-4">
            <PayEmbed
              client={client}
              theme="dark"
              payOptions={{
                mode: "direct_payment",
                paymentInfo: {
                  amount: nft.price || "0.01",
                  chain: base,
                  token: getDefaultToken(base, "USDC"),
                  sellerAddress: "0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675",
                },
                metadata: {
                  name: nft.name,
                  image: nft.image,
                },
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
