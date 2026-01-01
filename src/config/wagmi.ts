
import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { farcasterFrame as miniAppConnector } from '@farcaster/frame-wagmi-connector'

export const config = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    miniAppConnector()
  ]
})
