
import React from 'react';
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { base } from "@/contexts/W3RTokenContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, CreditCard } from "lucide-react";

interface BuyNFTDialogProps {
  nft: any;
  isOpen: boolean;
  onClose: () => void;
  contract?: any;
  client?: any;
}

const BuyNFTDialog: React.FC<BuyNFTDialogProps> = ({ nft, isOpen, onClose }) => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {nft.name}</DialogTitle>
          <DialogDescription>
            Choose your payment method to purchase this NFT.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Connection Status */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Wallet Status:</span>
                <Badge variant={account ? "default" : "destructive"}>
                  {account ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              {activeChain && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">Network:</span>
                  <Badge variant="outline" className="bg-gray-700 text-green-400">
                    {activeChain.name}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* NFT Info */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={nft.image || '/placeholder.svg'}
                  alt={nft.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-white">{nft.name}</h3>
                  <p className="text-sm text-gray-400">#{nft.tokenId}</p>
                  <Badge className="bg-purple-600 text-white mt-1">
                    0.01 ETH
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Payment Options</h3>
            
            {/* ETH Payment */}
            <Card className="bg-gray-800 border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-medium text-white">Pay with ETH</div>
                      <div className="text-sm text-gray-400">0.01 ETH</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={!account}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {account ? "Buy Now" : "Connect Wallet"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* USDC Payment */}
            <Card className="bg-gray-800 border-gray-600 hover:border-green-500 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-medium text-white">Pay with USDC</div>
                      <div className="text-sm text-gray-400">25 USDC</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={!account}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {account ? "Buy Now" : "Connect Wallet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {!account && (
            <Card className="bg-yellow-900/20 border-yellow-600">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-yellow-400">
                  Please connect your wallet to purchase this NFT
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
