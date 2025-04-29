
import React, { useCallback } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import Particles from 'react-particles';
import { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import StationSelector from '@/components/radio/StationSelector';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const Stations = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded:', container);
  }, []);

  // This is just for the display of station buttons, no actual station switching functionality
  const handleStationChange = (station: 'web3' | 'Prambors' | 'iradio' | 'female' | 'delta') => {
    console.log(`Station selected: ${station}`);
  };

  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-0 relative">
          <Particles
            id="tsparticles-stations"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 60,
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: {
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.3,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 3 },
                },
              },
              detectRetina: true,
            }}
            className="absolute inset-0"
          />
          
          <div className="relative z-10 flex flex-col">
            <NavBar />
            <div className="container py-12">
              <h1 className="font-bold text-white text-3xl md:text-4xl lg:text-5xl leading-tight break-words">
                Radio Stations
              </h1>
              <p className="mt-4 text-gray-300 text-base md:text-lg lg:text-xl leading-normal max-w-xl">
                Browse our collection of web3 radio stations.
              </p>
              
              <div className="mt-10 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl text-white font-semibold mb-4">Available Stations</h2>
                <StationSelector 
                  currentStation="Prambors"
                  onStationChange={handleStationChange}
                />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all">
                    <h3 className="text-xl text-white font-medium">Prambors Radio</h3>
                    <p className="mt-2 text-gray-300">Indonesia's #1 Hit Music Station playing the latest hits.</p>
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all">
                    <h3 className="text-xl text-white font-medium">I-Radio</h3>
                    <p className="mt-2 text-gray-300">100% musik Indonesia terbaik.</p>
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all">
                    <h3 className="text-xl text-white font-medium">Female Radio</h3>
                    <p className="mt-2 text-gray-300">Radio for independent women with great music.</p>
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all">
                    <h3 className="text-xl text-white font-medium">Delta FM</h3>
                    <p className="mt-2 text-gray-300">The best music variety from the 80s to today.</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">Click on a station button above to tune in from the main page.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default Stations;
