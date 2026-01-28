
import React from 'react';
import WalletConnection from '../wallet/WalletConnection';
import RadioControls from './RadioControls';
import StationSelector from './StationSelector';
import EventsTicker from './EventsTicker';
import CryptoPriceTicker from './CryptoPriceTicker';
import AudioVisualizer from './AudioVisualizer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Music } from 'lucide-react';
import logo from '@/assets/web3radio-logo.png';
import { useAudio } from '@/contexts/AudioProvider';

const RadioPlayer = () => {
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

      {/* Main Player Card - Frosted Glass Style */}
      <div className="rounded-3xl overflow-hidden backdrop-blur-xl bg-white/70 border border-white/50 shadow-[0_12px_48px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200/30 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Web3Radio"
              className="w-10 h-10 rounded-xl"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{stationNames[currentStation] || currentStation}</h2>
              <p className="text-sm text-gray-500">
                {isPlaying ? 'Playing' : 'Paused'}
              </p>
            </div>
          </div>
          {/* Window Controls - Apple Style */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Visualizer & Ticker */}
        <div className="p-6 space-y-4 bg-white/30">
          <CryptoPriceTicker isMobile={isMobile} />
          <AudioVisualizer />

          {/* Now Playing Info */}
          {currentSong && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              {currentSong.artwork ? (
                <img
                  src={currentSong.artwork}
                  alt={currentSong.album}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-blue-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{currentSong.title}</h3>
                <p className="text-sm text-gray-500 truncate">{currentSong.artist}</p>
                <p className="text-xs text-gray-400 truncate">{currentSong.album}</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="border-t border-gray-200/30 bg-white/40">
          <RadioControls
            isPlaying={isPlaying}
            volume={volume}
            togglePlay={togglePlay}
            setVolume={setVolume}
          />
        </div>

        {/* Wallet Connection */}
        <div className="border-t border-gray-200/30 bg-white/40">
          <WalletConnection isPlaying={isPlaying} />
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
