import React, { useState } from 'react';
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
import { useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther, parseUnits } from 'viem';

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

const BuyNFTDialog = ({ nft, isOpen, onClose }: BuyNFTDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'usdc' | 'eth'>('eth');
  const { address } = useAccount();

  // Seller address from previous file
  const sellerAddress = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
  const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC

  // ETH Payment
  const { sendTransaction, data: ethHash, isPending: isEthPending } = useSendTransaction();

  // USDC Payment
  const { writeContract, data: usdcHash, isPending: isUsdcPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: ethHash || usdcHash,
  });

  // Calculate USDC equivalent (approximate conversion: 1 ETH = ~3700 USDC)
  const usdcPrice = nft.price ? (parseFloat(nft.price) * 3700).toFixed(6) : "18.5";

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

  const handleCreateTransaction = async () => {
    if (!nft.price || !address) return;

    try {
      if (paymentMethod === 'eth') {
        sendTransaction({
          to: sellerAddress,
          value: parseEther(nft.price),
        });
      } else {
        // USDC Transfer
        const erc20Abi = [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ] as const;

        writeContract({
          address: usdcAddress,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [sellerAddress, parseUnits(usdcPrice, 6)], // USDC has 6 decimals
          account: address,
          chain: undefined // AppKit adapter handles chain, but wagmi types might demand it or we can omit if types allow.
          // actually the error said 'chain' is missing. 
          // Let's try to infer or pass 'null' if compatible, or import 'base' and pass it.
        });
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const isPending = isEthPending || isUsdcPending || isConfirming;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-between">
            <span className="flex items-center">
              <Coins className="w-5 h-5 mr-2" />
              Purchase NFT
            </span>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
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
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
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
              <TabsTrigger value="eth" className="data-[state=active]:bg-purple-600">ETH Payment</TabsTrigger>
              <TabsTrigger value="usdc" className="data-[state=active]:bg-blue-600">USDC Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="eth" className="mt-4 text-center">
              <div className="mb-4">
                <span className="text-2xl font-bold text-purple-400">{nft.price || "0.005"} ETH</span>
                <p className="text-xs text-gray-400 mt-1">≈ {usdcPrice} USDC</p>
              </div>
            </TabsContent>

            <TabsContent value="usdc" className="mt-4 text-center">
              <div className="mb-4">
                <span className="text-2xl font-bold text-green-400">{usdcPrice} USDC</span>
                <p className="text-xs text-gray-400 mt-1">≈ {nft.price || "0.005"} ETH</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Transaction Status */}
          {isSuccess ? (
            <div className="p-3 bg-green-900/20 text-green-400 rounded-lg text-center text-sm">
              ✅ Purchase Successful!
            </div>
          ) : (
            <Button
              onClick={handleCreateTransaction}
              disabled={isPending || !address}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isPending ? 'Processing...' : `Pay using ${paymentMethod.toUpperCase()}`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
