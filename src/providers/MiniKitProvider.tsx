import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';
import { base } from 'wagmi/chains';

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={import.meta.env.VITE_CDP_CLIENT_API_KEY || "ac0e7bf99e676e48fa3a2d9f4c33089c"}
      chain={base}
    >
      {children}
    </MiniKitProvider>
  );
}