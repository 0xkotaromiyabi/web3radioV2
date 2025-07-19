
import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import RadioDisplay from './RadioDisplay';
import StationSelector from './StationSelector';
import RadioControls from './RadioControls';
import SongInfo from './SongInfo';
import AudioVisualizer from './AudioVisualizer';
import ProgramSchedule from './ProgramSchedule';
import CryptoPriceTicker from './CryptoPriceTicker';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentStation, setCurrentStation] = useState('Web3Radio Main');
  const [currentSong, setCurrentSong] = useState('Welcome to Web3Radio');
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMobile = useIsMobile();

  const stations = [
    { 
      id: 'main', 
      name: 'Web3Radio Main', 
      url: 'https://stream.web3radio.xyz/main',
      description: 'Main station with crypto news and music',
      genre: 'Crypto News & Music'
    },
    { 
      id: 'lofi', 
      name: 'Crypto LoFi', 
      url: 'https://stream.web3radio.xyz/lofi',
      description: 'Relaxing beats for coding and trading',
      genre: 'LoFi Beats'
    },
    { 
      id: 'news', 
      name: 'Crypto News 24/7', 
      url: 'https://stream.web3radio.xyz/news',
      description: 'Latest crypto and blockchain news',
      genre: 'News & Analysis'
    },
    { 
      id: 'defi', 
      name: 'DeFi Deep Dive', 
      url: 'https://stream.web3radio.xyz/defi',
      description: 'In-depth DeFi discussions and tutorials',
      genre: 'Educational'
    },
    { 
      id: 'nft', 
      name: 'NFT Spotlight', 
      url: 'https://stream.web3radio.xyz/nft',
      description: 'NFT artist interviews and marketplace updates',
      genre: 'Art & Culture'
    }
  ];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStationChange = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (station) {
      setCurrentStation(station.name);
      setCurrentSong(`Now playing on ${station.name}`);
      if (audioRef.current) {
        audioRef.current.src = station.url;
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <audio ref={audioRef} preload="none" />
      
      {/* Crypto Price Ticker */}
      <CryptoPriceTicker isMobile={isMobile} />
      
      {/* Program Schedule */}
      <ProgramSchedule isMobile={isMobile} />
      
      {/* Station List Display */}
      <div className="mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-green-500/30 overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 text-center">
            🎧 Web3 Radio Stations
          </h2>
          <div className="grid gap-3 sm:gap-4">
            {stations.map((station) => (
              <div 
                key={station.id} 
                className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  currentStation === station.name
                    ? 'bg-green-500/20 border-green-500/50 shadow-lg'
                    : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:border-green-500/30'
                }`}
                onClick={() => handleStationChange(station.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      {station.name}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mb-1">
                      {station.description}
                    </p>
                    <span className="inline-block px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                      {station.genre}
                    </span>
                  </div>
                  <div className="ml-3">
                    {currentStation === station.name && isPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                        <div className="w-1 h-6 bg-green-400 animate-pulse delay-100"></div>
                        <div className="w-1 h-5 bg-green-300 animate-pulse delay-200"></div>
                      </div>
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${
                        currentStation === station.name ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Radio Interface */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-green-500/30 overflow-hidden">
        <div className="p-4 sm:p-6">
          <RadioDisplay 
            isPlaying={isPlaying}
            currentStation={currentStation}
            currentTrack={currentSong}
          />
          
          <StationSelector 
            stations={stations}
            currentStation={currentStation}
            onStationChange={handleStationChange}
          />
          
          <SongInfo 
            title={currentSong}
            artist="Web3Radio"
            album={currentStation}
          />
          
          {isPlaying && <AudioVisualizer />}
        </div>
        
        <RadioControls
          isPlaying={isPlaying}
          volume={volume}
          togglePlay={togglePlay}
          setVolume={setVolume}
        />
      </div>
    </div>
  );
};

export default RadioPlayer;
