
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Newspaper, Radio, Loader } from "lucide-react";
import { signIn, signOut, getCurrentUser, fetchNews, addNewsItem, deleteNewsItem, fetchEvents, addEvent, deleteEvent, fetchStations, addStation, deleteStation, subscribeToTable } from '@/lib/supabase';

// Type definitions for our data
type NewsItem = {
  id: number;
  title: string;
  date: string;
  content: string;
  created_at?: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  created_at?: string;
};

type Station = {
  id: number;
  name: string;
  genre: string;
  streaming: boolean;
  description: string;
  created_at?: string;
};

const CMS = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data states
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  
  const [newNewsItem, setNewNewsItem] = useState<Omit<NewsItem, 'id'>>({ 
    title: "", 
    date: new Date().toISOString().split('T')[0], 
    content: "" 
  });
  
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({ 
    title: "", 
    date: new Date().toISOString().split('T')[0], 
    location: "", 
    description: "" 
  });
  
  const [newStation, setNewStation] = useState<Omit<Station, 'id'>>({ 
    name: "", 
    genre: "", 
    streaming: true, 
    description: "" 
  });

  // Fetch current user on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      loadAllData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const loadAllData = async () => {
    await loadNews();
    await loadEvents();
    await loadStations();
  };

  const setupRealtimeSubscriptions = () => {
    // Set up real-time subscriptions for all tables
    const newsSubscription = subscribeToTable('news', () => loadNews());
    const eventsSubscription = subscribeToTable('events', () => loadEvents());
    const stationsSubscription = subscribeToTable('stations', () => loadStations());
    
    // Clean up subscriptions on component unmount
    return () => {
      newsSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
      stationsSubscription.unsubscribe();
    };
  };

  const loadNews = async () => {
    const { data, error } = await fetchNews();
    if (error) {
      toast({
        title: "Error loading news",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewsItems(data || []);
    }
  };

  const loadEvents = async () => {
    const { data, error } = await fetchEvents();
    if (error) {
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEvents(data || []);
    }
  };

  const loadStations = async () => {
    const { data, error } = await fetchStations();
    if (error) {
      toast({
        title: "Error loading stations",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setStations(data || []);
    }
  };

  // Auth handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) throw error;
      
      setUser(data.user);
      toast({
        title: "Login successful",
        description: "Welcome to Web3radio dashboard",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };

  // Data manipulation handlers
  const handleAddNewsItem = async () => {
    if (newNewsItem.title && newNewsItem.date && newNewsItem.content) {
      const { error } = await addNewsItem(newNewsItem);
      
      if (error) {
        toast({
          title: "Error adding news item",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setNewNewsItem({ title: "", date: new Date().toISOString().split('T')[0], content: "" });
        toast({
          title: "News item added",
          description: "The news item has been added successfully",
        });
      }
    }
  };

  const handleDeleteNewsItem = async (id: number) => {
    const { error } = await deleteNewsItem(id);
    
    if (error) {
      toast({
        title: "Error deleting news item",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "News item deleted",
        description: "The news item has been deleted successfully",
      });
    }
  };

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.location && newEvent.description) {
      const { error } = await addEvent(newEvent);
      
      if (error) {
        toast({
          title: "Error adding event",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setNewEvent({ title: "", date: new Date().toISOString().split('T')[0], location: "", description: "" });
        toast({
          title: "Event added",
          description: "The event has been added successfully",
        });
      }
    }
  };

  const handleDeleteEvent = async (id: number) => {
    const { error } = await deleteEvent(id);
    
    if (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully",
      });
    }
  };

  const handleAddStation = async () => {
    if (newStation.name && newStation.genre && newStation.description) {
      const { error } = await addStation(newStation);
      
      if (error) {
        toast({
          title: "Error adding radio station",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setNewStation({ name: "", genre: "", streaming: true, description: "" });
        toast({
          title: "Radio station added",
          description: "The radio station has been added successfully",
        });
      }
    }
  };

  const handleDeleteStation = async (id: number) => {
    const { error } = await deleteStation(id);
    
    if (error) {
      toast({
        title: "Error deleting radio station",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Station deleted",
        description: "The radio station has been deleted successfully",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-green-500" />
          <p className="text-green-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavBar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Card className="w-[350px] bg-gray-800 border-green-500 text-white">
            <CardHeader>
              <CardTitle className="text-green-400">Web3radio Login</CardTitle>
              <CardDescription className="text-gray-300">Enter your credentials to access the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="your@email.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                    />
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white" type="submit">Login</Button>
              </form>
              <div className="mt-4 text-sm text-center text-gray-300">
                <p>Contact Admin For Login Access</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-400">CMS Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="border-green-500 text-green-400 hover:bg-green-900 hover:text-white">Logout</Button>
        </div>

        <Tabs defaultValue="news" className="w-full">
          <TabsList className="mb-4 bg-gray-800 border-green-500 border">
            <TabsTrigger value="news" className="flex gap-2 items-center text-white data-[state=active]:bg-green-700 data-[state=active]:text-white">
              <Newspaper className="h-4 w-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="events" className="flex gap-2 items-center text-white data-[state=active]:bg-green-700 data-[state=active]:text-white">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="stations" className="flex gap-2 items-center text-white data-[state=active]:bg-green-700 data-[state=active]:text-white">
              <Radio className="h-4 w-4" />
              Radio Stations
            </TabsTrigger>
          </TabsList>

          {/* News Content Management */}
          <TabsContent value="news">
            <Card className="bg-gray-800 border-green-500 text-white">
              <CardHeader>
                <CardTitle className="text-green-400">Manage News Items</CardTitle>
                <CardDescription className="text-gray-300">Add, edit or remove news items.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Add News Form */}
                  <div className="border border-green-700 rounded-lg p-4 bg-gray-800">
                    <h3 className="text-lg font-medium mb-4 text-green-400">Add News Item</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="news-title" className="text-white">Title</Label>
                          <Input 
                            id="news-title" 
                            placeholder="News Title" 
                            value={newNewsItem.title}
                            onChange={(e) => setNewNewsItem({...newNewsItem, title: e.target.value})}
                            className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="news-date" className="text-white">Date</Label>
                          <Input 
                            id="news-date" 
                            type="date" 
                            value={newNewsItem.date}
                            onChange={(e) => setNewNewsItem({...newNewsItem, date: e.target.value})}
                            className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="news-content" className="text-white">Content</Label>
                        <Textarea 
                          id="news-content" 
                          placeholder="News content..." 
                          className="min-h-[100px] bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          value={newNewsItem.content}
                          onChange={(e) => setNewNewsItem({...newNewsItem, content: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleAddNewsItem} className="bg-green-600 hover:bg-green-700 text-white">Add News Item</Button>
                    </div>
                  </div>
                  
                  {/* News List */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-green-400">News Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-green-700">
                          <TableHead className="text-green-300">ID</TableHead>
                          <TableHead className="text-green-300">Title</TableHead>
                          <TableHead className="text-green-300">Date</TableHead>
                          <TableHead className="text-green-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newsItems.length > 0 ? (
                          newsItems.map((item) => (
                            <TableRow key={item.id} className="border-green-900/30">
                              <TableCell className="text-gray-300">{item.id}</TableCell>
                              <TableCell className="text-white">{item.title}</TableCell>
                              <TableCell className="text-gray-300">{item.date}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteNewsItem(item.id)}>Delete</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-400 py-4">No news items found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Content Management */}
          <TabsContent value="events">
            <Card className="bg-gray-800 border-green-500 text-white">
              <CardHeader>
                <CardTitle className="text-green-400">Manage Events</CardTitle>
                <CardDescription className="text-gray-300">Add, edit or remove events.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Add Event Form */}
                  <div className="border border-green-700 rounded-lg p-4 bg-gray-800">
                    <h3 className="text-lg font-medium mb-4 text-green-400">Add Event</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="event-title" className="text-white">Title</Label>
                          <Input 
                            id="event-title" 
                            placeholder="Event Title" 
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                            className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="event-date" className="text-white">Date</Label>
                          <Input 
                            id="event-date" 
                            type="date" 
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                            className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="event-location" className="text-white">Location</Label>
                        <Input 
                          id="event-location" 
                          placeholder="Event Location" 
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                          className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-description" className="text-white">Description</Label>
                        <Textarea 
                          id="event-description" 
                          placeholder="Event description..." 
                          className="min-h-[100px] bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleAddEvent} className="bg-green-600 hover:bg-green-700 text-white">Add Event</Button>
                    </div>
                  </div>
                  
                  {/* Events List */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-green-400">Events</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-green-700">
                          <TableHead className="text-green-300">ID</TableHead>
                          <TableHead className="text-green-300">Title</TableHead>
                          <TableHead className="text-green-300">Date</TableHead>
                          <TableHead className="text-green-300">Location</TableHead>
                          <TableHead className="text-green-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.length > 0 ? (
                          events.map((event) => (
                            <TableRow key={event.id} className="border-green-900/30">
                              <TableCell className="text-gray-300">{event.id}</TableCell>
                              <TableCell className="text-white">{event.title}</TableCell>
                              <TableCell className="text-gray-300">{event.date}</TableCell>
                              <TableCell className="text-white">{event.location}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-400 py-4">No events found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Radio Stations Content Management */}
          <TabsContent value="stations">
            <Card className="bg-gray-800 border-green-500 text-white">
              <CardHeader>
                <CardTitle className="text-green-400">Manage Radio Stations</CardTitle>
                <CardDescription className="text-gray-300">Add, edit or remove radio stations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Add Station Form */}
                  <div className="border border-green-700 rounded-lg p-4 bg-gray-800">
                    <h3 className="text-lg font-medium mb-4 text-green-400">Add Radio Station</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="station-name" className="text-white">Name</Label>
                          <Input 
                            id="station-name" 
                            placeholder="Station Name" 
                            value={newStation.name}
                            onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                            className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="station-genre" className="text-white">Genre</Label>
                          <Input 
                            id="station-genre" 
                            placeholder="Music Genre" 
                            value={newStation.genre}
                            onChange={(e) => setNewStation({...newStation, genre: e.target.value})}
                            className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="streaming"
                          checked={newStation.streaming}
                          onChange={(e) => setNewStation({...newStation, streaming: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300 accent-green-500"
                        />
                        <Label htmlFor="streaming" className="text-white">Currently Streaming</Label>
                      </div>
                      <div>
                        <Label htmlFor="station-description" className="text-white">Description</Label>
                        <Textarea 
                          id="station-description" 
                          placeholder="Station description..." 
                          className="min-h-[100px] bg-gray-700 text-white border-gray-600 focus:border-green-500"
                          value={newStation.description}
                          onChange={(e) => setNewStation({...newStation, description: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleAddStation} className="bg-green-600 hover:bg-green-700 text-white">Add Radio Station</Button>
                    </div>
                  </div>
                  
                  {/* Stations List */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-green-400">Radio Stations</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-green-700">
                          <TableHead className="text-green-300">ID</TableHead>
                          <TableHead className="text-green-300">Name</TableHead>
                          <TableHead className="text-green-300">Genre</TableHead>
                          <TableHead className="text-green-300">Streaming</TableHead>
                          <TableHead className="text-green-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stations.length > 0 ? (
                          stations.map((station) => (
                            <TableRow key={station.id} className="border-green-900/30">
                              <TableCell className="text-gray-300">{station.id}</TableCell>
                              <TableCell className="text-white">{station.name}</TableCell>
                              <TableCell className="text-gray-300">{station.genre}</TableCell>
                              <TableCell className="text-white">{station.streaming ? "Yes" : "No"}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteStation(station.id)}>Delete</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-400 py-4">No radio stations found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CMS;
