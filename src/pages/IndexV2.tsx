import React from 'react';
import { useAudio } from '@/contexts/AudioProvider';
import NavBar from '@/components/navigation/NavBar';
import { STATIONS } from '@/data/stations';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import UnifiedTipComponent from '@/components/wallet/UnifiedTipComponent';
import CryptoTicker from '@/components/ui/CryptoTicker';
import { MessageSquare, Volume2, Volume1, VolumeX, Share2 } from 'lucide-react';
import ListeningTimeTracker from '@/components/radio/ListeningTimeTracker';
import { ShareModal } from '@/components/radio/ShareModal';
import { Capacitor } from '@capacitor/core';
import PremiumPlayer from '@/components/radio/PremiumPlayer';
import Web3About from '@/components/radio/Web3About';

const IndexV2 = () => {
  const { isPlaying, volume, togglePlay, setVolume, currentStation, currentSong, changeStation } = useAudio();
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Unified AppKit State
  const { open: openAppKit } = useAppKit();
  const { address, isConnected, caipAddress } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();

  const stationData = STATIONS.find(s => s.id === currentStation) || STATIONS[0];

  // Detect if connected to Solana or EVM
  const isSolana = caipAddress && String(caipAddress).startsWith('solana:');
  const networkName = caipNetwork?.name || 'Unknown';

  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-y-auto text-white flex flex-col items-center">
      <NavBar />

      <div className="flex flex-col items-center mb-12 px-4 mt-20 md:mt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tighter text-white/90">WEB3RADIO</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-2">Decentralized Radio Station</p>
        </div>
      </div>

      {/* Crypto Price Ticker */}
      <CryptoTicker />

      <div className="w-full max-w-6xl px-4 py-8 relative z-10 flex justify-center">
        <PremiumPlayer />
      </div>

      <div className="w-full relative z-10">
        <Web3About />
      </div>

      {/* Share Modal Popup */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentSong={currentSong || null}
        stationName={stationData.name}
      />
    </div>
  );
};

export default IndexV2;
