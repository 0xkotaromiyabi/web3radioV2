
import React, { useEffect, useState, useRef } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, Play, Pause, Music, Volume2, ExternalLink } from 'lucide-react';
import { fetchStations, subscribeToTable } from '@/lib/supabase';
import { Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Station = {
  id: number;
  name: string;
  genre: string;
  description: string;
  streaming: boolean;
  image_url?: string;
};

const stationUrls: { [key: string]: string } = {
  'Web3 Radio': 'https://web3radio.cloud/stream',
  'Venus FM': 'https://stream.zeno.fm/3wiuocujuobtv',
  'i-Radio': 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
  'Female Radio': 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
  'Delta FM': 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3',
  'Longplayer': 'http://icecast.spc.org:8000/longplayer'
};

const stationWebsites: { [key: string]: string } = {
  'Venus FM': 'https://www.radiovenusfm.com/',
  'i-Radio': 'https://iswaranetwork.com/',
  'Female Radio': 'https://femaleradio.co.id/',
  'Delta FM': 'https://deltafm.net/'
};

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingStationId, setPlayingStationId] = useState<number | null>(null);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadStations = async () => {
      try {
        const { data, error } = await fetchStations();
        if (error) throw error;
        setStations(data || []);
      } catch (error) {
        console.error('Error loading stations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStations();

    // Set up real-time subscription
    const subscription = subscribeToTable('stations', () => {
      loadStations();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const togglePlay = async (station: Station) => {
    if (playingStationId === station.id) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setPlayingStationId(null);
      toast({
        title: "Stopped",
        description: `Stopped playing ${station.name}`,
      });
    } else {
      // Start new playback
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const streamUrl = stationUrls[station.name];
        if (!streamUrl) {
          toast({
            title: "Stream not available",
            description: `No stream URL configured for ${station.name}`,
            variant: "destructive"
          });
          return;
        }

        const audio = new Audio(streamUrl);
        audioRef.current = audio;
        audio.volume = volume / 100;
        
        await audio.play();
        setPlayingStationId(station.id);
        toast({
          title: "Now Playing",
          description: `Playing ${station.name}`,
        });
      } catch (error) {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback error",
          description: `Unable to play ${station.name}. Please try again.`,
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavBar />
        <div className="container py-12 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-green-400">Radio Stations</h1>
          {playingStationId && (
            <div className="flex items-center gap-4 bg-gray-800 rounded-lg p-4 border border-green-500">
              <Volume2 className="h-5 w-5 text-green-400" />
              <span className="text-white text-sm">Volume:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 accent-green-500"
              />
              <span className="text-green-400 text-sm w-8">{volume}%</span>
            </div>
          )}
        </div>
        
        {stations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stations.map((station) => (
              <Card key={station.id} className="bg-gray-800 border-green-500 overflow-hidden flex flex-col">
                {station.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={station.image_url} 
                      alt={station.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-green-400">{station.name}</CardTitle>
                    <CardDescription className="text-gray-300 flex items-center gap-2">
                      <Music className="h-3 w-3" />
                      {station.genre}
                    </CardDescription>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${station.streaming ? 'bg-green-500' : 'bg-red-500'}`} />
                </CardHeader>
                <CardContent className="text-white flex-grow">
                  <p className="mb-4">{station.description}</p>
                  {stationWebsites[station.name] && (
                    <a
                      href={stationWebsites[station.name]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit Website
                    </a>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-300">
                    {station.streaming ? 'Live' : 'Offline'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`${station.streaming ? 'border-green-500 text-green-400 hover:bg-green-900' : 'border-gray-600 text-gray-400'}`}
                    disabled={!station.streaming}
                    onClick={() => station.streaming && togglePlay(station)}
                  >
                    {playingStationId === station.id ? (
                      <><Pause className="h-4 w-4 mr-2" /> Stop</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> Play</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No radio stations available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stations;
