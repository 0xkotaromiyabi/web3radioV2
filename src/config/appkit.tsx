import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import {
    base,
    mainnet,
    sepolia,
    arbitrum,
    optimism,
    polygon,
    bsc,
    lisk,
    solana,
    solanaDevnet,
} from '@reown/appkit/networks';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// 1. Project ID
const projectId = '436eaacb5d6ac40e778902daf08eb741';

// 2. Define all supported networks
const networks = [
    mainnet,
    base,
    arbitrum,
    optimism,
    polygon,
    bsc,
    lisk,
    sepolia,
    solana,
    solanaDevnet,
] as const;

import { http } from 'viem';

// 3. Set up Wagmi adapter (handles EVM chains)
const wagmiAdapter = new WagmiAdapter({
    networks: [mainnet, base, arbitrum, optimism, polygon, bsc, lisk, sepolia],
    projectId,
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
        [optimism.id]: http(),
        [polygon.id]: http(),
        [bsc.id]: http(),
        [lisk.id]: http(),
        [sepolia.id]: http(),
    }
});

// Custom Solana configuration with explicit RPC
const solanaWithRpc = {
    ...solana,
    rpcUrls: {
        default: { http: ['https://api.mainnet-beta.solana.com'] },
        public: { http: ['https://api.mainnet-beta.solana.com'] }
    }
};

// 4. Set up Solana adapter
const solanaAdapter = new SolanaAdapter({
    wallets: []
});

// 5. Create the AppKit modal
createAppKit({
    adapters: [wagmiAdapter, solanaAdapter],
    networks: [mainnet, base, arbitrum, optimism, polygon, bsc, lisk, sepolia, solanaWithRpc, solanaDevnet],
    projectId,
    metadata: {
        name: 'Web3Radio',
        description: 'Web3Radio - Decentralized Radio Station',
        url: 'https://webthreeradio.xyz',
        icons: ['https://webthreeradio.xyz/web3radio-logo.png'],
    },
    features: {
        analytics: true,
        email: true,
        socials: ['google', 'x', 'discord', 'farcaster'],
        emailShowWallets: true,
        swaps: true,
        onramp: true,
    },
});

// 6. Create query client
const queryClient = new QueryClient();

// 7. Export AppKit Provider wrapper
export function AppKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export { wagmiAdapter };
