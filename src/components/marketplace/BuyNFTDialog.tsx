
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
import { X, Coins, Wallet, CreditCard } from "lucide-react";
import { useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import placeholderData from '@/assets/placeholder.svg';

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

  const sellerAddress = "0x242DfB7849544eE242b2265cA7E585bdec60456B";
  const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC

  const { sendTransaction, data: ethHash, isPending: isEthPending } = useSendTransaction();
  const { writeContract, data: usdcHash, isPending: isUsdcPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: ethHash || usdcHash,
  });

  const usdcPrice = nft.price ? (parseFloat(nft.price) * 3700).toFixed(6) : "18.5";

  const getImageUrl = (imageUri: string) => {
    if (!imageUri) return placeholderData;
    if (imageUri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${imageUri.replace('ipfs://', '')}`;
    }
    if (imageUri.startsWith('http')) {
      return imageUri;
    }
    return placeholderData;
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
          args: [sellerAddress, parseUnits(usdcPrice, 6)],
          account: address,
        });
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const isPending = isEthPending || isUsdcPending || isConfirming;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[48px] overflow-hidden border border-[#515044]/5 shadow-2xl animate-in fade-in zoom-in duration-500">
          {/* Close Button Overlay */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 p-2 rounded-full bg-white/50 hover:bg-white text-[#515044]/40 hover:text-[#515044] transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Media */}
            <div className="relative aspect-square md:aspect-auto bg-[#515044]/5">
              <img
                src={getImageUrl(nft.image)}
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = placeholderData; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Right Column: Info & Action */}
            <div className="p-8 space-y-8 flex flex-col justify-between">
              <div>
                <Badge className="bg-[#515044]/5 text-[#515044]/40 hover:bg-[#515044]/10 border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest mb-4">
                  #{nft.tokenId}
                </Badge>
                <h2 className="text-2xl font-bold text-[#515044] tracking-tight">{nft.name}</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-2 leading-relaxed">
                  {nft.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-1 bg-[#515044]/5 rounded-2xl">
                  <button
                    onClick={() => setPaymentMethod('eth')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${paymentMethod === 'eth' ? 'bg-white text-[#515044] shadow-sm' : 'text-[#515044]/30 hover:text-[#515044]/50'}`}
                  >
                    <Coins className="w-3 h-3" />
                    ETH
                  </button>
                  <button
                    onClick={() => setPaymentMethod('usdc')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${paymentMethod === 'usdc' ? 'bg-white text-[#515044] shadow-sm' : 'text-[#515044]/30 hover:text-[#515044]/50'}`}
                  >
                    <CreditCard className="w-3 h-3" />
                    USDC
                  </button>
                </div>

                <div className="text-center bg-[#515044]/2 rounded-[24px] p-6">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30 mb-1">Estimated Price</p>
                  {paymentMethod === 'eth' ? (
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-[#515044]">{nft.price || "0.005"} ETH</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20">≈ {usdcPrice} USDC</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-[#515044]">{usdcPrice} USDC</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20">≈ {nft.price || "0.005"} ETH</p>
                    </div>
                  )}
                </div>

                {isSuccess ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl text-center text-[10px] font-bold uppercase tracking-[0.2em] animate-bounce">
                    Purchase Successful
                  </div>
                ) : (
                  <button
                    onClick={handleCreateTransaction}
                    disabled={isPending || !address}
                    className="w-full bg-[#515044] hover:bg-black text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-[#515044]/10 uppercase text-[10px] tracking-[0.3em] disabled:opacity-20 disabled:grayscale"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing
                      </span>
                    ) : (
                      `Confirm Purchase`
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
