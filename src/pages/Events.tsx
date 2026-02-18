
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Radio, Users } from 'lucide-react';
import { fetchEvents, subscribeToTable } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

import { Link } from 'react-router-dom';
import { Event } from '@/types/content';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await fetchEvents();
        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Set up real-time subscription
    const subscription = subscribeToTable('events', () => {
      loadEvents();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef29c] flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#515044]/50" />
      </div>
    );
  }

  // Filter events by type
  const communityEvents = events.filter(event =>
    !event.title.toLowerCase().includes('web3 radio schedule') &&
    !event.location.toLowerCase().includes('web3 radio studio')
  );

  const radioSchedule = events.filter(event =>
    event.title.toLowerCase().includes('web3 radio schedule') ||
    event.location.toLowerCase().includes('web3 radio studio')
  );

  const renderEventCard = (event: Event, isRadioSchedule = false) => (
    <div key={event.id} className="bg-white/90 backdrop-blur border border-[#515044]/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all group flex flex-col">
      {event.image_url && (
        <div className="w-full h-48 overflow-hidden relative">
          <Link to={`/events/${event.slug || event.id}`}>
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="text-xl font-bold text-[#515044]/90 leading-tight group-hover:text-black transition-colors flex-1">
            <Link to={`/events/${event.slug || event.id}`}>
              {event.title}
            </Link>
          </h3>
          {isRadioSchedule && (
            <div className="bg-[#515044] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
              <Radio className="h-2 w-2" /> Live
            </div>
          )}
        </div>
        <p className="text-[#515044]/70 text-sm line-clamp-2 mb-6 leading-relaxed">
          {event.description}
        </p>
        <div className="mt-auto space-y-2 pt-4 border-t border-[#515044]/5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#515044]/40">
            <Calendar className="h-3 w-3" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#515044]/40">
            {isRadioSchedule ? <Radio className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
        body { font-family: 'Raleway', sans-serif; }
      `}</style>
      <NavBar />
      <div className="w-[90%] md:w-[70%] mt-24 md:mt-28 mb-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#515044]/80">EVENTS & SCHEDULES</h1>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold opacity-30 mt-2">
            Discover the latest crypto events and broadcasts
          </p>
        </div>

        <Tabs defaultValue="community" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur p-1.5 rounded-2xl border border-[#515044]/10 shadow-sm mb-10">
            <TabsTrigger value="community" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#515044] data-[state=active]:text-white font-bold text-xs transition-all tracking-wider">
              <Users className="h-4 w-4 mr-2" />
              COMMUNITY
            </TabsTrigger>
            <TabsTrigger value="radio" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#515044] data-[state=active]:text-white font-bold text-xs transition-all tracking-wider">
              <Radio className="h-4 w-4 mr-2" />
              CALENDAR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="community" className="mt-0">
            {communityEvents.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {communityEvents.map((event) => renderEventCard(event, false))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/50 backdrop-blur rounded-3xl border border-dashed border-[#515044]/20">
                <Users className="h-12 w-12 text-[#515044]/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#515044]/60 mb-2 uppercase tracking-widest">No Events</h3>
              </div>
            )}
          </TabsContent>

          <TabsContent value="radio" className="mt-0">
            {radioSchedule.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {radioSchedule.map((event) => renderEventCard(event, true))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/50 backdrop-blur rounded-3xl border border-dashed border-[#515044]/20">
                <Radio className="h-12 w-12 text-[#515044]/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#515044]/60 mb-2 uppercase tracking-widest">No Shows</h3>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
