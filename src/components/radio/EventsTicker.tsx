import React, { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/supabase';

interface EventsTickerProps {
  isMobile: boolean;
}

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url?: string;
};

const EventsTicker = ({ isMobile }: EventsTickerProps) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await fetchEvents();
        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();
    const interval = setInterval(loadEvents, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatEventText = (event: Event) => {
    const date = new Date(event.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
    return `📅 ${date} - ${event.title} @ ${event.location}`;
  };

  const createEventText = () => {
    if (events.length === 0) {
      return "📅 Loading upcoming events...";
    }
    
    // Create multiple copies for seamless looping
    const eventTexts = events.map(formatEventText);
    const repeatedEvents = [...eventTexts, ...eventTexts, ...eventTexts];
    return repeatedEvents.join(" • ");
  };

  return (
    <div className={`h-${isMobile ? '12' : '8'} bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden rounded`}>
      <div className="animate-text-clip whitespace-nowrap h-full flex items-center">
        <span className="text-[#00ff00] font-mono text-xs sm:text-sm">
          {createEventText()}
        </span>
      </div>
    </div>
  );
};

export default EventsTicker;