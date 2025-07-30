
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Radio, Users } from 'lucide-react';
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
        <div className="container py-12 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-green-500" />
        </div>
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
    <Card key={event.id} className="bg-gray-800 border-green-500 overflow-hidden flex flex-col hover:border-green-400 transition-colors">
      {event.image_url && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-green-400 flex-1">{event.title}</CardTitle>
          {isRadioSchedule && (
            <Badge variant="secondary" className="ml-2">
              <Radio className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
          {!isRadioSchedule && (
            <Badge variant={event.location.toLowerCase().includes('online') ? "outline" : "default"} className="ml-2">
              {event.location.toLowerCase().includes('online') ? 'Online' : 'Offline'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-white flex-grow">
        <p className="mb-4 text-gray-300">{event.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t border-gray-700 pt-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-400" />
          <span className="text-gray-300">{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          {isRadioSchedule ? <Radio className="h-4 w-4 text-green-400" /> : <MapPin className="h-4 w-4 text-green-400" />}
          <span className="text-gray-300">{event.location}</span>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-green-400">Web3 & Crypto Events</h1>
          <p className="text-gray-300">Discover the latest crypto events and Web3 Radio broadcasts</p>
        </div>
        
        <Tabs defaultValue="community" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-green-500">
            <TabsTrigger value="community" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Users className="h-4 w-4 mr-2" />
              Community Events
            </TabsTrigger>
            <TabsTrigger value="radio" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Radio className="h-4 w-4 mr-2" />
              Radio Schedule
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="community" className="mt-6">
            {communityEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {communityEvents.map((event) => renderEventCard(event, false))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No community events scheduled</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="radio" className="mt-6">
            {radioSchedule.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {radioSchedule.map((event) => renderEventCard(event, true))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Radio className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No radio shows scheduled</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
