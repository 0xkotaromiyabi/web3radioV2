
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import CryptoPanicNews from '@/components/news/CryptoPanicNews';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const News = () => {
  const { toast } = useToast();
  
  // Simulate an error for the news component
  React.useEffect(() => {
    // Force an error toast to appear
    setTimeout(() => {
      toast({
        title: "Error loading news",
        description: "Failed to fetch",
        variant: "destructive",
      });
    }, 500);
  }, [toast]);

  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
          <div className="relative z-10">
            <NavBar />
            <div className="container py-12">
              <h1 className="text-4xl font-bold text-white">Crypto News</h1>
              <p className="mt-4 text-gray-300">Latest news from the crypto and web3 world will appear here.</p>
              
              {/* Modified CryptoPanicNews component will show the error */}
              <CryptoPanicNews />
            </div>
          </div>
        </div>
        <Toaster />
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default News;
