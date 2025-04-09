
import React, { useState, useEffect, useRef } from 'react';
import WalletConnection from './wallet/WalletConnection';
import RadioControls from './radio/RadioControls';
import StationSelector from './radio/StationSelector';
import SongInfo from './radio/SongInfo';
import CryptoPanicNews from './news/CryptoPanicNews';
import SocialShare from './social/SocialShare';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentStation, setCurrentStation] = useState('web3');
  const [currentSong, setCurrentSong] = useState<{ title: string; artist: string; album: string } | null>(null);
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const stations = {
    web3: 'https://web3radio.cloud/stream',
    venus: 'https://stream.zeno.fm/3wiuocujuobtv',
    iradio: 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
    female: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
    delta: 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3'
  };

  const stationRadioBoxMap = {
    female: 'https://onlineradiobox.com/id/female/',
    delta: 'https://onlineradiobox.com/id/deltafm/',
    iradio: 'https://onlineradiobox.com/id/ijakarta/'
  };

  // Function to fetch current playing song from OnlineRadioBox
  const fetchOnlineRadioBoxInfo = async (station: string) => {
    setIsLoadingSong(true);
    
    try {
      // Use a CORS proxy if needed in production
      const corsProxy = '';
      let radioBoxUrl = '';
      
      if (station === 'female') {
        radioBoxUrl = `${corsProxy}https://onlineradiobox.com/id/female/`;
      } else if (station === 'delta') {
        radioBoxUrl = `${corsProxy}https://onlineradiobox.com/id/deltafm/`;
      } else if (station === 'iradio') {
        radioBoxUrl = `${corsProxy}https://onlineradiobox.com/id/ijakarta/`;
      } else {
        // For stations without OnlineRadioBox support
        setDefaultSongInfo(station);
        return;
      }
      
      // For development, we can mock the response since we can't do a direct fetch due to CORS
      // In production, you would use a CORS proxy or server-side API
      mockOnlineRadioBoxResponse(station);
      
    } catch (error) {
      console.error('Error fetching song info:', error);
      setDefaultSongInfo(station);
    }
  };
  
  // Mock function for development (simulates external API response)
  const mockOnlineRadioBoxResponse = (station: string) => {
    // Simulate network delay
    setTimeout(() => {
      let songInfo;
      
      if (station === 'female') {
        songInfo = {
          title: 'Beautiful Life',
          artist: 'Dipha Barus feat. Afgan',
          album: 'Female Radio Top Hits'
        };
      } else if (station === 'delta') {
        songInfo = {
          title: 'Kau Yang Sempurna',
          artist: 'Rizky Febian',
          album: 'Delta FM Showcase'
        };
      } else if (station === 'iradio') {
        songInfo = {
          title: 'Pergilah Kasih',
          artist: 'Chrisye',
          album: 'i-Radio Indonesian Hits'
        };
      } else {
        setDefaultSongInfo(station);
        return;
      }
      
      setCurrentSong(songInfo);
      setIsLoadingSong(false);
    }, 1000);
  };
  
  // Set default song info when no metadata is available
  const setDefaultSongInfo = (station: string) => {
    const stationInfo = {
      title: 'Live Broadcast',
      artist: station === 'web3' ? 'Web3 Radio' :
              station === 'venus' ? 'Venus Radio' :
              station === 'iradio' ? 'i-Radio' :
              station === 'female' ? 'Female Radio' : 'Delta FM',
      album: 'Live Stream'
    };
    
    setCurrentSong(stationInfo);
    setIsLoadingSong(false);
  };

  useEffect(() => {
    const audio = new Audio(stations[currentStation]);
    audioRef.current = audio;
    audio.volume = volume / 100;
    
    // Setup metadata tracking
    audio.addEventListener('play', () => {
      // Fetch song info when audio starts playing
      fetchOnlineRadioBoxInfo(currentStation);
    });
    
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

  const refreshSongInfo = () => {
    fetchOnlineRadioBoxInfo(currentStation);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setCurrentSong(null);
      } else {
        audioRef.current.play()
          .then(() => {
            fetchOnlineRadioBoxInfo(currentStation);
            toast({
              title: "Radio playing",
              description: `Now playing ${
                currentStation === 'web3' ? 'Web3 Radio' :
                currentStation === 'venus' ? 'Venus Radio' :
                currentStation === 'iradio' ? 'i-Radio' :
                currentStation === 'female' ? 'Female Radio' : 'Delta FM'
              }`,
            });
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            toast({
              title: "Playback error",
              description: "There was an error playing this station. Please try again.",
              variant: "destructive"
            });
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeStation = (station: 'web3' | 'venus' | 'iradio' | 'female' | 'delta') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentStation(station);
    setIsPlaying(false);
    setCurrentSong(null);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,cardano,polkadot&vs_currencies=usd"
        );
        const data = await response.json();
        const prices = [
          `BTC $${data.bitcoin.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `ETH $${data.ethereum.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `SOL $${data.solana.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,  
          `BNB $${data.binancecoin.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `ADA $${data.cardano.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `DOT $${data.polkadot.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        ];
        setCryptoPrices(prices);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);

    return () => clearInterval(interval);
  }, []);
  
  const upcomingPrograms = [
    "10:00 - Crypto Talk with Kotarominami",
    "12:00 - Web3 News Update",
    "14:00 - NFT Market Analysis",
    "16:00 - DeFi Deep Dive",
    "18:00 - Blockchain Technology Hour"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
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
      
      {/* Song Information Display */}
      <SongInfo 
        currentSong={currentSong}
        isLoading={isLoadingSong}
        currentStation={currentStation}
        onRefresh={refreshSongInfo}
      />

      {/* Winamp-style container */}
      <div className="bg-[#232323] rounded-lg shadow-xl border border-[#444] select-none">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333] p-1 flex justify-between items-center">
          <div className="text-[#00ff00] text-xs font-bold">
            {currentStation === 'web3' ? 'Web3 Radio' : 
             currentStation === 'venus' ? 'Venus Radio' : 
             currentStation === 'iradio' ? 'i-Radio' : 
             currentStation === 'female' ? 'Female Radio' : 'Delta FM'}
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-white text-xs">_</button>
            <button className="text-gray-400 hover:text-white text-xs">□</button>
            <button className="text-gray-400 hover:text-white text-xs">×</button>
          </div>
        </div>

        {/* Main display */}
        <div className="bg-[#000] p-4">
          {/* Program Schedule - adjust height on mobile */}
          <div className={`h-${isMobile ? '12' : '8'} bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden`}>
            <div className="animate-marquee whitespace-nowrap">
              {upcomingPrograms.map((program, index) => (
                <span key={index} className="text-[#00ff00] font-mono text-sm mx-4">
                  📻 {program}
                </span>
              ))}
            </div>
          </div>

          {/* Crypto Prices - adjust height on mobile */}
          <div className={`h-${isMobile ? '12' : '8'} bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden`}>
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

        <WalletConnection isPlaying={isPlaying} />
      </div>

      {/* Social Share Buttons */}
      <SocialShare />

      {/* CryptoPanic News Section */}
      <CryptoPanicNews />
    </div>
  );
};

export default Radio;
