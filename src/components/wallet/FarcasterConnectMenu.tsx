import React from "react";
import { useWallet } from "@/hooks/useWallet";
import WalletConnectButton from "../marketplace/WalletConnectButton";

const FarcasterConnectMenu = () => {
  const { isConnected } = useWallet();

  // Only show wallet connect button when not connected
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center">
        <WalletConnectButton />
      </div>
    );
  }

  // When connected, just return the wallet button (which shows connected state)
  return (
    <div className="flex items-center justify-center">
      <WalletConnectButton />
    </div>
  );
};

export default FarcasterConnectMenu;


