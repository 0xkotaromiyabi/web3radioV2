
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

// Import the radio schedule data
const weeklySchedule = [
  // Monday
  [
    { time: "08:00-10:00", program: "Blockchain Breakfast", host: "Alex Johnson" },
    { time: "10:00-12:00", program: "DeFi Discussions", host: "Maria Garcia" },
    { time: "12:00-14:00", program: "NFT Noon", host: "Jamal Williams" },
    { time: "14:00-16:00", program: "Crypto Charts", host: "Sophie Chen" },
    { time: "16:00-18:00", program: "Web3 Wonders", host: "David Kim" },
    { time: "18:00-20:00", program: "The Ethereum Evening", host: "Elena Rodriguez" },
    { time: "20:00-22:00", program: "Metaverse Moments", host: "Marcus Lee" },
    { time: "22:00-00:00", program: "Crypto Night Owl", host: "Samantha Taylor" },
  ],
  // Tuesday through Sunday (just like in the Events page)
  // ... More days would be here, but for simplicity, let's focus on the component structure
];

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RunningText: React.FC = () => {
  const [currentPrograms, setCurrentPrograms] = useState<string>('');
  const [upcomingPrograms, setUpcomingPrograms] = useState<string>('');
  
  useEffect(() => {
    // Get the current day index (0 = Monday, 6 = Sunday in our data structure)
    const now = new Date();
    const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Find current and upcoming shows
    let currentShowText = '';
    let upcomingShowsText = '';

    // Get today's schedule
    const todaySchedule = weeklySchedule[currentDayIndex] || [];
    
    // Find the current show
    const currentShow = todaySchedule.find(show => {
      const [startTime, endTime] = show.time.split('-');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      // Check if current time falls between start and end times
      if ((currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
          (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute))) {
        return true;
      }
      return false;
    });
    
    if (currentShow) {
      currentShowText = `NOW PLAYING: ${currentShow.program} with ${currentShow.host} (${currentShow.time})`;
    } else {
      currentShowText = "Station in intermission";
    }
    
    // Find the next 3 upcoming shows
    const upcomingShows = [];
    let foundCurrentIndex = false;
    
    // First look for upcoming shows today
    for (let i = 0; i < todaySchedule.length; i++) {
      const show = todaySchedule[i];
      const [startTime] = show.time.split('-');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      
      if (startHour > currentHour || (startHour === currentHour && startMinute > currentMinute)) {
        upcomingShows.push(`COMING UP: ${show.program} with ${show.host} (${show.time})`);
        if (upcomingShows.length >= 3) break;
      }
    }
    
    // If we need more shows, look at tomorrow's schedule
    if (upcomingShows.length < 3) {
      const tomorrowIndex = (currentDayIndex + 1) % 7;
      const tomorrowSchedule = weeklySchedule[tomorrowIndex] || [];
      const tomorrowDayName = dayNames[tomorrowIndex];
      
      for (let i = 0; i < tomorrowSchedule.length && upcomingShows.length < 3; i++) {
        const show = tomorrowSchedule[i];
        upcomingShows.push(`TOMORROW (${tomorrowDayName}): ${show.program} with ${show.host} (${show.time})`);
      }
    }
    
    upcomingShowsText = upcomingShows.join(' • ');
    
    setCurrentPrograms(currentShowText);
    setUpcomingPrograms(upcomingShowsText);
    
    // Update every minute
    const interval = setInterval(() => {
      const newNow = new Date();
      // Only recalculate if minute changes to avoid unnecessary rerenders
      if (newNow.getMinutes() !== currentMinute) {
        // Trigger a recalculation by calling this function again
        setCurrentPrograms(''); // Force a re-render
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [currentPrograms]); // Re-run when currentPrograms changes (which happens when we force a re-render)
  
  const currentDate = format(new Date(), "MMMM dd, yyyy");
  
  return (
    <div className="w-full bg-gradient-to-r from-purple-900 via-blue-800 to-purple-900 text-white py-2 overflow-hidden">
      <div className="flex items-center">
        {/* Current date display */}
        <div className="hidden md:flex items-center px-4 border-r border-white/30 whitespace-nowrap">
          <Clock className="h-4 w-4 mr-2" />
          <span>{currentDate}</span>
        </div>
        
        {/* Scrolling content */}
        <div className="flex-1 relative overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4">{currentPrograms}</span>
            <span className="mx-4">•</span>
            <span className="mx-4">{upcomingPrograms}</span>
            <span className="mx-4">•</span>
            <span className="mx-4">{currentPrograms}</span>
            <span className="mx-4">•</span>
            <span className="mx-4">{upcomingPrograms}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunningText;
