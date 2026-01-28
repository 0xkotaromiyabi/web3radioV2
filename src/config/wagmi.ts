import { http, createConfig } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';

// WalletConnect Project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '436eaacb5d6ac40e778902daf08eb741';

export const config = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    injected(), // MetaMask, etc
    coinbaseWallet({
      appName: 'Web3Radio',
      preference: 'smartWalletOnly', // Use smart wallet by default
    }),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
});
