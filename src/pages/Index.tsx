
import Radio from '@/components/Radio';
import NavBar from '@/components/navigation/NavBar';
import { ThirdwebProvider } from "thirdweb/react";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useCallback } from 'react';
import Particles from 'react-particles';
import type { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

const Index = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded:', container);
  }, []);

  return (
    <ThirdwebProvider>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-0 relative">
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
          <div className="relative z-10 flex flex-col">
            <NavBar />
            <div className="container py-12">
              <Radio />
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </ThirdwebProvider>
  );
};

export default Index;
