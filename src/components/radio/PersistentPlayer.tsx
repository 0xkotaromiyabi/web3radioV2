
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2, Volume2, VolumeX, Music, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const PersistentPlayer = () => {
    const location = useLocation();
    const {
        isPlaying,
        togglePlay,
        currentSong,
        currentStation,
        isLoading,
        volume,
        setVolume,
        isMuted,
        toggleMute
    } = useAudio();

    // Do not show on Home page ('/') or if explicitly hidden
    if (location.pathname === '/' || location.pathname === '/dashboard') {
        return null; // The main big player controls audio here, or dashboard doesn't need it obstructing
    }

    const stationName = currentStation.charAt(0).toUpperCase() + currentStation.slice(1);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 flex items-center px-4 md:px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-transform duration-300">
            {/* Song Info */}
            <div className="flex items-center gap-3 w-1/3 min-w-0">
                {currentSong?.artwork ? (
                    <img src={currentSong.artwork} alt="Album Art" className="w-12 h-12 rounded-lg object-cover shadow-sm bg-gray-100" />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Music className="w-6 h-6" />
                    </div>
                )}
                <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{currentSong?.title || 'Live Stream'}</p>
                    <p className="text-xs text-gray-500 truncate">{currentSong?.artist || stationName}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 w-1/3">
                <Button
                    onClick={togglePlay}
                    size="icon"
                    className={cn(
                        "rounded-full h-10 w-10 shadow-lg transition-transform active:scale-95",
                        isPlaying ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                    ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                </Button>
            </div>

            {/* Volume & Extras */}
            <div className="flex items-center justify-end gap-3 w-1/3">
                <div className="hidden md:flex items-center gap-2 w-32 group">
                    <button onClick={toggleMute} className="text-gray-500 hover:text-gray-900 transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <Slider
                        defaultValue={[volume]}
                        value={[isMuted ? 0 : volume]}
                        max={100}
                        step={1}
                        onValueChange={(val) => setVolume(val[0])}
                        className="cursor-pointer"
                    />
                </div>
                <Link to="/">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            {/* Progress Bar (Indeterminate mostly for radio) */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100">
                {isPlaying && !isLoading && (
                    <div className="h-full bg-blue-500 w-full animate-pulse opacity-50" />
                )}
                {isLoading && (
                    <div className="h-full w-1/3 bg-blue-500 animate-loading-bar" />
                )}
            </div>
        </div>
    );
};

export default PersistentPlayer;
