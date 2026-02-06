
import React, { useState } from 'react';
import { useAudio } from '@/contexts/AudioProvider';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, ExternalLink, ListMusic, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import logo from '@/assets/web3radio-logo.png';
import { STATIONS, getStationById } from '@/data/stations';

const ExtensionHome = () => {
    const {
        isPlaying,
        togglePlay,
        currentSong,
        currentStation,
        changeStation,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        isLoading
    } = useAudio();

    const [viewMode, setViewMode] = useState<'player' | 'list'>('player');

    // Get current station info from centralized data
    const currentStationInfo = getStationById(currentStation);

    const handleNextStation = () => {
        const currentIndex = STATIONS.findIndex(s => s.id === currentStation);
        const nextIndex = (currentIndex + 1) % STATIONS.length;
        changeStation(STATIONS[nextIndex].id);
    };

    const handlePrevStation = () => {
        const currentIndex = STATIONS.findIndex(s => s.id === currentStation);
        const prevIndex = (currentIndex - 1 + STATIONS.length) % STATIONS.length;
        changeStation(STATIONS[prevIndex].id);
    };

    const handleStationSelect = (stationId: string) => {
        changeStation(stationId);
        // If not playing, start playing? AudioProvider usually handles play on change if was playing.
        // We can force play if desired, but AudioProvider logic is: if wasPlaying, play new. 
        // If stopped, just change station.
        // Let's toggle play if it was stopped.
        if (!isPlaying) {
            togglePlay();
        }
        setViewMode('player');
    };

    const openWeb = () => window.open('https://webthreeradio.xyz', '_blank');

    return (
        <div className="w-[400px] h-[600px] bg-background flex flex-col overflow-hidden text-foreground">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-border/50 bg-background/50 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={openWeb}>
                    <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                    <span className="font-semibold text-sm">Web3Radio</span>
                </div>
                <div className="flex items-center gap-1">
                    {viewMode === 'list' ? (
                        <Button variant="ghost" size="icon" onClick={() => setViewMode('player')} title="Back to Player">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} title="Station List">
                            <ListMusic className="w-4 h-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={openWeb} title="Open Full App">
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {viewMode === 'list' ? (
                    <div className="h-full overflow-y-auto p-4 space-y-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Select Station</h3>
                        {STATIONS.map((station) => (
                            <div
                                key={station.id}
                                onClick={() => handleStationSelect(station.id)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                                    currentStation === station.id
                                        ? "bg-primary/10 border-primary/20"
                                        : "hover:bg-accent/50 border-transparent hover:border-border"
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    {station.image_url ? (
                                        <img src={station.image_url} alt={station.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-accent">
                                            <Music className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={cn("text-sm font-medium truncate", currentStation === station.id && "text-primary")}>
                                        {station.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground capitalize truncate">{station.genre}</p>
                                </div>
                                {currentStation === station.id && isPlaying && (
                                    <div className="flex gap-0.5 items-end h-3">
                                        <span className="w-0.5 h-1.5 bg-primary animate-[music-bar_0.5s_ease-in-out_infinite]" />
                                        <span className="w-0.5 h-3 bg-primary animate-[music-bar_0.5s_ease-in-out_infinite_0.1s]" />
                                        <span className="w-0.5 h-2 bg-primary animate-[music-bar_0.5s_ease-in-out_infinite_0.2s]" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 space-y-6 h-full">
                        {/* Album Art */}
                        <div className="relative group">
                            <div className={`w-48 h-48 rounded-2xl shadow-xl overflow-hidden transition-transform duration-500 ${isPlaying ? 'scale-100' : 'scale-95 opacity-90'}`}>
                                {currentSong?.artwork ? (
                                    <img src={currentSong.artwork} alt="Artwork" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                        <Music className="w-20 h-20 text-foreground/20" />
                                    </div>
                                )}
                            </div>
                            {isPlaying && (
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary animate-pulse" />
                            )}
                        </div>

                        {/* Meta Data */}
                        <div className="text-center w-full px-4">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 truncate">
                                {currentSong?.title || currentStationInfo?.name || 'Live Radio'}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                {currentSong?.artist || (currentSong?.title ? currentStationInfo?.name : 'Streaming Now')}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                            <Button variant="ghost" size="icon" onClick={handlePrevStation} className="hover:bg-accent/10">
                                <SkipBack className="w-6 h-6 fill-current" />
                            </Button>

                            <Button
                                onClick={togglePlay}
                                className="w-16 h-16 rounded-full shadow-lg hover:scale-105 transition-transform bg-primary text-primary-foreground flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-8 h-8 fill-current" />
                                ) : (
                                    <Play className="w-8 h-8 fill-current ml-1" />
                                )}
                            </Button>

                            <Button variant="ghost" size="icon" onClick={handleNextStation} className="hover:bg-accent/10">
                                <SkipForward className="w-6 h-6 fill-current" />
                            </Button>
                        </div>

                        {/* Live Indicator */}
                        {isPlaying && (
                            <div className="absolute top-4 right-6 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-medium text-red-500 uppercase tracking-wider">Live</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Volume */}
            <div className="h-16 px-6 flex items-center gap-4 bg-background/50 border-t border-border/50 shrink-0">
                <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={(val) => setVolume(val[0])}
                    className="flex-1"
                />
            </div>
        </div>
    );
};

export default ExtensionHome;
