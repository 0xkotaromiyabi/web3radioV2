import React, { useState, useEffect, useRef } from 'react';
import WalletConnection from './wallet/WalletConnection';
import RadioControls from './radio/RadioControls';
import StationSelector from './radio/StationSelector';
import CryptoPanicNews from './news/CryptoPanicNews';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentStation, setCurrentStation] = useState('web3');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<string[]>([]);

  const stations = {
    web3: 'https://web3radio.cloud/stream',
    indonesia: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3'
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

    // Fetch prices on component mount and set interval for updates
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
          {/* Program Schedule */}
          <div className="h-8 bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {upcomingPrograms.map((program, index) => (
                <span key={index} className="text-[#00ff00] font-mono text-sm mx-4">
                  📻 {program}
                </span>
              ))}
            </div>
          </div>

          {/* Crypto Prices */}
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

      {/* CryptoPanic News Section */}
      interface NewsItem {
  id: number;
  title: string;
  published_at: string;
  url: string;
  currencies: Array<{ code: string; title: string }>;
  kind: string;
  domain: string;
  votes: { positive: number; negative: number; important: number };
}

interface NewsResponse {
  results: NewsItem[];
}

const CryptoNews = () => {
  const { data, isLoading, error } = useQuery<NewsResponse>({
    queryKey: ["cryptoNews"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://cryptopanic.com/api/v1/posts/?auth_token=a9cc9331ec61b387eb8f535f71426215675b55ec&public=true"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching crypto news:", error);
        throw error;
      }
    },
    refetchInterval: 3600000,
    staleTime: 3600000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="mt-8 text-center text-gray-400">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
        </div>
        <p className="text-sm mt-4">Loading latest crypto news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-400">
        <p>Error loading news. Please try again later.</p>
        <p className="text-sm mt-2">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-[#9b87f5]">Latest Crypto News</h2>
      <div className="space-y-4">
        {data?.results.map((news) => (
          <Card
            key={news.id}
            className="bg-[#221F26] border-gray-700 hover:bg-gray-800 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9b87f5] hover:text-[#8B5CF6] font-medium"
                  >
                    {news.title}
                  </a>
                  <Badge variant="secondary" className="ml-2 bg-gray-700 text-gray-300">
                    {news.domain}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{new Date(news.published_at).toLocaleString()}</span>
                  {news.currencies && news.currencies.length > 0 ? (
                    <div className="flex gap-1">
                      {news.currencies.map((currency) => (
                        <Badge key={currency.code} variant="outline" className="border-gray-600">
                          {currency.code}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="italic text-gray-500">No currencies listed</span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-400">👍 {news.votes.positive ?? 0}</span>
                  <span className="text-red-400">👎 {news.votes.negative ?? 0}</span>
                  <span className="text-yellow-400">⭐ {news.votes.important ?? 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Radio;
export default CryptoNews;
