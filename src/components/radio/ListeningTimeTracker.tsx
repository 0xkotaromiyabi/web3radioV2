import React, { useState, useEffect, useRef } from 'react';
import { useW3RToken } from '@/contexts/W3RTokenContext';
import { useAppKitAccount } from '@reown/appkit/react';
import { Clock } from 'lucide-react';

interface ListeningTimeTrackerProps {
    isPlaying: boolean;
}

const EPOCH_DURATION_DAYS = 15;
const EPOCH_DURATION_MS = EPOCH_DURATION_DAYS * 24 * 60 * 60 * 1000;

export default function ListeningTimeTracker({ isPlaying }: ListeningTimeTrackerProps) {
    const { address, isConnected } = useAppKitAccount();
    const { listeningTime, updateListeningTime, submitListeningSession } = useW3RToken();
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const lastUpdateRef = useRef<number>(Date.now());

    // Epoch reset logic
    useEffect(() => {
        if (!address || !isConnected) return;

        const checkEpoch = () => {
            const epochKey = `w3r-epoch-start-${address}`;
            const epochStartString = localStorage.getItem(epochKey);
            const now = Date.now();

            if (!epochStartString) {
                localStorage.setItem(epochKey, now.toString());
            } else {
                const epochStart = parseInt(epochStartString, 10);
                if (now - epochStart > EPOCH_DURATION_MS) {
                    console.log('Epoch ended. Resetting listening time.');
                    updateListeningTime(0);
                    localStorage.setItem(epochKey, now.toString());
                }
            }
        };

        checkEpoch();
        const interval = setInterval(checkEpoch, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [address, isConnected, updateListeningTime]);

    // Tracking logic
    useEffect(() => {
        if (!isConnected || !address || !isPlaying) {
            if (sessionSeconds >= 30) {
                submitListeningSession(sessionSeconds);
                setSessionSeconds(0);
            }
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const delta = Math.floor((now - lastUpdateRef.current) / 1000);

            if (delta >= 1) {
                // Use functional update to avoid stale state issues if context supported it
                // Since it doesn't, we rely on the context's listeningTime
                updateListeningTime(listeningTime + delta);
                setSessionSeconds(prev => prev + delta);
                lastUpdateRef.current = now;
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            lastUpdateRef.current = Date.now();
        };
    }, [isConnected, address, isPlaying, listeningTime, updateListeningTime, submitListeningSession, sessionSeconds]);

    // Periodic submission to backend (every 2 minutes)
    useEffect(() => {
        if (sessionSeconds >= 120) {
            submitListeningSession(sessionSeconds);
            setSessionSeconds(0);
        }
    }, [sessionSeconds, submitListeningSession]);

    if (!isConnected) return null;

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center gap-1 mt-6 mb-4 animate-in fade-in slide-in-from-top-2 duration-700">
            <div className="flex items-center gap-2 text-[#515044]/30 text-[9px] font-bold uppercase tracking-[0.3em]">
                <Clock className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-emerald-500' : ''}`} />
                Epoch Listening Time
            </div>
            <div className="text-3xl font-black text-[#515044] tracking-tighter tabular-nums">
                {formatTime(listeningTime)}
            </div>
            <div className="flex items-center gap-3">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#515044]/20 border-r border-[#515044]/10 pr-3">
                    15D RESET CYCLE
                </p>
                <p className={`text-[7px] font-black uppercase tracking-[0.2em] ${isPlaying ? 'text-emerald-500/60' : 'text-amber-500/60'}`}>
                    {isPlaying ? 'Tracking Active' : 'Paused'}
                </p>
            </div>
        </div>
    );
}
