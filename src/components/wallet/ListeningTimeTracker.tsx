
import React from 'react';
import { useActiveAccount } from "thirdweb/react";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

interface ListeningTimeTrackerProps {
  isPlaying: boolean;
}

const ListeningTimeTracker: React.FC<ListeningTimeTrackerProps> = ({ isPlaying }) => {
  const account = useActiveAccount();
  const address = account?.address;
  const [listeningTime, setListeningTime] = React.useState<number>(0);
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  // Load saved listening time from localStorage on component mount
  React.useEffect(() => {
    if (address) {
      const savedTime = localStorage.getItem(`listening-time-${address}`);
      if (savedTime) {
        setListeningTime(parseInt(savedTime, 10));
      }
    }
  }, [address]);

  // Start/stop timer based on isPlaying state
  React.useEffect(() => {
    if (!address) return;

    if (isPlaying) {
      // Start the timer
      const interval = setInterval(() => {
        setListeningTime(prevTime => {
          const newTime = prevTime + 1;
          // Save to localStorage
          localStorage.setItem(`listening-time-${address}`, newTime.toString());
          return newTime;
        });
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
  }, [isPlaying, address, timer]);

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
    <div className="mt-2 flex items-center gap-2">
      <Clock size={14} className="text-[#00ff00]" />
      <span className="text-xs text-gray-400">Listening Time:</span>
      <Badge variant="outline" className="bg-[#111] text-[#00ff00] border-[#333] font-mono">
        {formatTime(listeningTime)}
      </Badge>
    </div>
  );
};

export default ListeningTimeTracker;
