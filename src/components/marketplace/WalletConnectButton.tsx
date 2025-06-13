
import React from 'react';
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

interface WalletConnectButtonProps {
  client: any;
}

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "discord", "telegram", "email", "passkey"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

const WalletConnectButton = ({ client }: WalletConnectButtonProps) => {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectModal={{ size: "wide" }}
      theme="dark"
    />
  );
};

export default WalletConnectButton;
