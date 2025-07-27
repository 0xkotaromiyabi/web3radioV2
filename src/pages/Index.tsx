
import Radio from '@/components/Radio';
import NavBar from '@/components/navigation/NavBar';
import { ThirdwebProvider } from "thirdweb/react";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useCallback } from 'react';
import { useMiniKitContext } from '@/hooks/useMiniKitContext';
import Particles from 'react-particles';
import type { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';


const Index = () => {
  const { isFrameReady, user, client, location } = useMiniKitContext();
  
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded:', container);
  }, []);

  return (
    <ThirdwebProvider>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
          <Particles
            id="tsparticles"
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
          <div className="relative z-10 flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8">
              <Radio />
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </ThirdwebProvider>
  );
};

export default Index;
