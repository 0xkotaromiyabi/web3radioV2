import React from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WalletConnectButton from "../marketplace/WalletConnectButton";
import TipComponent from "./TipComponent";


const FarcasterConnectMenu = () => {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 max-w-md mx-auto">
        <Card className="w-full p-4 sm:p-6 bg-[#1a1a1a] border-[#444]">
          <div className="space-y-4 text-center">
            <h3 className="text-base sm:text-lg font-bold text-white">Connect with Base App</h3>
            <div className="flex justify-center">
              <WalletConnectButton />
            </div>
          </div>
        </Card>
        
        <TipComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 max-w-md mx-auto">
      <Card className="w-full p-4 sm:p-6 bg-[#1a1a1a] border-[#444]">
        <div className="space-y-4 text-center">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white">Connected to Base App</h3>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 self-center sm:self-auto">
              Connected
            </Badge>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
      </Card>
      
      <TipComponent />
    </div>
  );
};

export default FarcasterConnectMenu;
