import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Radio, Info, Loader } from 'lucide-react';
import { getStationBySlug } from '@/lib/supabase';
import { Station } from '@/types/content';
import { useToast } from '@/components/ui/use-toast';
import { useAudio } from '@/contexts/AudioProvider';
import { Badge } from '@/components/ui/badge';

const StationDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [station, setStation] = useState<Station | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { playStation, isPlaying, currentStation } = useAudio();

    useEffect(() => {
        const fetchStation = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const { data, error } = await getStationBySlug(slug);

                if (error) throw error;

                if (data) {
                    setStation(data);
                } else {
                    toast({
                        title: "Station not found",
                        description: "The requested station could not be found.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error('Error loading station:', error);
                toast({
                    title: "Error",
                    description: "Failed to load station details.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStation();
    }, [slug, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-24 flex justify-center">
                    <Loader className="h-8 w-8 animate-spin text-green-500" />
                </div>
            </div>
        );
    }

    if (!station) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-24 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Station Not Found</h1>
                    <Link to="/stations">
                        <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-900">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stations
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isCurrentStation = currentStation?.name === station.name;
    const isPlayingThis = isCurrentStation && isPlaying;

    const handlePlay = () => {
        if (isPlayingThis) {
            // Pause logic if needed, or just stop
            // Currently AudioProvider might only expose playStation
            // Assuming playStation also handles logic or we need a pause method
            // For now, re-triggering playStation usually restarts or toggles depending on implementation
            playStation(station as any); // Casting since Station type might slightly differ in Context
        } else {
            playStation(station as any);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <NavBar />
            <div className="container py-12 max-w-4xl">
                <Link to="/stations" className="mb-8 inline-block">
                    <Button variant="ghost" className="text-gray-400 hover:text-green-400 pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stations
                    </Button>
                </Link>

                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 shadow-2xl backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="w-48 h-48 rounded-full bg-gray-900 border-4 border-green-500/20 flex items-center justify-center shrink-0 relative overflow-hidden group">
                            {station.image_url ? (
                                <img src={station.image_url} alt={station.name} className="w-full h-full object-cover" />
                            ) : (
                                <Radio className="h-20 w-20 text-green-500" />
                            )}

                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handlePlay}>
                                <Play className="h-16 w-16 text-white fill-current" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/50 mb-3">
                                    {station.genre}
                                </Badge>
                                <h1 className="text-4xl font-bold text-white mb-2">{station.name}</h1>
                                <p className="text-xl text-gray-400">{station.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                                <Button
                                    size="lg"
                                    className={`${isPlayingThis ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-black font-bold text-lg min-w-[160px]`}
                                    onClick={handlePlay}
                                >
                                    {isPlayingThis ? 'Now Playing' : 'Listen Live'}
                                </Button>

                                {!station.streaming && (
                                    <div className="flex items-center text-yellow-500 text-sm bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                                        <Info className="h-4 w-4 mr-2" />
                                        Stream currently offline
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">About Station</h3>
                        <p className="text-gray-300 leading-relaxed">
                            {station.description}
                            {/* Placeholder for extended description if available */}
                            This station brings you the best selection of {station.genre} music and programming.
                            Tune in for exclusive shows, interviews, and non-stop music curated for the Web3 community.
                        </p>
                    </div>

                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Stream Info</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex justify-between border-b border-gray-700/50 pb-2">
                                <span>Genre</span>
                                <span className="text-white font-medium">{station.genre}</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-700/50 pb-2">
                                <span>Quality</span>
                                <span className="text-white font-medium">128 kbps / 44.1 kHz</span>
                            </li>
                            <li className="flex justify-between pt-1">
                                <span>Status</span>
                                <span className={station.streaming ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                                    {station.streaming ? "Online" : "Offline"}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationDetail;
