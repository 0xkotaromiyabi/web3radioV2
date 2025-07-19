
import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const FarcasterConnectMenu = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <Card className="p-3 bg-[#222] border-[#444]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Farcaster Wallet</span>
            <Badge variant="outline" className="bg-[#111] text-green-400 border-[#333]">
              Connected
            </Badge>
          </div>
          <div className="text-xs text-gray-400">
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 bg-[#222] border-[#444]">
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Farcaster Wallet</h3>
        <Button
          type="button"
          onClick={() => connect({ connector: connectors[0] })}
          size="sm"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Connect Farcaster Wallet
        </Button>
        <p className="text-xs text-gray-400 text-center">
          Connect your Farcaster wallet to earn rewards and access premium features
        </p>
      </div>
    </Card>
  );
};

export default FarcasterConnectMenu;
