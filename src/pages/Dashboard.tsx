
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Newspaper, Radio, Loader, Eye, Trash2, Plus } from "lucide-react";
import { signIn, signOut, getCurrentUser, fetchNews, deleteNewsItem, fetchEvents, deleteEvent, fetchStations, deleteStation, subscribeToTable } from '@/lib/supabase';
import NewsEditor from '@/components/cms/NewsEditor';
import EventEditor from '@/components/cms/EventEditor';
import StationEditor from '@/components/cms/StationEditor';

// Type definitions
type NewsItem = {
  id: number;
  title: string;
  date: string;
  content: string;
  image_url?: string;
  created_at?: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url?: string;
  created_at?: string;
};

type Station = {
  id: number;
  name: string;
  genre: string;
  streaming: boolean;
  description: string;
  image_url?: string;
  created_at?: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data states
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  // Check authentication on mount
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

  // Load data when authenticated
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
    const newsSubscription = subscribeToTable('news', () => loadNews());
    const eventsSubscription = subscribeToTable('events', () => loadEvents());
    const stationsSubscription = subscribeToTable('stations', () => loadStations());
    
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

  const handleSaveComplete = () => {
    setShowEditor(false);
    loadAllData();
  };

  // Delete handlers
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

  const handleDeleteStation = async (id: number) => {
    const { error } = await deleteStation(id);
    
    if (error) {
      toast({
        title: "Error deleting station",
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
              <CardTitle className="text-green-400">Dashboard Login</CardTitle>
              <CardDescription className="text-gray-300">Enter your credentials to access the content management system.</CardDescription>
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
          <h1 className="text-3xl font-bold text-green-400">Content Management Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="border-green-500 text-green-400 hover:bg-green-900 hover:text-white">Logout</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          {/* News Management */}
          <TabsContent value="news">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-green-400">News Management</h2>
                <Button 
                  onClick={() => setShowEditor(!showEditor)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showEditor ? 'Hide Editor' : 'Add Article'}
                </Button>
              </div>

              {showEditor && (
                <NewsEditor onSave={handleSaveComplete} />
              )}

              <Card className="bg-gray-800 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-400">Published Articles</CardTitle>
                  <CardDescription className="text-gray-300">Manage your news articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-700">
                        <TableHead className="text-green-300">Image</TableHead>
                        <TableHead className="text-green-300">Title</TableHead>
                        <TableHead className="text-green-300">Date</TableHead>
                        <TableHead className="text-green-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsItems.length > 0 ? (
                        newsItems.map((item) => (
                          <TableRow key={item.id} className="border-green-900/30">
                            <TableCell>
                              {item.image_url && (
                                <img src={item.image_url} alt={item.title} className="w-12 h-12 object-cover rounded" />
                              )}
                            </TableCell>
                            <TableCell className="text-white">{item.title}</TableCell>
                            <TableCell className="text-gray-300">{item.date}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/news`)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteNewsItem(item.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400 py-4">No news articles found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Management */}
          <TabsContent value="events">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-green-400">Events Management</h2>
                <Button 
                  onClick={() => setShowEditor(!showEditor)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showEditor ? 'Hide Editor' : 'Add Event'}
                </Button>
              </div>

              {showEditor && (
                <EventEditor onSave={handleSaveComplete} />
              )}

              <Card className="bg-gray-800 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-400">Published Events</CardTitle>
                  <CardDescription className="text-gray-300">Manage your events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-700">
                        <TableHead className="text-green-300">Image</TableHead>
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
                            <TableCell>
                              {event.image_url && (
                                <img src={event.image_url} alt={event.title} className="w-12 h-12 object-cover rounded" />
                              )}
                            </TableCell>
                            <TableCell className="text-white">{event.title}</TableCell>
                            <TableCell className="text-gray-300">{event.date}</TableCell>
                            <TableCell className="text-white">{event.location}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/events`)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stations Management */}
          <TabsContent value="stations">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-green-400">Radio Stations Management</h2>
                <Button 
                  onClick={() => setShowEditor(!showEditor)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showEditor ? 'Hide Editor' : 'Add Station'}
                </Button>
              </div>

              {showEditor && (
                <StationEditor onSave={handleSaveComplete} />
              )}

              <Card className="bg-gray-800 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-400">Radio Stations</CardTitle>
                  <CardDescription className="text-gray-300">Manage your radio stations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-700">
                        <TableHead className="text-green-300">Image</TableHead>
                        <TableHead className="text-green-300">Name</TableHead>
                        <TableHead className="text-green-300">Genre</TableHead>
                        <TableHead className="text-green-300">Status</TableHead>
                        <TableHead className="text-green-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stations.length > 0 ? (
                        stations.map((station) => (
                          <TableRow key={station.id} className="border-green-900/30">
                            <TableCell>
                              {station.image_url && (
                                <img src={station.image_url} alt={station.name} className="w-12 h-12 object-cover rounded" />
                              )}
                            </TableCell>
                            <TableCell className="text-white">{station.name}</TableCell>
                            <TableCell className="text-gray-300">{station.genre}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${station.streaming ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                {station.streaming ? 'Live' : 'Offline'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/stations`)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteStation(station.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
