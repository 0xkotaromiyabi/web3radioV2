
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

import { STATIONS as STATION_DATA, getStationById } from '@/data/stations';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStation, setCurrentStation] = useState('web3');
    const [volume, setVolumeState] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Helper to get stream URL safely
    const getStreamUrl = (stationId: string) => {
        const station = getStationById(stationId);
        return station ? station.streamUrl : '';
    };

    // Fetch metadata function
    const fetchMetadata = async (stationId: string) => {
        const station = getStationById(stationId);
        if (!station) return;

        // Use mock metadata from database immediately to verify UI
        if (station.mockMetadata) {
            setCurrentSong({
                title: station.mockMetadata.title,
                artist: station.mockMetadata.artist,
                album: station.name,
                artwork: station.mockMetadata.artwork
            });
        }

        // Optionally try to fetch real metadata if API exists? 
        // For now, consistent mock data is better than flickering/missing data.
        // Attempt to fetch real metadata
        try {
            // Use absolute URL for extension to hit the deployed backend
            // or relative if in development context (though extension should use absolute)
            const apiUrl = import.meta.env.MODE === 'extension'
                ? `https://webthreeradio.xyz/api/stream-metadata/${stationId}`
                : `/api/stream-metadata/${stationId}`;

            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                if (data.nowPlaying) {
                    setCurrentSong({
                        title: data.nowPlaying.title || station.mockMetadata?.title || 'Unknown Title',
                        artist: data.nowPlaying.artist || station.mockMetadata?.artist || 'Unknown Artist',
                        album: data.nowPlaying.album || station.name,
                        artwork: data.nowPlaying.artwork || station.mockMetadata?.artwork
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching metadata:", error);
            // Fallback to mock is already set above
        }
    };

    useEffect(() => {
        // Initialize Audio
        const streamUrl = getStreamUrl(currentStation);
        if (!streamUrl) return;

        const audio = new Audio(streamUrl);
        audioRef.current = audio;
        audio.volume = volume / 100;

        const onPlay = () => {
            setIsPlaying(true);
            setIsLoading(false);
            fetchMetadata(currentStation);
        };
        const onPause = () => {
            setIsPlaying(false);
            // setCurrentSong(null); // Keep metadata visible while paused? User preference.
        };
        const onError = (e: Event) => {
            console.error("Audio Error:", e);
            setIsPlaying(false);
            setIsLoading(false);
            toast({
                title: "Playback Error",
                description: "Unable to play this station right now (Stream might be offline).",
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
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!isPlaying) return;
        fetchMetadata(currentStation);

        // Refresh metadata
        const interval = setInterval(() => {
            if (isPlaying) {
                fetchMetadata(currentStation);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isPlaying, currentStation]);

    // Station Change Effect
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;

            // Update Metadata immediately for new station
            fetchMetadata(currentStation);

            const newUrl = getStreamUrl(currentStation);
            if (newUrl) {
                audioRef.current.src = newUrl;
                audioRef.current.load();
                if (wasPlaying) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error("Auto-play prevented", error);
                            setIsPlaying(false);
                        });
                    }
                }
            }
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
                    toast({ title: "Error", description: "Stream might be offline", variant: "destructive" });
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
