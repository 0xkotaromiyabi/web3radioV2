
import Radio from '@/components/Radio';
import NavBar from '@/components/navigation/NavBar';
import { useCallback } from 'react';
import { useMiniKitContext } from '@/hooks/useMiniKitContext';

const Index = () => {
  const { isFrameReady, user, client, location } = useMiniKitContext();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-x-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <Radio />

          <div className="flex justify-center mt-12 mb-8">
            <a
              href="/web3radio-extension.zip"
              download
              className="group relative inline-flex items-center gap-3 px-8 py-3 bg-black/50 hover:bg-black/80 border border-green-500/30 hover:border-green-500 rounded-full transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-full bg-green-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
              <img src="/web3radio-logo.png" alt="Logo" className="w-6 h-6 rounded" />
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Get the Extension</span>
                <span className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">Download for Chrome/Brave</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
