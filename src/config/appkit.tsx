import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, mainnet } from '@reown/appkit/networks';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// 1. Get projectId from environment
const projectId = '436eaacb5d6ac40e778902daf08eb741';

// 2. Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
    networks: [base, mainnet],
    projectId,
});

// 3. Create the AppKit modal
createAppKit({
    adapters: [wagmiAdapter],
    networks: [base, mainnet],
    projectId,
    metadata: {
        name: 'Web3Radio',
        description: 'Web3Radio - IDRX Buy & Tip Platform',
        url: 'https://web3radio.app', // Update with your domain
        icons: ['https://web3radio.app/icon.png'], // Update with your icon
    },
    features: {
        analytics: true,
        email: true,
        socials: ['google', 'x', 'discord', 'farcaster'],
        emailShowWallets: true,
        swaps: true, // Enable Swaps
        onramp: true, // Enable OnRamp
    },
});

// 4. Create query client
const queryClient = new QueryClient();

// 5. Export AppKit Provider wrapper
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
