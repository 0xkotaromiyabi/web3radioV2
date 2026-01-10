
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Trash2, Plus, Edit, Wallet, ShieldCheck, Radio } from "lucide-react";
import { fetchNews, deleteNewsItem, fetchEvents, deleteEvent, fetchStations, deleteStation, subscribeToTable } from '@/lib/supabase';
import NewsEditor from '@/components/cms/NewsEditor';
import EventEditor from '@/components/cms/EventEditor';
import StationEditor from '@/components/cms/StationEditor';
import CMSSidebar from '@/components/cms/CMSSidebar';
import MediaLibrary from '@/components/cms/MediaLibrary';
import DashboardOverview from '@/components/cms/DashboardOverview';
import RadioHub from '@/components/radio/RadioHub';
import { ConnectButton, useActiveAccount, useDisconnect } from "thirdweb/react";
import { client } from "@/services/w3rSmartContract";

// Super Admin Wallet Addresses (lowercase for comparison)
const SUPER_ADMINS = [
  "0x242dfb7849544ee242b2265ca7e585bdec60456b",
  "0xdbca8ab9eb325a8f550ffc6e45277081a6c7d681",
  "0x13dd8b8f54c3b54860f8d41a6fbff7ffc6bf01ef"
];

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
  const activeAccount = useActiveAccount();
  const { disconnect } = useDisconnect();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data states
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  // Check if connected wallet is admin
  useEffect(() => {
    if (activeAccount) {
      const address = activeAccount.address.toLowerCase();
      const isSuperAdmin = SUPER_ADMINS.some(admin => admin.toLowerCase() === address);
      setIsAdmin(isSuperAdmin);

      if (isSuperAdmin) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome back, Super Admin!",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Your wallet is not authorized to access the CMS.",
          variant: "destructive",
        });
      }
    } else {
      setIsAdmin(false);
    }
  }, [activeAccount, toast]);

  // Load data when admin is authenticated
  useEffect(() => {
    if (isAdmin) {
      loadAllData();
      setupRealtimeSubscriptions();
    }
  }, [isAdmin]);

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
      toast({ title: "Error loading news", description: error.message, variant: "destructive" });
    } else {
      setNewsItems(data || []);
    }
  };

  const loadEvents = async () => {
    const { data, error } = await fetchEvents();
    if (error) {
      toast({ title: "Error loading events", description: error.message, variant: "destructive" });
    } else {
      setEvents(data || []);
    }
  };

  const loadStations = async () => {
    const { data, error } = await fetchStations();
    if (error) {
      toast({ title: "Error loading stations", description: error.message, variant: "destructive" });
    } else {
      setStations(data || []);
    }
  };

  const handleLogout = () => {
    if (activeAccount) {
      disconnect(activeAccount);
      setIsAdmin(false);
      toast({ title: "Disconnected", description: "Wallet disconnected successfully" });
    }
  };

  const handleSaveComplete = () => {
    setShowEditor(false);
    loadAllData();
  };

  const handleDeleteNewsItem = async (id: number) => {
    const { error } = await deleteNewsItem(id);
    if (error) {
      toast({ title: "Error deleting news item", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "News item deleted", description: "The news item has been deleted successfully" });
      loadNews();
    }
  };

  const handleDeleteEvent = async (id: number) => {
    const { error } = await deleteEvent(id);
    if (error) {
      toast({ title: "Error deleting event", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event deleted", description: "The event has been deleted successfully" });
      loadEvents();
    }
  };

  const handleDeleteStation = async (id: number) => {
    const { error } = await deleteStation(id);
    if (error) {
      toast({ title: "Error deleting station", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Station deleted", description: "The radio station has been deleted successfully" });
      loadStations();
    }
  };

  // Login page - Apple style wallet connect
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="panel-float w-full max-w-md p-8 text-center">
          {/* Logo */}
          <img
            src="/web3radio-logo.png"
            alt="Web3Radio"
            className="w-20 h-20 mx-auto mb-6 rounded-2xl shadow-apple-md"
          />

          <h1 className="text-2xl font-semibold text-foreground mb-2">CMS Dashboard</h1>
          <p className="text-muted-foreground mb-8">Connect your wallet to access the dashboard</p>

          {activeAccount ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <ShieldCheck className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-500 font-medium">Access Denied</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Wallet {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)} is not authorized.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full btn-apple-secondary text-red-500"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <ConnectButton
                client={client}
                theme="light"
                connectButton={{
                  label: "Connect Wallet",
                  style: {
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "14px 32px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: "500",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Only authorized wallets can access the CMS
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            newsCount={newsItems.length}
            eventsCount={events.length}
            stationsCount={stations.length}
          />
        );

      case 'news':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">News Management</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn-apple-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {showEditor ? 'Hide Editor' : 'Add Article'}
              </button>
            </div>

            {showEditor && <NewsEditor onSave={handleSaveComplete} />}

            <div className="card-apple">
              <div className="p-6 border-b border-border/30">
                <h3 className="font-medium text-foreground">Published Articles</h3>
                <p className="text-sm text-muted-foreground">Manage your news articles</p>
              </div>
              <div className="divide-y divide-border/30">
                {newsItems.length > 0 ? (
                  newsItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/news`)} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteNewsItem(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No news articles found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Events Management</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn-apple-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {showEditor ? 'Hide Editor' : 'Add Event'}
              </button>
            </div>

            {showEditor && <EventEditor onSave={handleSaveComplete} />}

            <div className="card-apple">
              <div className="p-6 border-b border-border/30">
                <h3 className="font-medium text-foreground">Upcoming Events</h3>
                <p className="text-sm text-muted-foreground">Manage your events</p>
              </div>
              <div className="divide-y divide-border/30">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/events`)} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No events found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'stations':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Radio Stations Management</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn-apple-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {showEditor ? 'Hide Editor' : 'Add Station'}
              </button>
            </div>

            {showEditor && <StationEditor onSave={handleSaveComplete} />}

            <div className="card-apple">
              <div className="p-6 border-b border-border/30">
                <h3 className="font-medium text-foreground">Radio Stations</h3>
                <p className="text-sm text-muted-foreground">Manage your radio stations</p>
              </div>
              <div className="divide-y divide-border/30">
                {stations.length > 0 ? (
                  stations.map((station) => (
                    <div key={station.id} className="flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      {station.image_url ? (
                        <img src={station.image_url} alt={station.name} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Radio className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{station.name}</p>
                        <p className="text-sm text-muted-foreground">{station.genre}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${station.streaming ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {station.streaming ? 'Live' : 'Offline'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/stations`)} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteStation(station.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No radio stations found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'media':
        return <MediaLibrary />;

      case 'radio-hub':
        return <RadioHub />;

      default:
        return null;
    }
  };

  // Dashboard with Apple-style sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <CMSSidebar
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setShowEditor(false);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="glass-subtle sticky top-0 z-10 border-b border-border/30 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-foreground">Super Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {activeAccount?.address.slice(0, 6)}...{activeAccount?.address.slice(-4)}
            </span>
            <button
              onClick={handleLogout}
              className="btn-apple-secondary text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
