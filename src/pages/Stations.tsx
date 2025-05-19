
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
        <h1 className="text-3xl font-bold mb-8 text-green-400">Radio Stations</h1>
        
        {stations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stations.map((station) => (
              <Card key={station.id} className="bg-gray-800 border-green-500 overflow-hidden flex flex-col">
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
                    onClick={() => station.streaming && togglePlay(station.id)}
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
