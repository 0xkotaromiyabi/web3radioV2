
import React, { useState, useEffect, useRef } from 'react';
import WalletConnection from '../wallet/WalletConnection';
import RadioControls from './RadioControls';
import StationSelector from './StationSelector';
import SongInfo from './SongInfo';
import ProgramSchedule from './ProgramSchedule';
import CryptoPriceTicker from './CryptoPriceTicker';
import AudioVisualizer from './AudioVisualizer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';

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

  const stations = {
    web3: 'https://web3radio.cloud/stream',
    Venus: 'https://stream.zeno.fm/3wiuocujuobtv',
    iradio: 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
    female: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
    delta: 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3',
    longplayer: 'http://icecast.spc.org:8000/longplayer'
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
      let songInfo;
      
      const femaleSongs = [
        { title: 'Beautiful Life', artist: 'Dipha Barus feat. Afgan', album: 'Female Radio Top Hits' },
        { title: 'Love Story', artist: 'Taylor Swift', album: 'Fearless' },
        { title: 'You Belong With Me', artist: 'Taylor Swift', album: 'Fearless' },
        { title: 'Wildest Dreams', artist: 'Taylor Swift', album: '1989' },
        { title: 'Hati-Hati di Jalan', artist: 'Tulus', album: 'Monokrom' }
      ];
      
      const deltaSongs = [
        { title: 'Kau Yang Sempurna', artist: 'Rizky Febian', album: 'Delta FM Showcase' },
        { title: 'Tak Pernah Padam', artist: 'Afgan', album: 'Delta Top 40' },
        { title: 'Waktuku Hampa', artist: 'Ari Lasso', album: 'Best of Delta' },
        { title: 'Separuh Nafas', artist: 'Dewa 19', album: 'Bintang Lima' },
        { title: 'Bintang di Surga', artist: 'Peterpan', album: 'Bintang di Surga' }
      ];
      
      const iRadioSongs = [
        { title: 'Pergilah Kasih', artist: 'Chrisye', album: 'i-Radio Indonesian Hits' },
        { title: 'Harusnya Aku', artist: 'Armada', album: 'Top 40 Indonesia' },
        { title: 'Adu Rayu', artist: 'Yovie Tulus Glenn', album: 'Indonesian Collaboration' },
        { title: 'Anganku Anganmu', artist: 'Raisa & Isyana', album: 'Duet Hits' },
        { title: 'Sebatas Mimpi', artist: 'Nano', album: 'i-Radio Playlist' }
      ];

      const longplayerSongs = [
        { title: 'Millennium Composition', artist: 'Jem Finer', album: 'Longplayer' },
        { title: 'Tibetan Singing Bowls', artist: 'Various Artists', album: 'Longplayer Session' },
        { title: 'Eternal Fragment', artist: 'Longplayer Project', album: 'Continuous Play' },
        { title: 'Thousand Year Echo', artist: 'Jem Finer', album: 'Trinity Buoy Wharf' },
        { title: 'Infinite Loop', artist: 'Longplayer Collective', album: 'Ambient Millennium' }
      ];
      
      if (station === 'female') {
        songInfo = femaleSongs[Math.floor(Math.random() * femaleSongs.length)];
      } else if (station === 'delta') {
        songInfo = deltaSongs[Math.floor(Math.random() * deltaSongs.length)];
      } else if (station === 'iradio') {
        songInfo = iRadioSongs[Math.floor(Math.random() * iRadioSongs.length)];
      } else if (station === 'longplayer') {
        songInfo = longplayerSongs[Math.floor(Math.random() * longplayerSongs.length)];
      } else {
        setDefaultSongInfo(station);
        return;
      }
      
      setCurrentSong(songInfo);
      addToPlaylist(station, songInfo);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoadingSong(false);
      
      console.log(`Updated song info for ${station}:`, songInfo);
    }, 1000);
  };

  const setDefaultSongInfo = (station: string) => {
    const stationInfo = {
      title: 'Live Broadcast',
      artist: station === 'web3' ? 'Web3 Radio' :
              station === 'Venus' ? 'Venus FM' :
              station === 'iradio' ? 'i-Radio' :
              station === 'female' ? 'Female Radio' :
              station === 'longplayer' ? 'Longplayer' : 'Delta FM',
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
      console.log(`Auto-refreshing song info for ${currentStation}`);
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

  const refreshSongInfo = () => {
    toast({
      title: "Refreshing song info",
      description: `Updating current song information for ${
        currentStation === 'web3' ? 'Web3 Radio' :
        currentStation === 'Venus' ? 'Venus FM' :
        currentStation === 'iradio' ? 'i-Radio' :
        currentStation === 'female' ? 'Female Radio' :
        currentStation === 'longplayer' ? 'Longplayer' : 'Delta FM'
      }`,
      duration: 1500,
    });
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
                currentStation === 'Venus' ? 'Venus FM' :
                currentStation === 'iradio' ? 'i-Radio' :
                currentStation === 'female' ? 'Female Radio' :
                currentStation === 'longplayer' ? 'Longplayer' : 'Delta FM'
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

  return (
    <>
      <StationSelector 
        currentStation={currentStation}
        onStationChange={changeStation}
      />
      
      <SongInfo 
        currentSong={currentSong}
        isLoading={isLoadingSong}
        currentStation={currentStation}
        onRefresh={refreshSongInfo}
        lastUpdated={lastUpdated || undefined}
        playlist={playlist[currentStation]}
      />

      <div className="bg-[#232323] rounded-lg shadow-xl border border-[#444] select-none max-w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333] p-2 sm:p-3 flex justify-between items-center">
          <div className="text-[#00ff00] text-xs sm:text-sm font-bold truncate">
            {currentStation === 'web3' ? 'Web3 Radio' : 
             currentStation === 'Venus' ? 'Venus FM' : 
             currentStation === 'iradio' ? 'i-Radio' : 
             currentStation === 'female' ? 'Female Radio' :
             currentStation === 'longplayer' ? 'Longplayer' : 'Delta FM'}
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button className="text-gray-400 hover:text-white text-xs">_</button>
            <button className="text-gray-400 hover:text-white text-xs">□</button>
            <button className="text-gray-400 hover:text-white text-xs">×</button>
          </div>
        </div>

        <div className="bg-[#000] p-2 sm:p-3 md:p-4 space-y-2">
          <ProgramSchedule isMobile={isMobile} />
          <CryptoPriceTicker isMobile={isMobile} />
          <AudioVisualizer />
        </div>

        <RadioControls 
          isPlaying={isPlaying}
          volume={volume}
          togglePlay={togglePlay}
          setVolume={setVolume}
        />

        <WalletConnection isPlaying={isPlaying} />
      </div>
    </>
  );
};

export default RadioPlayer;
