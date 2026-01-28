
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Trash2, Plus, Edit, Wallet, ShieldCheck, Radio, Clock, AlertTriangle } from "lucide-react";
import { fetchNews, deleteNewsItem, fetchEvents, deleteEvent, fetchStations, deleteStation, subscribeToTable } from '@/lib/supabase';
import NewsEditor from '@/components/cms/NewsEditor';
import EventEditor from '@/components/cms/EventEditor';
import StationEditor from '@/components/cms/StationEditor';
import CMSSidebar from '@/components/cms/CMSSidebar';
import MediaLibrary from '@/components/cms/MediaLibrary';
import DashboardOverview from '@/components/cms/DashboardOverview';
import RadioHub from '@/components/radio/RadioHub';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';
import logo from '@/assets/web3radio-logo.png';
import { useAdminAccess } from '@/hooks/useAdminAccess';

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
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditor, setShowEditor] = useState(false);
  const [showTimeRestrictedPopup, setShowTimeRestrictedPopup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use the new admin access hook with time-based restrictions
  const adminAccess = useAdminAccess(address);

  // Data states
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  // Check admin access on wallet connection
  useEffect(() => {
    if (isConnected && address) {
      if (adminAccess.hasAccess) {
        toast({
          title: "Admin Access Granted",
          description: adminAccess.hasTimeRestriction
            ? `Welcome! Your access is valid during ${adminAccess.allowedSlot}.`
            : "Welcome back, Super Admin!",
        });
      } else if (adminAccess.isAdmin && !adminAccess.hasAccess) {
        // Admin but outside time slot - show popup
        setShowTimeRestrictedPopup(true);
      } else {
        toast({
          title: "Access Denied",
          description: "Your wallet is not authorized to access the CMS.",
          variant: "destructive",
        });
      }
    }
  }, [isConnected, address, adminAccess.hasAccess, adminAccess.isAdmin, toast]);

  // Load data when admin is authenticated
  useEffect(() => {
    if (adminAccess.hasAccess) {
      loadAllData();
      setupRealtimeSubscriptions();
    }
  }, [adminAccess.hasAccess]);

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
    disconnect();
    setIsAdmin(false);
    toast({ title: "Disconnected", description: "Wallet disconnected successfully" });
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

  // Time-Restricted Access Popup
  const TimeRestrictedPopup = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Akses Terbatas</h2>
        <p className="text-gray-600 mb-4">{adminAccess.message}</p>

        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Slot Akses Anda:</span>
            <span className="font-medium text-gray-900">{adminAccess.allowedSlot}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Waktu Saat Ini:</span>
            <span className="font-medium text-gray-900">{adminAccess.currentTimeWITA}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setShowTimeRestrictedPopup(false);
            handleLogout();
          }}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-all"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );

  // Login page - Apple style wallet connect
  if (!adminAccess.hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        {/* Time Restricted Popup */}
        {showTimeRestrictedPopup && <TimeRestrictedPopup />}

        <div className="panel-float w-full max-w-md p-8 text-center">
          {/* Logo */}
          <img
            src={logo}
            alt="Web3Radio"
            className="w-20 h-20 mx-auto mb-6 rounded-2xl shadow-apple-md"
          />

          <h1 className="text-2xl font-semibold text-foreground mb-2">CMS Dashboard</h1>
          <p className="text-muted-foreground mb-8">Connect your wallet to access the dashboard</p>

          {isConnected && address ? (
            <div className="space-y-4">
              {adminAccess.isAdmin && !adminAccess.hasAccess ? (
                // Admin but time-restricted
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-amber-600 font-medium">Akses Terbatas Waktu</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Slot Anda: {adminAccess.allowedSlot}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Waktu sekarang: {adminAccess.currentTimeWITA}
                  </p>
                </div>
              ) : (
                // Not admin at all
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <ShieldCheck className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-500 font-medium">Access Denied</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Wallet {address.slice(0, 6)}...{address.slice(-4)} is not authorized.
                  </p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full btn-apple-secondary text-red-500 py-3 rounded-xl transition-all"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => open()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-8 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              >
                Connect Wallet
              </button>
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">News Management</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn-apple-primary flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Events Management</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn-apple-primary flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Radio Stations</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn-apple-primary flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
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
      <div className="flex-1 overflow-auto min-w-0">
        {/* Top Bar */}
        <div className="glass-subtle sticky top-0 z-10 border-b border-border/30 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 ml-12 lg:ml-0">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Super Admin</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <button
              onClick={handleLogout}
              className="btn-apple-secondary text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
