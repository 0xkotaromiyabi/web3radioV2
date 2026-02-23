
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Radio, Users, Briefcase, Newspaper, Sparkles, Map } from 'lucide-react';
import { fetchEvents, subscribeToTable } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '@/types/content';
import NewspaperLayout from '@/components/events/NewspaperLayout';

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

  // Filter content by category
  const newsAndJobs = events.filter(e => e.category === 'news' || e.category === 'job');
  const web3Events = events.filter(e => e.category === 'event' || !e.category);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'news': return <Newspaper className="h-3 w-3" />;
      case 'job': return <Briefcase className="h-3 w-3" />;
      default: return <Sparkles className="h-3 w-3" />;
    }
  };

  const renderEventCard = (event: Event) => (
    <div key={event.id} className="bg-white/80 backdrop-blur-xl border border-[#515044]/5 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col h-full hover:-translate-y-1">
      {event.image_url && (
        <div className="w-full h-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Link to={`/events/${event.slug || event.id}`} className="block h-full">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </Link>
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-white/90 backdrop-blur-md text-[#515044] border-none px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-sm">
              <span className="flex items-center gap-1.5">
                {getCategoryIcon(event.category)}
                {event.category || 'Event'}
              </span>
            </Badge>
          </div>
        </div>
      )}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#515044] leading-tight mb-3 group-hover:text-black transition-colors">
          <Link to={`/events/${event.slug || event.id}`}>
            {event.title}
          </Link>
        </h3>
        <p className="text-[#515044]/60 text-sm line-clamp-2 mb-8 leading-relaxed font-light">
          {event.description}
        </p>
        <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-[#515044]/5">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30">Date</span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#515044]/60 uppercase">
              <Calendar className="h-3 w-3 text-[#515044]/20" />
              <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30">Location</span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#515044]/60 uppercase truncate">
              <MapPin className="h-3 w-3 text-[#515044]/20" />
              <span className="truncate">{event.location}</span>
            </div>
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

      <main className="container mx-auto px-6 py-12 md:py-24 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-[#515044]/5 text-[#515044] hover:bg-[#515044]/10 border-[#515044]/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
              Hub & Broadcast
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#515044]">
              Web3 Events & Hub
            </h1>
            <p className="text-xl text-[#515044]/60 font-light leading-relaxed">
              Explore the latest in Web3, from industry news and career opportunities to live broadcasts and community events.
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-[32px] p-4 border border-[#515044]/5 flex items-center gap-6">
            <div className="flex flex-col items-center px-4 border-r border-[#515044]/10">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30">Broadcasts</span>
              <span className="text-xl font-bold">Live</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30">Active Now</span>
              <span className="text-xl font-bold">{events.length}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="bg-white/60 backdrop-blur-xl p-1.5 rounded-3xl border border-[#515044]/5 shadow-sm inline-flex">
              <TabsTrigger
                value="events"
                className="rounded-2xl px-8 py-4 data-[state=active]:bg-[#515044] data-[state=active]:text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                <Sparkles className="h-4 w-4 mr-3" />
                Web3 Events
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="rounded-2xl px-8 py-4 data-[state=active]:bg-[#515044] data-[state=active]:text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                <Newspaper className="h-4 w-4 mr-3" />
                News & Jobs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events" className="mt-0 ring-0 focus:outline-none">
            {web3Events.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {web3Events.map((event) => renderEventCard(event))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/40 backdrop-blur-xl rounded-[48px] border-2 border-dashed border-[#515044]/5">
                <Users className="h-16 w-16 text-[#515044]/10 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#515044] uppercase tracking-widest">No Events Found</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/20 mt-2">Check back later for upcoming Web3 events</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news" className="mt-0 ring-0 focus:outline-none">
            <NewspaperLayout />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Events;
