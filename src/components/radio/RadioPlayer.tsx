
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
      description: 'Main station with crypto news and music'
    },
    { 
      id: 'lofi', 
      name: 'Crypto LoFi', 
      url: 'https://stream.web3radio.xyz/lofi',
      description: 'Relaxing beats for coding and trading'
    },
    { 
      id: 'news', 
      name: 'Crypto News 24/7', 
      url: 'https://stream.web3radio.xyz/news',
      description: 'Latest crypto and blockchain news'
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
