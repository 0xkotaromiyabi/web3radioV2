
import Radio from '@/components/Radio';
import NavBar from '@/components/navigation/NavBar';
import P5Background from '@/components/background/P5Background';
import { ThirdwebProvider } from "thirdweb/react";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const Index = () => {
  return (
    <ThirdwebProvider>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-0 relative">
          <P5Background />
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
