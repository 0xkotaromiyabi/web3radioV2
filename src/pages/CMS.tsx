
import React, { useState } from 'react';
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
import { Calendar, Newspaper, Radio } from "lucide-react";

const CMS = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock login functionality
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
      toast({
        title: "Login successful",
        description: "Web3radio dashboard",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  // Mock news data
  const [newsItems, setNewsItems] = useState([
    { id: 1, title: "Web3 Conference Announced", date: "2025-06-10", content: "The biggest Web3 conference of the year will be held in San Francisco." },
    { id: 2, title: "New Blockchain Partnership", date: "2025-06-05", content: "Leading blockchain companies announce strategic partnership." },
  ]);

  // Mock events data
  const [events, setEvents] = useState([
    { id: 1, title: "ETH Meetup", date: "2025-06-20", location: "New York", description: "Monthly Ethereum developer meetup" },
    { id: 2, title: "Crypto Art Exhibition", date: "2025-07-15", location: "London", description: "NFT art showcase featuring leading digital artists" },
  ]);

  // Mock radio stations data
  const [stations, setStations] = useState([
    { id: 1, name: "BlockBeats FM", genre: "Electronic", streaming: true, description: "24/7 electronic music for crypto enthusiasts" },
    { id: 2, name: "Chain Radio", genre: "Talk Show", streaming: true, description: "Latest crypto news and interviews" },
  ]);

  // Form states for adding new content
  const [newNewsItem, setNewNewsItem] = useState({ title: "", date: "", content: "" });
  const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "", description: "" });
  const [newStation, setNewStation] = useState({ name: "", genre: "", streaming: true, description: "" });

  const addNewsItem = () => {
    if (newNewsItem.title && newNewsItem.date && newNewsItem.content) {
      setNewsItems([...newsItems, { id: newsItems.length + 1, ...newNewsItem }]);
      setNewNewsItem({ title: "", date: "", content: "" });
      toast({
        title: "News item added",
        description: "The news item has been added successfully",
      });
    }
  };

  const addEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.location && newEvent.description) {
      setEvents([...events, { id: events.length + 1, ...newEvent }]);
      setNewEvent({ title: "", date: "", location: "", description: "" });
      toast({
        title: "Event added",
        description: "The event has been added successfully",
      });
    }
  };

  const addStation = () => {
    if (newStation.name && newStation.genre && newStation.description) {
      setStations([...stations, { id: stations.length + 1, ...newStation }]);
      setNewStation({ name: "", genre: "", streaming: true, description: "" });
      toast({
        title: "Radio station added",
        description: "The radio station has been added successfully",
      });
    }
  };

  // Login page
  if (!loggedIn) {
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
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="Username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
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
                <p>Contact Admin For Login</p>
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
          <Button variant="outline" onClick={() => setLoggedIn(false)} className="border-green-500 text-green-400 hover:bg-green-900 hover:text-white">Logout</Button>
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
                      <Button onClick={addNewsItem} className="bg-green-600 hover:bg-green-700 text-white">Add News Item</Button>
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
                        {newsItems.map((item) => (
                          <TableRow key={item.id} className="border-green-900/30">
                            <TableCell className="text-gray-300">{item.id}</TableCell>
                            <TableCell className="text-white">{item.title}</TableCell>
                            <TableCell className="text-gray-300">{item.date}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-900 hover:text-white" onClick={() => {
                                  toast({
                                    title: "Edit functionality",
                                    description: "Edit functionality would be implemented here",
                                  });
                                }}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                  setNewsItems(newsItems.filter(n => n.id !== item.id));
                                  toast({
                                    title: "News item deleted",
                                    description: "The news item has been deleted successfully",
                                  });
                                }}>Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
                      <Button onClick={addEvent} className="bg-green-600 hover:bg-green-700 text-white">Add Event</Button>
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
                        {events.map((event) => (
                          <TableRow key={event.id} className="border-green-900/30">
                            <TableCell className="text-gray-300">{event.id}</TableCell>
                            <TableCell className="text-white">{event.title}</TableCell>
                            <TableCell className="text-gray-300">{event.date}</TableCell>
                            <TableCell className="text-white">{event.location}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-900 hover:text-white" onClick={() => {
                                  toast({
                                    title: "Edit functionality",
                                    description: "Edit functionality would be implemented here",
                                  });
                                }}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                  setEvents(events.filter(e => e.id !== event.id));
                                  toast({
                                    title: "Event deleted",
                                    description: "The event has been deleted successfully",
                                  });
                                }}>Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
                      <Button onClick={addStation} className="bg-green-600 hover:bg-green-700 text-white">Add Radio Station</Button>
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
                        {stations.map((station) => (
                          <TableRow key={station.id} className="border-green-900/30">
                            <TableCell className="text-gray-300">{station.id}</TableCell>
                            <TableCell className="text-white">{station.name}</TableCell>
                            <TableCell className="text-gray-300">{station.genre}</TableCell>
                            <TableCell className="text-white">{station.streaming ? "Yes" : "No"}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-900 hover:text-white" onClick={() => {
                                  toast({
                                    title: "Edit functionality",
                                    description: "Edit functionality would be implemented here",
                                  });
                                }}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                  setStations(stations.filter(s => s.id !== station.id));
                                  toast({
                                    title: "Station deleted",
                                    description: "The radio station has been deleted successfully",
                                  });
                                }}>Delete</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
