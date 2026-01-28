import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from 'lucide-react';
import { useW3RToken } from "@/contexts/W3RTokenContext";

interface EnhancedListeningTimeTrackerProps {
  isPlaying: boolean;
}

const EnhancedListeningTimeTracker: React.FC<EnhancedListeningTimeTrackerProps> = ({ isPlaying }) => {
  const { address } = useAccount();
  const { listeningTime, updateListeningTime, rewardEligible, submitListeningSession } = useW3RToken();

  const [localListeningTime, setLocalListeningTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSubmissionRef = useRef<number>(0);
  const localTimeRef = useRef<number>(0);

  // Submission interval: 5 minutes
  const SUBMISSION_INTERVAL = 300;

  // Sync local listening time with context on mount
  useEffect(() => {
    setLocalListeningTime(listeningTime);
    localTimeRef.current = listeningTime;
  }, [listeningTime]);

  // Stable callbacks using refs
  const updateTimeRef = useRef(updateListeningTime);
  const submitSessionRef = useRef(submitListeningSession);

  useEffect(() => {
    updateTimeRef.current = updateListeningTime;
    submitSessionRef.current = submitListeningSession;
  }, [updateListeningTime, submitListeningSession]);

  // Start/stop timer based on isPlaying
  useEffect(() => {
    if (!address) return;

    if (isPlaying) {
      // Start the timer
      timerRef.current = setInterval(() => {
        localTimeRef.current += 1;
        const newTime = localTimeRef.current;

        setLocalListeningTime(newTime);
        updateTimeRef.current(newTime);

        // Submit session periodically
        const sessionDuration = newTime - lastSubmissionRef.current;
        if (sessionDuration >= SUBMISSION_INTERVAL) {
          console.log(`Submitting listening session: ${sessionDuration} seconds`);
          submitSessionRef.current(sessionDuration);
          lastSubmissionRef.current = newTime;
        }

        // Save to localStorage
        localStorage.setItem(`w3r-listening-time-${address}`, newTime.toString());
      }, 1000);
    } else {
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;

        // Submit remaining time when stopping (minimum 30 seconds)
        const sessionDuration = localTimeRef.current - lastSubmissionRef.current;
        if (sessionDuration >= 30) {
          console.log(`Submitting final listening session: ${sessionDuration} seconds`);
          submitSessionRef.current(sessionDuration);
          lastSubmissionRef.current = localTimeRef.current;
        }
      }
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, address]);

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }, []);

  if (!address) return null;

  return (
    <div className="mt-2 flex items-center gap-2 justify-center">
      <Clock size={14} className="text-blue-500" />
      <span className="text-xs text-gray-500 font-medium">Listening Time:</span>
      <Badge variant="outline" className={`bg-white shadow-sm border font-mono ${rewardEligible ? 'text-yellow-600 border-yellow-400 bg-yellow-50' : 'text-gray-900 border-gray-200'}`}>
        {formatTime(localListeningTime)}
      </Badge>
      {rewardEligible && (
        <Zap size={14} className="text-yellow-500 animate-pulse" />
      )}
      {isPlaying && (
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
      )}
    </div>
  );
};

export default EnhancedListeningTimeTracker;
