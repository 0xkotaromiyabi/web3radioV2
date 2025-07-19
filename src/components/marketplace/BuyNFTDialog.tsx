
import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Coins } from "lucide-react";

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
  const [paymentMethod, setPaymentMethod] = useState<'usdc' | 'eth'>('eth');

  // Function to get IPFS image URL
  const getImageUrl = (imageUri: string) => {
    if (!imageUri) return '/placeholder.svg';
    
    if (imageUri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${imageUri.replace('ipfs://', '')}`;
    }
    
    if (imageUri.startsWith('http')) {
      return imageUri;
    }
    
    return '/placeholder.svg';
  };

  // Calculate USDC equivalent (approximate conversion: 1 ETH = ~3700 USDC)
  const usdcPrice = nft.price ? (parseFloat(nft.price) * 3700).toFixed(0) : "18.5";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-between">
            <span className="flex items-center">
              <Coins className="w-5 h-5 mr-2" />
              Purchase NFT
            </span>
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
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-700">
            <img
              src={getImageUrl(nft.image)}
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
            <p className="text-sm text-gray-400 line-clamp-3">{nft.description}</p>
            
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-600">Token ID: {nft.tokenId}</Badge>
              <Badge className="bg-green-600">Available</Badge>
            </div>
          </div>

          {/* Payment Options */}
          <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'usdc' | 'eth')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="eth" className="data-[state=active]:bg-purple-600">
                ETH Payment
              </TabsTrigger>
              <TabsTrigger value="usdc" className="data-[state=active]:bg-blue-600">
                USDC Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="eth" className="mt-4">
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-purple-400">
                  {nft.price || "0.005"} ETH
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  ≈ {usdcPrice} USDC
                </p>
              </div>
              <PayEmbed
                client={client}
                theme="dark"
                payOptions={{
                  mode: "direct_payment",
                  paymentInfo: {
                    amount: nft.price || "0.005",
                    chain: base,
                    sellerAddress: "0x242DfB7849544eE242b2265cA7E585bdec60456B",
                  },
                  metadata: {
                    name: nft.name,
                    image: getImageUrl(nft.image),
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="usdc" className="mt-4">
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-green-400">
                  {usdcPrice} USDC
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  ≈ {nft.price || "0.005"} ETH
                </p>
              </div>
              <PayEmbed
                client={client}
                theme="dark"
                payOptions={{
                  mode: "direct_payment",
                  paymentInfo: {
                    amount: usdcPrice,
                    chain: base,
                    token: getDefaultToken(base, "USDC"),
                    sellerAddress: "0x242DfB7849544eE242b2265cA7E585bdec60456B",
                  },
                  metadata: {
                    name: nft.name,
                    image: getImageUrl(nft.image),
                  },
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
