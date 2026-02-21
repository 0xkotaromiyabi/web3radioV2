
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2, Volume2, VolumeX, Music, Maximize2, Share2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ShareModal } from './ShareModal';

const PersistentPlayer = () => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
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
        return null;
    }

    const stationName = currentStation.charAt(0).toUpperCase() + currentStation.slice(1);

    return (
        <>
            {/* Spacer so the fixed player doesn't cover page content */}
            <div className="h-24 w-full shrink-0" />

            <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-[#515044]/5 z-50 flex items-center px-6 md:px-10 shadow-[0_-10px_40px_rgba(81,80,68,0.05)] transition-all duration-500 font-['Raleway',_sans-serif]">
                <style>{`
                    @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
                `}</style>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#515044]/5">
                    {isPlaying && !isLoading && (
                        <div className="h-full bg-[#515044]/20 w-full animate-pulse" />
                    )}
                    {isLoading && (
                        <div className="h-full w-1/3 bg-[#515044]/40 animate-loading-bar" />
                    )}
                </div>

                {/* Song Info */}
                <div className="flex items-center gap-4 w-1/3 min-w-0">
                    <div className="relative group">
                        {currentSong?.artwork ? (
                            <img src={currentSong.artwork} alt="Album Art" className="w-14 h-14 rounded-2xl object-cover shadow-md bg-[#515044]/5 transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-[#515044]/5 flex items-center justify-center text-[#515044]/20">
                                <Music className="w-6 h-6" />
                            </div>
                        )}
                        {isPlaying && !isLoading && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm text-[#515044] truncate tracking-tight">{currentSong?.title || 'Live Stream'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40 truncate mt-1">{currentSong?.artist || stationName}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 w-1/3">
                    <button
                        onClick={togglePlay}
                        className={cn(
                            "rounded-[20px] h-12 w-12 flex items-center justify-center shadow-xl transition-all active:scale-90",
                            isPlaying ? "bg-[#515044]/5 text-[#515044] hover:bg-[#515044]/10" : "bg-[#515044] text-white hover:bg-black shadow-[#515044]/20"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                        ) : (
                            <Play className="w-5 h-5 fill-current ml-1" />
                        )}
                    </button>
                </div>

                {/* Volume & Extras */}
                <div className="flex items-center justify-end gap-6 w-1/3">
                    <div className="hidden md:flex items-center gap-3 w-32 group">
                        <button onClick={toggleMute} className="text-[#515044]/40 hover:text-[#515044] transition-colors">
                            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <Slider
                            defaultValue={[volume]}
                            value={[isMuted ? 0 : volume]}
                            max={100}
                            step={1}
                            onValueChange={(val) => setVolume(val[0])}
                            className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity [&_.bg-primary]:!bg-[#515044] [&_.bg-secondary]:!bg-[#515044]/20 [&_.border-primary]:!border-[#515044]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="p-3 rounded-2xl bg-[#515044]/5 text-[#515044]/40 hover:text-[#515044] hover:bg-[#515044]/10 transition-all"
                            title="Share Station"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                        <Link to="/">
                            <button className="p-3 rounded-2xl bg-[#515044]/5 text-[#515044]/40 hover:text-[#515044] hover:bg-[#515044]/10 transition-all">
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Share Modal */}
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    currentSong={currentSong || null}
                    stationName={stationName}
                />
            </div>
        </>
    );
};

export default PersistentPlayer;
