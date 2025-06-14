
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, Play, Pause, Music } from 'lucide-react';
import { fetchStations, subscribeToTable } from '@/lib/supabase';
import { Loader } from 'lucide-react';

type Station = {
  id: number;
  name: string;
  genre: string;
  description: string;
  streaming: boolean;
  image_url?: string;
};

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingStationId, setPlayingStationId] = useState<number | null>(null);

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

  const togglePlay = (stationId: number) => {
    if (playingStationId === stationId) {
      setPlayingStationId(null);
    } else {
      setPlayingStationId(stationId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavBar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-green-400 text-center lg:text-left">Radio Stations</h1>
        
        {stations.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stations.map((station) => (
              <Card key={station.id} className="bg-gray-800 border-green-500 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                {station.image_url && (
                  <div className="w-full h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={station.image_url} 
                      alt={station.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="flex flex-row items-start justify-between pb-2 p-4 sm:p-6">
                  <div className="flex-1">
                    <CardTitle className="text-green-400 text-base sm:text-lg line-clamp-2">{station.name}</CardTitle>
                    <CardDescription className="text-gray-300 flex items-center gap-2 mt-1">
                      <Music className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{station.genre}</span>
                    </CardDescription>
                  </div>
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 mt-1 ${station.streaming ? 'bg-green-500' : 'bg-red-500'}`} />
                </CardHeader>
                <CardContent className="text-white flex-grow p-4 sm:p-6 pt-0">
                  <p className="mb-4 text-sm sm:text-base line-clamp-3">{station.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-gray-700 pt-4 p-4 sm:p-6">
                  <div className="text-xs sm:text-sm text-gray-300">
                    {station.streaming ? 'Live' : 'Offline'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full sm:w-auto ${station.streaming ? 'border-green-500 text-green-400 hover:bg-green-900' : 'border-gray-600 text-gray-400'}`}
                    disabled={!station.streaming}
                    onClick={() => station.streaming && togglePlay(station.id)}
                  >
                    {playingStationId === station.id ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" /> 
                        <span className="hidden sm:inline">Stop</span>
                        <span className="sm:hidden">Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> 
                        <span className="hidden sm:inline">Play</span>
                        <span className="sm:hidden">Play</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <p className="text-gray-400 text-lg sm:text-xl">No radio stations available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stations;
