
import React, { useCallback, useState, useRef, useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import Particles from 'react-particles';
import { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import StationSelector from '@/components/radio/StationSelector';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const Stations = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentStation, setCurrentStation] = useState('Prambors');
  const [currentSongInfo, setCurrentSongInfo] = useState<{ title: string, artist: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const stations = {
    Prambors: 'https://rust.mrngroup.co:8040/stream',
    iradio: 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
    female: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
    delta: 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3'
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log('Particles loaded:', container);
  }, []);

  const handleStationChange = (station: 'web3' | 'Prambors' | 'iradio' | 'female' | 'delta') => {
    if (station === 'web3') {
      // We don't have web3 station on this page
      return;
    }
    
    console.log(`Station selected: ${station}`);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setCurrentStation(station);
    setIsPlaying(false);
    setCurrentSongInfo(null);
    
    // If already playing, start the new station
    if (isPlaying) {
      setTimeout(() => togglePlay(), 100);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          toast({
            title: "Radio playing",
            description: `Now playing ${
              currentStation === 'Prambors' ? 'Prambors Radio' :
              currentStation === 'iradio' ? 'i-Radio' :
              currentStation === 'female' ? 'Female Radio' : 'Delta FM'
            }`,
          });
          
          // Mock song info
          const mockSongInfo = () => {
            const songs = {
              'Prambors': [
                { title: 'Starboy', artist: 'The Weeknd' },
                { title: 'Beautiful Mistakes', artist: 'Maroon 5' },
                { title: 'Apa Kabar?', artist: 'Maliq & D\'Essentials' },
              ],
              'iradio': [
                { title: 'Cinta Luar Biasa', artist: 'Andmesh' },
                { title: 'Risalah Hati', artist: 'Dewa 19' },
                { title: 'Pelangi', artist: 'Hivi!' },
              ],
              'female': [
                { title: 'Wildest Dreams', artist: 'Taylor Swift' },
                { title: 'Masterpiece', artist: 'Jessie J' },
                { title: 'Born This Way', artist: 'Lady Gaga' },
              ],
              'delta': [
                { title: 'Tentang Rindu', artist: 'Virzha' },
                { title: 'Tolong', artist: 'Budi Doremi' },
                { title: 'Kau dan Aku', artist: 'Armada' },
              ]
            };
            
            const stationSongs = songs[currentStation as keyof typeof songs] || [];
            const randomSong = stationSongs[Math.floor(Math.random() * stationSongs.length)];
            
            setCurrentSongInfo(randomSong);
          };
          
          mockSongInfo();
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
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = new Audio(stations[currentStation as keyof typeof stations]);
    audioRef.current = audio;
    audio.volume = volume / 100;
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentStation]);

  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-0 relative">
          <Particles
            id="tsparticles-stations"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 60,
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: {
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.3,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 3 },
                },
              },
              detectRetina: true,
            }}
            className="absolute inset-0"
          />
          
          <div className="relative z-10 flex flex-col">
            <NavBar />
            <div className="container py-12">
              <h1 className="font-bold text-white text-3xl md:text-4xl lg:text-5xl leading-tight break-words">
                Radio Stations
              </h1>
              <p className="mt-4 text-gray-300 text-base md:text-lg lg:text-xl leading-normal max-w-xl">
                Browse our collection of radio stations.
              </p>
              
              <div className="mt-10 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl text-white font-semibold mb-4">Available Stations</h2>
                <StationSelector 
                  currentStation={currentStation}
                  onStationChange={handleStationChange}
                />
                
                {/* Player Controls */}
                <div className="mt-6 p-4 bg-gray-900/80 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white text-lg font-medium">
                        {currentStation === 'Prambors' ? 'Prambors Radio' :
                         currentStation === 'iradio' ? 'i-Radio' :
                         currentStation === 'female' ? 'Female Radio' : 'Delta FM'}
                      </h3>
                      {currentSongInfo && (
                        <div className="text-gray-300 text-sm">
                          <p>{currentSongInfo.title}</p>
                          <p className="text-gray-400">{currentSongInfo.artist}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={togglePlay}
                      className="bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-full p-4 transition-all"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="text-gray-400" size={16} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#444] appearance-none rounded cursor-pointer"
                      style={{
                        backgroundImage: `linear-gradient(to right, #00ff00 0%, #00ff00 ${volume}%, #444 ${volume}%, #444 100%)`
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all cursor-pointer" onClick={() => handleStationChange('Prambors')}>
                    <h3 className="text-xl text-white font-medium">Prambors Radio</h3>
                    <p className="mt-2 text-gray-300">Indonesia's #1 Hit Music Station playing the latest hits.</p>
                    {currentStation === 'Prambors' && (
                      <div className="mt-3 flex items-center text-[#00ff00]">
                        {isPlaying ? <span>● Playing</span> : <span>○ Click play to listen</span>}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all cursor-pointer" onClick={() => handleStationChange('iradio')}>
                    <h3 className="text-xl text-white font-medium">I-Radio</h3>
                    <p className="mt-2 text-gray-300">100% musik Indonesia terbaik.</p>
                    {currentStation === 'iradio' && (
                      <div className="mt-3 flex items-center text-[#00ff00]">
                        {isPlaying ? <span>● Playing</span> : <span>○ Click play to listen</span>}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all cursor-pointer" onClick={() => handleStationChange('female')}>
                    <h3 className="text-xl text-white font-medium">Female Radio</h3>
                    <p className="mt-2 text-gray-300">Radio for independent women with great music.</p>
                    {currentStation === 'female' && (
                      <div className="mt-3 flex items-center text-[#00ff00]">
                        {isPlaying ? <span>● Playing</span> : <span>○ Click play to listen</span>}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all cursor-pointer" onClick={() => handleStationChange('delta')}>
                    <h3 className="text-xl text-white font-medium">Delta FM</h3>
                    <p className="mt-2 text-gray-300">The best music variety from the 80s to today.</p>
                    {currentStation === 'delta' && (
                      <div className="mt-3 flex items-center text-[#00ff00]">
                        {isPlaying ? <span>● Playing</span> : <span>○ Click play to listen</span>}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">Click on a station card to select it, then use the play button to listen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default Stations;
