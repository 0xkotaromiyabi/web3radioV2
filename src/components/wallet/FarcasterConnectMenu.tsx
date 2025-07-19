
import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Check } from 'lucide-react';

const FarcasterConnectMenu = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <Card className="bg-[#222] border-[#444]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-white text-sm font-medium">Connected!</span>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Farcaster
            </Badge>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <span>Address: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#222] border-[#444]">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Farcaster Wallet</span>
          </div>
          <p className="text-xs text-gray-400">
            Connect your Farcaster wallet to earn rewards
          </p>
          <Button
            onClick={() => connect({ connector: connectors[0] })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Connect Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarcasterConnectMenu;
