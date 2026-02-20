import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import {
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
  bsc,
  sepolia,
  solana,
} from '@reown/appkit/networks'
import { http } from 'viem'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const projectId = import.meta.env.VITE_WC_PROJECT_ID || '436eaacb5d6ac40e778902daf08eb741'
const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY
const solanaRpc =
  import.meta.env.VITE_SOLANA_RPC || 'https://rpc.ankr.com/solana'

// ---- EVM ----
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [mainnet, base, arbitrum, optimism, polygon, bsc, sepolia],
  transports: {
    [mainnet.id]: alchemyKey ? http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`) : http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [sepolia.id]: http(),
  },
})

const solanaWithRpc = {
  ...solana,
  rpcUrls: {
    default: { http: [solanaRpc, 'https://solana-rpc.publicnode.com', 'https://api.mainnet-beta.solana.com'] },
    public: { http: [solanaRpc, 'https://solana-rpc.publicnode.com', 'https://api.mainnet-beta.solana.com'] },
  },
}

import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
})

// ---- CREATE APPKIT ----
createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks: [
    mainnet,
    base,
    arbitrum,
    optimism,
    polygon,
    bsc,
    sepolia,
    solanaWithRpc,
  ],
  projectId,
  metadata: {
    name: 'Web3Radio',
    description: 'Web3Radio - Decentralized Radio Station',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://www.webthreeradio.xyz',
    icons: ['https://www.webthreeradio.xyz/web3radio-logo.png'],
  },
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
    email: false,
  },
})

// ---- PROVIDER WRAPPER ----
const queryClient = new QueryClient()

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
