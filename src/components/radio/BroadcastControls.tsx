import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, Play, Pause, Square, Upload, Volume2, Radio, Info, Laptop } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BroadcastControlsProps {
    onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected') => void;
}

export default function BroadcastControls({ onStatusChange }: BroadcastControlsProps) {
    // --- Audio State ---
    const [isMicActive, setIsMicActive] = useState(false);
    const [isSysAudioActive, setIsSysAudioActive] = useState(false);
    const [isPlayingFile, setIsPlayingFile] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [currentTime, setCurrentTime] = useState<string>('00:00:00');

    // --- Volumes ---
    const [masterVolume, setMasterVolume] = useState(0.8);
    const [micVolume, setMicVolume] = useState(1.0);
    const [sysVolume, setSysVolume] = useState(0.8);
    const [fileVolume, setFileVolume] = useState(0.7);

    // --- Refs for Audio Engine ---
    const audioContextRef = useRef<AudioContext | null>(null);

    // Input Sources
    const micStreamRef = useRef<MediaStream | null>(null);
    const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const sysStreamRef = useRef<MediaStream | null>(null);
    const sysSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const fileSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const fileBufferRef = useRef<AudioBuffer | null>(null);

    // Gain Nodes
    const masterGainRef = useRef<GainNode | null>(null);
    const micGainRef = useRef<GainNode | null>(null);
    const sysGainRef = useRef<GainNode | null>(null);
    const fileGainRef = useRef<GainNode | null>(null);

    // Worklet / Processor for Streaming
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    // --- UI State ---
    const [currentTrack, setCurrentTrack] = useState<string>('No track loaded');
    const [fileDuration, setFileDuration] = useState<number>(0);

    // --- Initialize Audio Context ---
    useEffect(() => {
        const initAudio = () => {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass({ sampleRate: 44100 });
            audioContextRef.current = ctx;

            // Master Gain
            const masterGain = ctx.createGain();
            masterGain.gain.value = masterVolume;
            masterGain.connect(ctx.destination); // Connect to local speakers (monitor)
            masterGainRef.current = masterGain;

            // Mic Gain
            const micGain = ctx.createGain();
            micGain.gain.value = 0; // Start muted
            micGain.connect(masterGain);
            micGainRef.current = micGain;

            // System Audio Gain
            const sysGain = ctx.createGain();
            sysGain.gain.value = 0; // Start muted
            sysGain.connect(masterGain);
            sysGainRef.current = sysGain;

            // File Gain
            const fileGain = ctx.createGain();
            fileGain.gain.value = fileVolume;
            fileGain.connect(masterGain);
            fileGainRef.current = fileGain;
        };

        if (!audioContextRef.current) {
            initAudio();
        }

        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    // --- Clock ---
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-GB'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- Volume Updates ---
    useEffect(() => {
        if (masterGainRef.current) masterGainRef.current.gain.value = masterVolume;
    }, [masterVolume]);

    useEffect(() => {
        if (micGainRef.current) micGainRef.current.gain.value = isMicActive ? micVolume : 0;
    }, [micVolume, isMicActive]);

    useEffect(() => {
        if (sysGainRef.current) sysGainRef.current.gain.value = isSysAudioActive ? sysVolume : 0;
    }, [sysVolume, isSysAudioActive]);

    useEffect(() => {
        if (fileGainRef.current) fileGainRef.current.gain.value = fileVolume;
    }, [fileVolume]);

    // --- WebSocket & Streaming Logic ---
    const startBroadcast = useCallback(() => {
        if (!audioContextRef.current || !masterGainRef.current) return;

        setStatus('connecting');
        onStatusChange?.('connecting');

        // Connect to WebSocket Server (Backend)
        const ws = new WebSocket('ws://localhost:3001'); // Adjust port as needed
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WS Connected');
            ws.send(JSON.stringify({
                type: 'connect',
                config: {
                    host: 'web3radio.cloud',
                    port: 8000,
                    password: 'passweb3radio', // In production, get field inputs
                    mountpoint: '/stream'
                }
            }));
            setStatus('connected');
            setIsBroadcasting(true);
            onStatusChange?.('connected');
        };

        ws.onclose = () => {
            console.log('WS Closed');
            setStatus('disconnected');
            setIsBroadcasting(false);
            onStatusChange?.('disconnected');
        };

        ws.onerror = (err) => {
            console.error('WS Error', err);
            setStatus('disconnected');
            setIsBroadcasting(false);
        };

        // Setup ScriptProcessor for scraping audio data
        // Note: ScriptProcessor is deprecated but easiest for raw PCM extraction without AudioWorklet files
        const processor = audioContextRef.current.createScriptProcessor(4096, 2, 2);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
                // Interleave channels (L, R, L, R...)
                const left = e.inputBuffer.getChannelData(0);
                const right = e.inputBuffer.getChannelData(1);
                const interleaved = new Float32Array(left.length * 2);

                for (let i = 0; i < left.length; i++) {
                    interleaved[i * 2] = left[i];
                    interleaved[i * 2 + 1] = right[i];
                }

                // Send raw float32 buffer to backend
                ws.send(JSON.stringify({ type: 'audio', buffer: Array.from(interleaved) }));
            }
        };

        // Connect Master Gain -> Processor -> Destination (to keep graph alive)
        masterGainRef.current.connect(processor);
        processor.connect(audioContextRef.current.destination);

    }, [onStatusChange]);

    const stopBroadcast = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (processorRef.current && masterGainRef.current && audioContextRef.current) {
            processorRef.current.disconnect();
            masterGainRef.current.disconnect(processorRef.current);
            // Reconnect master to destination to keep hearing local audio
            masterGainRef.current.connect(audioContextRef.current.destination);
        }
        setIsBroadcasting(false);
        setStatus('disconnected');
        onStatusChange?.('disconnected');
    }, [onStatusChange]);


    // --- Mic Handling ---
    const toggleMic = async () => {
        if (!audioContextRef.current || !micGainRef.current) return;

        if (isMicActive) {
            setIsMicActive(false);
        } else {
            try {
                if (!micStreamRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    micStreamRef.current = stream;
                    const source = audioContextRef.current.createMediaStreamSource(stream);
                    micSourceRef.current = source;
                    source.connect(micGainRef.current);
                }
                setIsMicActive(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access microphone.");
            }
        }
    };

    // --- System Audio Handling ---
    const toggleSysAudio = async () => {
        if (!audioContextRef.current || !sysGainRef.current) return;

        if (isSysAudioActive) {
            // Stop system audio
            if (sysStreamRef.current) {
                sysStreamRef.current.getTracks().forEach(track => track.stop());
                sysStreamRef.current = null;
            }
            setIsSysAudioActive(false);
            if (sysSourceRef.current) {
                sysSourceRef.current.disconnect();
                sysSourceRef.current = null;
            }
        } else {
            try {
                // @ts-ignore - getDisplayMedia exists
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

                // We only need audio, so we can stop the video track immediately to save resources/not show preview
                // However, some browsers might stop the audio if video is stopped too early.
                // For now, let's keep it but just ignore it.

                sysStreamRef.current = stream;
                const source = audioContextRef.current.createMediaStreamSource(stream);
                sysSourceRef.current = source;
                source.connect(sysGainRef.current);
                setIsSysAudioActive(true);

                // Handle user stopping stream via browser UI
                stream.getVideoTracks()[0].onended = () => {
                    setIsSysAudioActive(false);
                };
            } catch (err) {
                console.error("Error accessing system audio", err);
                alert("Could not capture system audio. Make sure to share 'Tab Audio' or 'System Audio'.");
            }
        }
    };

    // --- File Handling ---
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !audioContextRef.current) return;

        setCurrentTrack(file.name);
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        fileBufferRef.current = audioBuffer;
        setFileDuration(audioBuffer.duration);
    };

    const playFile = () => {
        if (!audioContextRef.current || !fileBufferRef.current || !fileGainRef.current) return;
        if (isPlayingFile) return;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = fileBufferRef.current;
        source.connect(fileGainRef.current);
        source.onended = () => setIsPlayingFile(false);

        fileSourceRef.current = source;
        source.start(0);
        setIsPlayingFile(true);
    };

    const stopFile = () => {
        if (fileSourceRef.current) {
            try {
                fileSourceRef.current.stop();
            } catch (e) { /* ignore */ }
            fileSourceRef.current = null;
        }
        setIsPlayingFile(false);
    };


    return (
        <Card className="w-full h-full border-zinc-800 bg-black/40 backdrop-blur-xl text-white shadow-2xl overflow-y-auto">
            <CardHeader className="pb-2 border-b border-zinc-800/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Radio className={cn("w-5 h-5", isBroadcasting ? "text-red-500 animate-pulse" : "text-zinc-500")} />
                        <CardTitle className="text-base sm:text-lg font-bold tracking-tight">ON AIR / CONTROL ROOM</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
                        <Badge variant={isBroadcasting ? "destructive" : "secondary"} className="uppercase text-[10px] sm:text-xs">
                            {status}
                        </Badge>
                        <span className="text-zinc-400">{currentTime}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Main Transport Controls */}
                <div className="flex justify-center gap-3 sm:gap-4">
                    {!isBroadcasting ? (
                        <Button
                            onClick={startBroadcast}
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white w-28 sm:w-32 text-sm sm:text-base shadow-[0_0_20px_rgba(220,38,38,0.5)] border-none"
                        >
                            START AIR
                        </Button>
                    ) : (
                        <Button
                            onClick={stopBroadcast}
                            size="lg"
                            variant="secondary"
                            className="w-28 sm:w-32 text-sm sm:text-base"
                        >
                            STOP AIR
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">

                    {/* Left Column: Mixer */}
                    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">

                        {/* Master */}
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-zinc-400">MASTER OUTPUT</h3>
                                <span className="text-xs font-mono text-cyan-400">{Math.round(masterVolume * 100)}%</span>
                            </div>
                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5"
                                value={[masterVolume]}
                                max={1}
                                step={0.01}
                                onValueChange={(val) => setMasterVolume(val[0])}
                            >
                                <Slider.Track className="bg-zinc-800 relative grow rounded-full h-[3px]">
                                    <Slider.Range className="absolute bg-cyan-500 rounded-full h-full" />
                                </Slider.Track>
                                <Slider.Thumb
                                    className="block w-5 h-5 bg-white border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full hover:scale-110 focus:outline-none transition-transform"
                                    aria-label="Master Volume"
                                />
                            </Slider.Root>
                        </div>

                        {/* Mic Control */}
                        <div className="space-y-2 mt-3 sm:mt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Mic className={cn("w-4 h-4", isMicActive ? "text-green-400" : "text-zinc-500")} />
                                    <span className="text-sm font-medium">MICROPHONE</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant={isMicActive ? "default" : "outline"}
                                    className={cn("h-6 text-xs", isMicActive && "bg-green-600 hover:bg-green-700")}
                                    onClick={toggleMic}
                                >
                                    {isMicActive ? "ON" : "OFF"}
                                </Button>
                            </div>
                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5"
                                value={[micVolume]}
                                max={1}
                                step={0.01}
                                onValueChange={(val) => setMicVolume(val[0])}
                            >
                                <Slider.Track className="bg-zinc-800 relative grow rounded-full h-[3px]">
                                    <Slider.Range className="absolute bg-green-500 rounded-full h-full" />
                                </Slider.Track>
                                <Slider.Thumb className="block w-4 h-4 bg-zinc-200 border border-green-500 rounded-full focus:outline-none" />
                            </Slider.Root>
                        </div>

                        {/* System Audio Control */}
                        <div className="space-y-2 mt-3 sm:mt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Laptop className={cn("w-4 h-4", isSysAudioActive ? "text-orange-400" : "text-zinc-500")} />
                                    <span className="text-sm font-medium">AUDIO CAPTURE</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant={isSysAudioActive ? "default" : "outline"}
                                    className={cn("h-6 text-xs", isSysAudioActive && "bg-orange-600 hover:bg-orange-700")}
                                    onClick={toggleSysAudio}
                                >
                                    {isSysAudioActive ? "ON" : "OFF"}
                                </Button>
                            </div>
                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5"
                                value={[sysVolume]}
                                max={1}
                                step={0.01}
                                onValueChange={(val) => setSysVolume(val[0])}
                            >
                                <Slider.Track className="bg-zinc-800 relative grow rounded-full h-[3px]">
                                    <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
                                </Slider.Track>
                                <Slider.Thumb className="block w-4 h-4 bg-zinc-200 border border-orange-500 rounded-full focus:outline-none" />
                            </Slider.Root>
                        </div>
                    </div>

                    {/* Right Column: Deck / Player */}
                    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-zinc-400">DECK A (LOCAL FILE)</h3>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                className="text-xs text-zinc-500 w-full sm:w-auto file:mr-2 sm:file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-400 hover:file:bg-zinc-700"
                            />
                        </div>

                        <div className="bg-black/80 p-3 rounded-lg border border-zinc-800/50 mb-3 sm:mb-4 h-14 sm:h-16 flex items-center justify-center">
                            <p className="text-cyan-400 font-mono text-xs sm:text-sm truncate animate-pulse">
                                {isPlayingFile ? `▶ ${currentTrack}` : currentTrack}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 justify-center">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
                                onClick={playFile}
                                disabled={isPlayingFile}
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full w-8 h-8 sm:w-10 sm:h-10 border border-zinc-700"
                                onClick={() => {
                                    if (fileSourceRef.current) {
                                        // Simplified Pause (actually stop for now)
                                        stopFile();
                                    }
                                }}
                            >
                                <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full w-8 h-8 sm:w-10 sm:h-10 border border-zinc-700 hover:text-red-400"
                                onClick={stopFile}
                            >
                                <Square className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                            </Button>
                        </div>

                        <div className="space-y-1 mt-2 sm:mt-3">
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Volume</span>
                                <span>{Math.round(fileVolume * 100)}%</span>
                            </div>
                            <Slider.Root
                                className="relative flex items-center select-none touch-none w-full h-5"
                                value={[fileVolume]}
                                max={1}
                                step={0.01}
                                onValueChange={(val) => setFileVolume(val[0])}
                            >
                                <Slider.Track className="bg-zinc-800 relative grow rounded-full h-[3px]">
                                    <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
                                </Slider.Track>
                                <Slider.Thumb className="block w-4 h-4 bg-zinc-200 border border-indigo-500 rounded-full focus:outline-none" />
                            </Slider.Root>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
