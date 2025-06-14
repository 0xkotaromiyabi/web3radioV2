import React from 'react';
import {
  useContract,
  useAddress,
  useDisconnect,
  useActiveChainId,
} from "@thirdweb-dev/react";
import { PayEmbed } from "@thirdweb-dev/pay";
import { base } from "@/contexts/W3RTokenContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BuyNFTDialogProps {
  nft: any;
  isOpen: boolean;
  onClose: () => void;
}

const BuyNFTDialog: React.FC<BuyNFTDialogProps> = ({ nft, isOpen, onClose }) => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const chainId = useActiveChainId();
  const { contract } = useContract("0x7a050911ca145a00959900d3847a9dd7f7364891");
  const client = {
    clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {nft.name}</DialogTitle>
          <DialogDescription>
            Choose your payment method to purchase this NFT.
          </DialogDescription>
        </DialogHeader>

          {/* ETH Payment Option */}
          <PayEmbed
            client={client}
            theme="dark"
            payOptions={{
              mode: "direct_payment",
              paymentInfo: {
                amount: "0.01",
                chain: base,
                sellerAddress: "0x242DfB7849544eE242b2265cA7E585bdec60456B",
              },
              metadata: {
                name: nft.name,
                description: nft.description || "NFT from web3radio",
                image: nft.image,
              },
            }}
          />

          <div className="text-center text-gray-400 text-sm my-4">
            Or pay with USDC
          </div>

          {/* USDC Payment Option */}
          <PayEmbed
            client={client}
            theme="dark"
            payOptions={{
              mode: "direct_payment",
              paymentInfo: {
                amount: "25",
                chain: base,
                token: {
                  address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
                  name: "USD Coin",
                  symbol: "USDC",
                },
                sellerAddress: "0x242DfB7849544eE242b2265cA7E585bdec60456B",
              },
              metadata: {
                name: nft.name,
                description: nft.description || "NFT from web3radio",
                image: nft.image,
              },
            }}
          />
      </DialogContent>
    </Dialog>
  );
};

export default BuyNFTDialog;
