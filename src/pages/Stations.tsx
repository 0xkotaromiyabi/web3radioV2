
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const Stations = () => {
  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
          <div className="relative z-10">
            <NavBar />
            <div className="container py-12">
              <h1 className="font-bold text-white text-3xl md:text-4xl lg:text-5xl leading-tight break-words">
                Radio Stations
              </h1>
              <p className="mt-4 text-gray-300 text-base md:text-lg lg:text-xl leading-normal max-w-xl">
                Browse our collection of web3 radio stations.
              </p>
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default Stations;

