
import React, { useEffect, useState, useRef } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, Play, Pause, Music, Volume2, ExternalLink, Disc3, Newspaper, Users } from 'lucide-react';
import { fetchStations, subscribeToTable } from '@/lib/supabase';
import { Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { Link } from 'react-router-dom';
import { Station } from '@/types/content';

type GenreCategory = 'all' | 'pop' | 'rock' | 'news' | 'community';

const stationUrls: { [key: string]: string } = {
  'Web3 Radio': 'https://web3radio.cloud/stream',
  'Oz Radio Jakarta': 'https://streaming.ozradiojakarta.com:8443/ozjakarta',
  'i-Radio': 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
  'Female Radio': 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
  'Delta FM': 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3',
  'Prambors FM': 'https://s2.cloudmu.id/listen/prambors/stream',
  'Hard Rock FM': 'https://example.com/hardrock',
  'Indie Nation': 'https://example.com/indie',
  'BBC World Service': 'https://example.com/bbc',
  'Metro News FM': 'https://example.com/metronews',
  'Local Voice Radio': 'https://example.com/localvoice',
  'Campus FM': 'https://example.com/campus'
};

const stationWebsites: { [key: string]: string } = {
  'Oz Radio Jakarta': 'https://ozradiojakarta.com/',
  'i-Radio': 'https://iswaranetwork.com/',
  'Female Radio': 'https://femaleradio.co.id/',
  'Delta FM': 'https://deltafm.net/'
};

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingStationId, setPlayingStationId] = useState<number | null>(null);
  const [volume, setVolume] = useState(80);
  const [selectedGenre, setSelectedGenre] = useState<GenreCategory>('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Sample station data for each genre category
  const sampleStations: Station[] = [
    // Pop / Top 40
    { id: 101, name: 'Prambors FM', genre: 'pop', description: 'Jakarta\'s #1 Hit Music Station', streaming: true, image_url: '', slug: 'prambors-fm' },
    { id: 102, name: 'Female Radio', genre: 'pop', description: 'Music & Lifestyle for Modern Women', streaming: true, image_url: '', slug: 'female-radio' },
    { id: 103, name: 'i-Radio', genre: 'pop', description: 'Today\'s Best Music', streaming: true, image_url: '', slug: 'i-radio' },

    // Rock (Classic Rock, Alternative, Indie)
    { id: 201, name: 'Hard Rock FM', genre: 'rock', description: 'Classic Rock Anthems 24/7', streaming: false, image_url: '', slug: 'hard-rock-fm' },
    { id: 202, name: 'Indie Nation', genre: 'rock', description: 'Alternative & Indie Rock Hits', streaming: false, image_url: '', slug: 'indie-nation' },
    { id: 203, name: 'Delta FM', genre: 'rock', description: 'Rock & Alternative Music', streaming: true, image_url: '', slug: 'delta-fm' },

    // News
    { id: 301, name: 'BBC World Service', genre: 'news', description: 'Global News & Current Affairs', streaming: false, image_url: '', slug: 'bbc-world-service' },
    { id: 302, name: 'Metro News FM', genre: 'news', description: 'Your Source for Local & National News', streaming: false, image_url: '', slug: 'metro-news-fm' },
    { id: 303, name: 'Oz Radio Jakarta', genre: 'news', description: 'News, Talk & Information', streaming: true, image_url: '', slug: 'oz-radio-jakarta' },

    // Community Radio
    { id: 401, name: 'Web3 Radio', genre: 'community', description: 'Community-Powered Web3 Broadcasting', streaming: true, image_url: '', slug: 'web3-radio' },
    { id: 402, name: 'Local Voice Radio', genre: 'community', description: 'Your Community, Your Voice', streaming: false, image_url: '', slug: 'local-voice-radio' },
    { id: 403, name: 'Campus FM', genre: 'community', description: 'Student-Run Campus Radio', streaming: false, image_url: '', slug: 'campus-fm' },
  ];

  useEffect(() => {
    const loadStations = async () => {
      try {
        const { data, error } = await fetchStations();
        if (error) throw error;

        // Merge Supabase data with sample data, preferring Supabase data
        const mergedStations = [...sampleStations];
        if (data && data.length > 0) {
          data.forEach(dbStation => {
            const existingIndex = mergedStations.findIndex(s => s.name === dbStation.name);
            if (existingIndex >= 0) {
              mergedStations[existingIndex] = dbStation;
            } else {
              mergedStations.push(dbStation);
            }
          });
        }
        setStations(mergedStations);
      } catch (error) {
        console.error('Error loading stations:', error);
        // Fallback to sample data if Supabase fails
        setStations(sampleStations);
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

  // Filter stations by genre
  const filteredStations = selectedGenre === 'all'
    ? stations
    : stations.filter(station => station.genre === selectedGenre);

  const genreCategories = [
    { id: 'all', label: 'All Stations', icon: Radio, count: stations.length },
    { id: 'pop', label: 'Pop / Top 40', icon: Music, count: stations.filter(s => s.genre === 'pop').length },
    { id: 'rock', label: 'Rock', icon: Disc3, count: stations.filter(s => s.genre === 'rock').length },
    { id: 'news', label: 'News', icon: Newspaper, count: stations.filter(s => s.genre === 'news').length },
    { id: 'community', label: 'Community', icon: Users, count: stations.filter(s => s.genre === 'community').length },
  ];

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

        {/* Genre Filter Tabs */}
        <div className="mb-8 border-b border-gray-700">
          <div className="flex flex-wrap gap-2">
            {genreCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedGenre === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedGenre(category.id as GenreCategory)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${isActive
                    ? 'border-green-500 text-green-400 bg-gray-800/50'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredStations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStations.map((station) => (
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
                    <CardTitle className="text-green-400">
                      <Link to={`/stations/${station.slug || station.id}`} className="hover:underline hover:text-green-300 transition-colors">
                        {station.name}
                      </Link>
                    </CardTitle>
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
            <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No radio stations in this category</p>
            <p className="text-gray-500 text-sm mt-2">Try selecting a different genre</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stations;
