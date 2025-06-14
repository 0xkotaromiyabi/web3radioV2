
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
  const { listeningTime, updateListeningTime, claimEligible, pendingRewards } = useW3RToken();
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  // Start/stop timer based on isPlaying state and update W3R context
  React.useEffect(() => {
    if (!address) return;

    if (isPlaying) {
      // Start the timer
      const interval = setInterval(() => {
        const newTime = listeningTime + 1;
        updateListeningTime(newTime);
        
        // Also save to localStorage for backup
        localStorage.setItem(`listening-time-${address}`, newTime.toString());
      }, 1000);
      
      setTimer(interval);
    } else {
      // Stop the timer
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    }

    // Cleanup
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, address, listeningTime, updateListeningTime, timer]);

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
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-[#00ff00]" />
        <span className="text-xs text-gray-400">Listening Time:</span>
        <Badge variant="outline" className={`bg-[#111] border-[#333] font-mono ${claimEligible ? 'text-yellow-400 border-yellow-400' : 'text-[#00ff00]'}`}>
          {formatTime(listeningTime)}
        </Badge>
        {claimEligible && (
          <Zap size={14} className="text-yellow-400 animate-pulse" />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Pending:</span>
        <Badge variant="outline" className="bg-[#111] text-yellow-400 border-[#333] font-mono text-xs">
          {pendingRewards.toLocaleString()} W3R
        </Badge>
      </div>
    </div>
  );
};

export default EnhancedListeningTimeTracker;
