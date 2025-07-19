
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { fetchEvents, subscribeToTable } from '@/lib/supabase';
import { Loader } from 'lucide-react';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url?: string;
};

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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavBar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-green-400 text-center lg:text-left">Upcoming Events</h1>
        
        {events.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-gray-800 border-green-500 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                {event.image_url && (
                  <div className="w-full h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-green-400 text-base sm:text-lg line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-white flex-grow p-4 sm:p-6 pt-0">
                  <p className="mb-4 text-sm sm:text-base line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 border-t border-gray-700 pt-4 p-4 sm:p-6">
                  <div className="flex items-center gap-2 w-full">
                    <Calendar className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <MapPin className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm line-clamp-1">{event.location}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <p className="text-gray-400 text-lg sm:text-xl">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
