
import React from 'react';
import { useActiveAccount } from "thirdweb/react";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from 'lucide-react';
import { useW3RToken } from "@/contexts/W3RTokenContext";

interface EnhancedListeningTimeTrackerProps {
  isPlaying: boolean;
}

const EnhancedListeningTimeTracker: React.FC<EnhancedListeningTimeTrackerProps> = ({ isPlaying }) => {
  const account = useActiveAccount();
  const address = account?.address;
  const { listeningTime, updateListeningTime, rewardEligible, submitListeningSession } = useW3RToken();
  const [localListeningTime, setLocalListeningTime] = React.useState<number>(0);
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [lastSubmission, setLastSubmission] = React.useState<number>(0);

  // Initialize local listening time from context
  React.useEffect(() => {
    setLocalListeningTime(listeningTime);
  }, [listeningTime]);

  // Submit session every 5 minutes of continuous listening
  const SUBMISSION_INTERVAL = 300; // 5 minutes

  // Start/stop timer based on isPlaying state and update W3R context
  React.useEffect(() => {
    if (!address) return;

    if (isPlaying) {
      // Start the timer
      const interval = setInterval(() => {
        setLocalListeningTime(prevTime => {
          const newTime = prevTime + 1;
          updateListeningTime(newTime);

          // Submit session periodically
          const sessionDuration = newTime - lastSubmission;
          if (sessionDuration >= SUBMISSION_INTERVAL) {
            console.log(`Submitting listening session: ${sessionDuration} seconds`);
            submitListeningSession(sessionDuration);
            setLastSubmission(newTime);
          }

          // Also save to localStorage for backup
          localStorage.setItem(`w3r-listening-time-${address}`, newTime.toString());
          return newTime;
        });
      }, 1000);

      setTimer(interval);
    } else {
      // Stop the timer and submit final session if there's accumulated time
      if (timer) {
        clearInterval(timer);
        setTimer(null);

        // Submit any remaining listening time when stopping
        const sessionDuration = localListeningTime - lastSubmission;
        if (sessionDuration >= 30) { // Minimum 30 seconds
          console.log(`Submitting final listening session: ${sessionDuration} seconds`);
          submitListeningSession(sessionDuration);
          setLastSubmission(localListeningTime);
        }
      }
    }

    // Cleanup
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, address, localListeningTime, lastSubmission, updateListeningTime, submitListeningSession, timer]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

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
