import React from "react";
import { useAccount } from "wagmi";
import WalletConnectButton from "../marketplace/WalletConnectButton";

const FarcasterConnectMenu = () => {
  const { isConnected } = useAccount();

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


