import React from 'react';
import { useAudio } from '@/contexts/AudioProvider';
import PremiumPlayer from './PremiumPlayer';
import StationSelector from './StationSelector';
import EventsTicker from './EventsTicker';
import CryptoPriceTicker from './CryptoPriceTicker';
import AudioVisualizer from './AudioVisualizer';
import { useIsMobile } from '@/hooks/use-mobile';

const RadioPlayer = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const {
    isPlaying,
    volume,
    currentStation,
    currentSong,
    togglePlay,
    setVolume,
    changeStation
  } = useAudio();

  const isMobile = useIsMobile();

  const stationNames: Record<string, string> = {
    web3: 'Web3 Radio',
    ozradio: 'Oz Radio Jakarta',
    iradio: 'i-Radio',
    female: 'Female Radio',
    delta: 'Delta FM',
    prambors: 'Prambors FM'
  };

  return (
    <div className="space-y-6">
      {/* Station Selector */}
      <StationSelector
        currentStation={currentStation}
        onStationChange={changeStation}
      />

      {/* Events Ticker */}
      <EventsTicker isMobile={isMobile} />

      {/* Visualizer & Ticker */}
      <div className="p-0 space-y-4">
        <CryptoPriceTicker isMobile={isMobile} />

        {/* PREMIUM PLAYER */}
        <PremiumPlayer />

        <AudioVisualizer />
      </div>

    </div>
    </div >
  );
};

export default RadioPlayer;
