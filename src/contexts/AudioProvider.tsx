
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
    analyser: AnalyserNode | null;
    handleBackground: () => void;
    handleForeground: () => void;
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
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Helper to get stream URL safely
    const getStreamUrl = (stationId: string) => {
        const station = getStationById(stationId);
        return station ? station.streamUrl : '';
    };

    // Fetch metadata function
    const fetchMetadata = async (stationId: string) => {
        const station = getStationById(stationId);
        if (!station) return;

        // Use station's own data as initial metadata
        setCurrentSong({
            title: station.description,
            artist: station.name,
            album: station.genre.toUpperCase(),
            artwork: station.image_url
        });

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
                        title: data.nowPlaying.title || station.description,
                        artist: data.nowPlaying.artist || station.name,
                        album: data.nowPlaying.album || station.genre.toUpperCase(),
                        artwork: data.nowPlaying.artwork || station.image_url
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

        // Ensure singleton audio object
        if (!audioRef.current) {
            audioRef.current = new Audio(streamUrl);
            audioRef.current.crossOrigin = "anonymous";
            audioRef.current.preload = "none";
        } else {
            audioRef.current.src = streamUrl;
        }

        const audio = audioRef.current;
        audio.volume = volume / 100;

        const onPlay = () => {
            setIsPlaying(true);
            setIsLoading(false);
        };
        const onPause = () => {
            setIsPlaying(false);
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

        // Anti-reload / Stall protection
        const onStalled = () => {
            console.log("Stream stalled, retrying...");
            if (audioRef.current && isPlaying) {
                audioRef.current.load();
                audioRef.current.play().catch(e => console.error("Re-play failed after stall", e));
            }
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('error', onError);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('playing', onPlaying);
        audio.addEventListener('stalled', onStalled);

        return () => {
            // Note: We don't pause here if we want background play to persist 
            // but since this is the global provider, it only happens on app close.
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('playing', onPlaying);
            audio.removeEventListener('stalled', onStalled);
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

    // Station Change Effect — load stream but do NOT auto-play
    useEffect(() => {
        if (audioRef.current) {
            // Stop current playback
            audioRef.current.pause();
            setIsPlaying(false);

            // Show station default info (not real metadata yet)
            const station = getStationById(currentStation);
            if (station) {
                setCurrentSong({
                    title: station.description,
                    artist: station.name,
                    album: station.genre.toUpperCase(),
                    artwork: station.image_url
                });
            }

            // Load new stream URL without playing
            const newUrl = getStreamUrl(currentStation);
            if (newUrl) {
                audioRef.current.src = newUrl;
                audioRef.current.load();
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
                setIsLoading(true);

                // Initialize AudioContext on first play
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                    analyserRef.current = audioContextRef.current.createAnalyser();
                    analyserRef.current.fftSize = 256;
                }

                // Connect source if not already connected
                if (audioRef.current && !sourceRef.current) {
                    try {
                        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
                        sourceRef.current.connect(analyserRef.current!);
                        analyserRef.current!.connect(audioContextRef.current.destination);
                    } catch (e) {
                        console.error("Failed to connect audio source to analyser", e);
                    }
                }

                // Resume AudioContext if suspended
                if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }

                audioRef.current.play()
                    .then(() => {
                        // Fetch real metadata after play starts
                        fetchMetadata(currentStation);
                    })
                    .catch(e => {
                        console.error("Play failed", e);
                        setIsLoading(false);
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

    const handleBackground = () => {
        console.log('App moved to background - Audio continuing...');
        // Radio should keep playing in background
    };

    const handleForeground = () => {
        console.log('App moved to foreground');
        // Add any specific foreground logic here if needed
    };

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
            toggleMute,
            analyser: analyserRef.current,
            handleBackground,
            handleForeground
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
