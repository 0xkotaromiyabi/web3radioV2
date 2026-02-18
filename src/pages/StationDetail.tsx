import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Radio, Info, Loader2 } from 'lucide-react';
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
    const { changeStation, isPlaying, currentStation: activeStationKey, togglePlay } = useAudio();

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
            <div className="min-h-screen bg-[#fef29c] flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#515044]/50" />
            </div>
        );
    }

    if (!station) {
        return (
            <div className="min-h-screen bg-[#fef29c] flex flex-col items-center">
                <NavBar />
                <div className="container mt-32 text-center">
                    <h1 className="text-2xl font-bold text-[#515044] mb-4 uppercase tracking-widest opacity-50">Station Not Found</h1>
                    <Link to="/stations">
                        <Button variant="outline" className="border-[#515044]/20 text-[#515044] hover:bg-white rounded-2xl">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stations
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Map station name to key used in AudioProvider
    const stationKeys: Record<string, string> = {
        'Web3 Radio': 'web3',
        'Oz Radio Jakarta': 'ozradio',
        'i-Radio': 'iradio',
        'Female Radio': 'female',
        'Delta FM': 'delta',
        'Prambors FM': 'prambors'
    };

    const stationKey = stationKeys[station.name] || 'web3';
    const isCurrentStation = activeStationKey === stationKey;
    const isPlayingThis = isCurrentStation && isPlaying;

    const handlePlay = () => {
        if (!isCurrentStation) {
            changeStation(stationKey);
            if (!isPlaying) togglePlay();
        } else {
            togglePlay();
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
                body { font-family: 'Raleway', sans-serif; }
            `}</style>
            <NavBar />
            <div className="w-[92%] md:w-[70%] mt-24 md:mt-28 mb-32">
                <Link to="/stations" className="mb-8 inline-block">
                    <Button variant="ghost" className="text-[#515044]/50 hover:text-[#515044] hover:bg-transparent pl-0 uppercase text-[10px] font-bold tracking-[0.2em]">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stations
                    </Button>
                </Link>

                <div className="bg-white/95 backdrop-blur-xl rounded-[48px] p-8 md:p-12 border border-[#515044]/5 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                        <div className="w-48 h-48 rounded-full bg-gray-100 border-[6px] border-[#fef29c] shadow-xl shrink-0 relative overflow-hidden group">
                            {station.image_url ? (
                                <img src={station.image_url} alt={station.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#515044]/5 text-[#515044]/20">
                                    <Radio className="h-20 w-20" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handlePlay}>
                                <Play className="h-16 w-16 text-white fill-current" stroke="none" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <div className="bg-[#515044]/5 text-[#515044]/60 text-[8px] font-bold uppercase tracking-[0.3em] px-3 py-1.5 rounded-xl inline-block mb-4">
                                    {station.genre}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-[#515044] mb-3 leading-tight tracking-tight">{station.name}</h1>
                                <p className="text-lg text-[#515044]/60 font-light leading-relaxed">{station.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                                <Button
                                    size="lg"
                                    className={`${isPlayingThis ? 'bg-red-500 hover:bg-red-600' : 'bg-[#515044] hover:bg-black'} text-white rounded-2xl px-10 py-7 font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#515044]/10 transition-all hover:scale-105 active:scale-95`}
                                    onClick={handlePlay}
                                >
                                    {isPlayingThis ? 'Currently Live' : 'Listen Live'}
                                </Button>

                                {!station.streaming && (
                                    <div className="flex items-center text-orange-500 text-[10px] font-bold uppercase tracking-widest bg-orange-500/5 px-4 py-2 rounded-xl border border-orange-500/10">
                                        <Info className="h-3 w-3 mr-2" />
                                        Stream Offline
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-10">
                    <div className="bg-white/80 backdrop-blur rounded-[32px] p-8 md:p-10 border border-[#515044]/5 shadow-xl">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#515044]/30 mb-6">About Frequency</h3>
                        <p className="text-[#515044]/70 leading-relaxed font-light">
                            {station.description}
                            <br /><br />
                            This station brings you the best selection of {station.genre} music and programming.
                            Tune in for exclusive shows, interviews, and non-stop music curated for the Web3 community.
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur rounded-[32px] p-8 md:p-10 border border-[#515044]/5 shadow-xl">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#515044]/30 mb-6">Technical Info</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center text-sm border-b border-[#515044]/5 pb-4">
                                <span className="text-[#515044]/40 font-bold uppercase tracking-widest text-[10px]">Genre</span>
                                <span className="text-[#515044] font-bold">{station.genre}</span>
                            </li>
                            <li className="flex justify-between items-center text-sm border-b border-[#515044]/5 pb-4">
                                <span className="text-[#515044]/40 font-bold uppercase tracking-widest text-[10px]">Quality</span>
                                <span className="text-[#515044] font-bold">128 kbps HD</span>
                            </li>
                            <li className="flex justify-between items-center text-sm pt-2">
                                <span className="text-[#515044]/40 font-bold uppercase tracking-widest text-[10px]">Status</span>
                                <span className={`font-bold flex items-center gap-2 ${station.streaming ? "text-green-500" : "text-red-400"}`}>
                                    <div className={`w-2 h-2 rounded-full ${station.streaming ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                                    {station.streaming ? "ONLINE" : "OFFLINE"}
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
