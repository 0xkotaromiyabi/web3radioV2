import React, { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/supabase';
import { Calendar } from 'lucide-react';

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
    const interval = setInterval(loadEvents, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatEventText = (event: Event) => {
    const date = new Date(event.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
    return `${date} - ${event.title} @ ${event.location}`;
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 rounded-xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-gray-200/60 overflow-hidden">
      <div className="flex items-center px-4 py-3">
        <div className="flex items-center gap-2 flex-shrink-0 pr-4 border-r border-gray-200/50">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-foreground">Events</span>
        </div>
        <div className="overflow-hidden ml-4 flex-1">
          <div className="animate-marquee whitespace-nowrap">
            {events.map((event, index) => (
              <span key={event.id} className="text-sm text-muted-foreground mx-4">
                {formatEventText(event)}
                {index < events.length - 1 && <span className="mx-4 text-gray-300">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsTicker;