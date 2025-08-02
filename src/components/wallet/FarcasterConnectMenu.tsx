import React from "react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { ConnectButton, PayEmbed } from "thirdweb/react";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WalletConnectButton from "../marketplace/WalletConnectButton";

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const TOKEN_ADDRESS = "0x18bc5bcc660cf2b9ce3cd51a404afe1a0cbd3c22";

const FarcasterConnectMenu = () => {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <Card className="p-4 bg-[#1a1a1a] border-[#444]">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Connect with Base App</h3>
            <WalletConnectButton />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-[#1a1a1a] to-[#333] border-[#555]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Buy IDRX Token</h3>
              <Badge variant="outline" className="bg-[#111] text-blue-400 border-[#333]">
                Base Chain
              </Badge>
            </div>
            <div className="text-xs text-gray-400 mb-3">
              Purchase IDRX tokens directly on Base network
            </div>
            <div className="w-full rounded-lg overflow-hidden">
              <PayEmbed
                client={client}
                theme="dark"
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-[#1a1a1a] border-[#444]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Connected to Base App</h3>
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
            Connected
          </Badge>
        </div>
        <div className="text-xs text-gray-400">
          Address: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>
      
      <Card className="p-4 bg-gradient-to-r from-[#1a1a1a] to-[#333] border-[#555] mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Buy IDRX Token</h3>
            <Badge variant="outline" className="bg-[#111] text-blue-400 border-[#333]">
              Base Chain
            </Badge>
          </div>
          <div className="text-xs text-gray-400 mb-3">
            Purchase IDRX tokens directly on Base network
          </div>
          <div className="w-full rounded-lg overflow-hidden">
            <PayEmbed
              client={client}
              theme="dark"
            />
          </div>
        </div>
      </Card>
    </Card>
  );
};

export default FarcasterConnectMenu;
