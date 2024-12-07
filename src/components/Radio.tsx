import React, { useState, useEffect, useRef } from 'react';
import WalletConnection from './wallet/WalletConnection';
import RadioControls from './radio/RadioControls';
import StationSelector from './radio/StationSelector';

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentStation, setCurrentStation] = useState('web3');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<string[]>([]);

  const stations = {
    web3: 'https://web3radio.cloud/stream',
    indonesia: 'https://stream-164.zeno.fm/3wiuocujuobtv'
  };

  useEffect(() => {
    const audio = new Audio(stations[currentStation]);
    audioRef.current = audio;
    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentStation]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeStation = (station: 'web3' | 'indonesia') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentStation(station);
    setIsPlaying(false);
  };

  useEffect(() => {
    const mockPrices = [
      "BTC $50,000",
      "ETH $3,000",
      "BNB $400",
      "ADA $2",
      "DOT $30",
    ];
    setCryptoPrices(mockPrices);
  
    const interval = setInterval(() => {
      const newPrices = mockPrices.map(price => {
        const [symbol, priceString] = price.split(' ');
        const value = parseFloat(priceString.replace(/[$,]/g, '')); // Menghapus simbol $ dan koma
        const change = (Math.random() - 0.5) * 100; // Fluktuasi acak
        return `${symbol} $${(value + change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      });
      setCryptoPrices(newPrices);
    }, 5000);
  
    return () => clearInterval(interval); // Bersihkan interval
  }, []);

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <img 
          src="/web3radio-logo.png" 
          alt="Web3 Radio" 
          className="w-32 h-32 rounded-full shadow-lg"
        />
      </div>
      
      <StationSelector 
        currentStation={currentStation}
        onStationChange={changeStation}
      />

      {/* Winamp-style container */}
      <div className="bg-[#232323] rounded-lg shadow-xl border border-[#444] select-none">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333] p-1 flex justify-between items-center">
          <div className="text-[#00ff00] text-xs font-bold">
            {currentStation === 'web3' ? 'Web3 Radio' : 'Radio Indonesia'}
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-white text-xs">_</button>
            <button className="text-gray-400 hover:text-white text-xs">□</button>
            <button className="text-gray-400 hover:text-white text-xs">×</button>
          </div>
        </div>

        {/* Main display */}
        <div className="bg-[#000] p-4">
          <div className="h-8 bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {cryptoPrices.map((price, index) => (
                <span key={index} className="text-[#00ff00] font-mono text-sm mx-4">
                  {price}
                </span>
              ))}
            </div>
          </div>

          {/* Visualizer */}
          <div className="h-16 bg-[#000] border border-[#333] mb-2">
            <div className="h-full flex items-end justify-around px-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#00ff00]"
                  style={{
                    height: `${Math.random() * 100}%`,
                    transition: 'height 150ms ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <RadioControls 
          isPlaying={isPlaying}
          volume={volume}
          togglePlay={togglePlay}
          setVolume={setVolume}
        />

        <WalletConnection />
      </div>
    </div>
  );
};

export default Radio;
