
import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const THIRDWEB_PROJECT_ID = "prj_cmbp08mgv018saj0k1galvt3w";

const FarcasterConnectMenu = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div className="space-y-3">
        <Card className="p-3 bg-[#222] border-[#444]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Base Wallet</span>
              <Badge variant="outline" className="bg-[#111] text-green-400 border-[#333]">
                Connected
              </Badge>
            </div>
            <div className="text-xs text-gray-400">
              Address: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
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
            <div className="w-full rounded-lg overflow-hidden border border-[#444]">
              <iframe
                src={`https://embed.thirdweb.com/buy?clientId=${client.clientId}&projectId=${THIRDWEB_PROJECT_ID}&chainId=8453&tokenAddress=0x18bc5bcc660cf2b9ce3cd51a404afe1a0cbd3c22&amount=0.002&seller=0x0000000000000000000000000000000000000000&currency=USD&theme=dark&primaryColor=%2300ff00`}
                width="100%"
                height="500"
                style={{ border: 'none' }}
                className="bg-[#000]"
                loading="lazy"
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="p-3 bg-[#222] border-[#444]">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Base App</h3>
          <Button
            type="button"
            onClick={() => connect({ connector: connectors[0] })}
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Connect with Base App
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Connect your Base wallet to earn rewards and access premium features
          </p>
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
          <div className="w-full rounded-lg overflow-hidden border border-[#444]">
            <iframe
              src={`https://embed.thirdweb.com/buy?clientId=${client.clientId}&projectId=${THIRDWEB_PROJECT_ID}&chainId=8453&tokenAddress=0x18bc5bcc660cf2b9ce3cd51a404afe1a0cbd3c22&amount=0.002&seller=0x0000000000000000000000000000000000000000&currency=USD&theme=dark&primaryColor=%2300ff00`}
              width="100%"
              height="500"
              style={{ border: 'none' }}
              className="bg-[#000]"
              loading="lazy"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FarcasterConnectMenu;
