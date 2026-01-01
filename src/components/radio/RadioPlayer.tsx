
import React, { useState, useEffect, useRef } from 'react';
import WalletConnection from '../wallet/WalletConnection';
import RadioControls from './RadioControls';
import StationSelector from './StationSelector';
import EventsTicker from './EventsTicker';
import CryptoPriceTicker from './CryptoPriceTicker';
import AudioVisualizer from './AudioVisualizer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';
import { Music, Radio } from 'lucide-react';
import logo from '@/assets/web3radio-logo.png';

interface Song {
  title: string;
  artist: string;
  album: string;
}

interface Playlist {
  [key: string]: Song[];
}

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentStation, setCurrentStation] = useState('web3');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<Playlist>({
    female: [],
    delta: [],
    iradio: [],
    web3: [],
    Venus: [],
    longplayer: []
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const stations: Record<string, string> = {
    web3: 'https://web3radio.cloud/stream',
    Venus: 'https://stream.zeno.fm/3wiuocujuobtv',
    iradio: 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
    female: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
    delta: 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3',
    longplayer: 'http://icecast.spc.org:8000/longplayer'
  };

  const stationNames: Record<string, string> = {
    web3: 'Web3 Radio',
    Venus: 'Venus FM',
    iradio: 'i-Radio',
    female: 'Female Radio',
    delta: 'Delta FM',
    longplayer: 'Longplayer'
  };

  const addToPlaylist = (station: string, song: Song) => {
    if (!song.title || !song.artist) return;

    const existingSongs = playlist[station] || [];
    const isDuplicate = existingSongs.some(
      existing => existing.title === song.title && existing.artist === song.artist
    );

    if (!isDuplicate) {
      setPlaylist(prev => ({
        ...prev,
        [station]: [song, ...existingSongs.slice(0, 19)]
      }));
    }
  };

  const fetchOnlineRadioBoxInfo = async (station: string) => {
    setIsLoadingSong(true);

    try {
      if (!['female', 'delta', 'iradio', 'longplayer'].includes(station)) {
        setDefaultSongInfo(station);
        return;
      }

      mockOnlineRadioBoxResponse(station);
    } catch (error) {
      console.error('Error fetching song info:', error);
      setDefaultSongInfo(station);
    }
  };

  const mockOnlineRadioBoxResponse = (station: string) => {
    setTimeout(() => {
      const songs: Record<string, Song[]> = {
        female: [
          { title: 'Beautiful Life', artist: 'Dipha Barus feat. Afgan', album: 'Female Radio Top Hits' },
          { title: 'Love Story', artist: 'Taylor Swift', album: 'Fearless' },
          { title: 'Wildest Dreams', artist: 'Taylor Swift', album: '1989' },
        ],
        delta: [
          { title: 'Kau Yang Sempurna', artist: 'Rizky Febian', album: 'Delta FM Showcase' },
          { title: 'Tak Pernah Padam', artist: 'Afgan', album: 'Delta Top 40' },
        ],
        iradio: [
          { title: 'Pergilah Kasih', artist: 'Chrisye', album: 'i-Radio Indonesian Hits' },
          { title: 'Harusnya Aku', artist: 'Armada', album: 'Top 40 Indonesia' },
        ],
        longplayer: [
          { title: 'Millennium Composition', artist: 'Jem Finer', album: 'Longplayer' },
          { title: 'Tibetan Singing Bowls', artist: 'Various Artists', album: 'Longplayer Session' },
        ],
      };

      const stationSongs = songs[station];
      if (stationSongs) {
        const songInfo = stationSongs[Math.floor(Math.random() * stationSongs.length)];
        setCurrentSong(songInfo);
        addToPlaylist(station, songInfo);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setDefaultSongInfo(station);
      }
      setIsLoadingSong(false);
    }, 1000);
  };

  const setDefaultSongInfo = (station: string) => {
    const stationInfo = {
      title: 'Live Broadcast',
      artist: stationNames[station] || station,
      album: 'Live Stream'
    };

    setCurrentSong(stationInfo);
    setLastUpdated(new Date().toLocaleTimeString());
    setIsLoadingSong(false);
  };

  const changeStation = (station: 'web3' | 'Venus' | 'iradio' | 'female' | 'delta' | 'longplayer') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentStation(station);
    setIsPlaying(false);
    setCurrentSong(null);
    setLastUpdated(null);
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (!['female', 'delta', 'iradio', 'longplayer'].includes(currentStation)) return;

    const refreshInterval = setInterval(() => {
      fetchOnlineRadioBoxInfo(currentStation);
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [isPlaying, currentStation]);

  useEffect(() => {
    const audio = new Audio(stations[currentStation]);
    audioRef.current = audio;
    audio.volume = volume / 100;

    audio.addEventListener('play', () => {
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
              title: "Now Playing",
              description: stationNames[currentStation],
            });
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            toast({
              title: "Playback error",
              description: "There was an error playing this station.",
              variant: "destructive"
            });
          });
      }
      setIsPlaying(!isPlaying);
    }
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
              <h2 className="font-semibold text-gray-900">{stationNames[currentStation]}</h2>
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
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-blue-500" />
              </div>
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
