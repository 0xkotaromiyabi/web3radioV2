
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Song {
    title: string;
    artist: string;
    album: string;
    artwork?: string;
}

interface AudioContextType {
    isPlaying: boolean;
    currentStation: string;
    volume: number;
    isMuted: boolean;
    currentSong: Song | null;
    togglePlay: () => void;
    setVolume: (vol: number) => void;
    changeStation: (station: string) => void;
    toggleMute: () => void;
    isLoading: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Station Config (Shared with RadioPlayer logic basically)
const STATIONS: Record<string, string> = {
    web3: 'https://web3radio.cloud/stream',
    Venus: 'https://stream.zeno.fm/3wiuocujuobtv',
    iradio: 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
    female: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
    delta: 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3',
    prambors: 'https://s2.cloudmu.id/listen/prambors/stream'
};

const STATION_NAMES: Record<string, string> = {
    web3: 'Web3 Radio',
    Venus: 'Venus FM',
    iradio: 'i-Radio',
    female: 'Female Radio',
    delta: 'Delta FM',
    prambors: 'Prambors FM'
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStation, setCurrentStation] = useState('web3');
    const [volume, setVolumeState] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio
        const audio = new Audio(STATIONS[currentStation]);
        audioRef.current = audio;
        audio.volume = volume / 100;

        // Handle Metadata Updates
        const fetchMetadata = async () => {
            if (!isPlaying || !['female', 'delta', 'iradio', 'prambors'].includes(currentStation)) return;

            try {
                const response = await fetch(`/api/stream-metadata/${currentStation}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.nowPlaying) {
                        setCurrentSong({
                            title: data.nowPlaying.title || 'Unknown Title',
                            artist: data.nowPlaying.artist || 'Unknown Artist',
                            album: data.nowPlaying.album || 'Live Stream',
                            artwork: data.nowPlaying.artwork
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching metadata", error);
            }
        };

        const interval = setInterval(fetchMetadata, 30000);

        // Audio Event Listeners
        const onPlay = () => {
            setIsPlaying(true);
            setIsLoading(false);
            fetchMetadata();
        };
        const onPause = () => setIsPlaying(false);
        const onError = (e: Event) => {
            console.error("Audio Error:", e);
            setIsPlaying(false);
            setIsLoading(false);
            toast({
                title: "Playback Error",
                description: "Unable to play this station right now.",
                variant: "destructive"
            });
        };
        const onWaiting = () => setIsLoading(true);
        const onPlaying = () => setIsLoading(false);

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('error', onError);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('playing', onPlaying);

        return () => {
            audio.pause();
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('playing', onPlaying);
            clearInterval(interval);
            audioRef.current = null;
        };
    }, []); // Run once on mount, we handle station changes separately to avoid destroying element unnecessarily? 
    // Actually, standard practice for simple radio is replacing src.

    // Re-implementing effect for Station Change to update src properly
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;
            audioRef.current.src = STATIONS[currentStation];
            audioRef.current.load(); // Reload with new source
            if (wasPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Auto-play prevented", error);
                        setIsPlaying(false);
                    });
                }
            }

            // Update Default Song Info
            setCurrentSong({
                title: 'Live Broadcast',
                artist: STATION_NAMES[currentStation] || currentStation,
                album: 'Web3Radio',
            });
        }
    }, [currentStation]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume / 100;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => {
                    console.error("Play failed", e);
                    toast({ title: "Error", description: "Click again to play", variant: "destructive" });
                });
            }
        }
    };

    const setVolume = (vol: number) => {
        setVolumeState(vol);
        if (vol > 0 && isMuted) setIsMuted(false);
    };

    const changeStation = (station: string) => {
        setCurrentStation(station);
    };

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <AudioContext.Provider value={{
            isPlaying,
            currentStation,
            volume,
            isMuted,
            currentSong,
            isLoading,
            togglePlay,
            setVolume,
            changeStation,
            toggleMute
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
