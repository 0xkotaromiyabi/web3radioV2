
import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";

const WalletConnectButton = () => {
  return (
    <ConnectWallet
      theme="dark"
      btnTitle="Connect Wallet"
      modalTitle="Choose your wallet"
      modalSize="wide"
    />
  );
};

export default WalletConnectButton;
