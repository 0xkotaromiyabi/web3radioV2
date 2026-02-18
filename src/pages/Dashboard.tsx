
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
import { useAdminAccess, clearAdminAccessCache } from '@/hooks/useAdminAccess';

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
    clearAdminAccessCache(); // Clear session cache so verification is required again
    disconnect();
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
    <div className="fixed inset-0 bg-[#515044]/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl max-w-md w-full p-10 text-center animate-in fade-in zoom-in duration-500 border border-[#515044]/5">
        <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-[#515044]/5 flex items-center justify-center">
          <Clock className="h-10 w-10 text-[#515044]/40" />
        </div>
        <h2 className="text-2xl font-bold text-[#515044] mb-3">Akses Terbatas</h2>
        <p className="text-[#515044]/60 mb-8 font-light leading-relaxed">{adminAccess.message}</p>

        <div className="bg-[#515044]/5 rounded-[24px] p-6 mb-10 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-[#515044]/40">Slot Akses Anda:</span>
            <span className="text-[#515044]">{adminAccess.allowedSlot}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-[#515044]/40">Waktu Saat Ini:</span>
            <span className="text-[#515044]">{adminAccess.currentTimeWITA}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setShowTimeRestrictedPopup(false);
            handleLogout();
          }}
          className="w-full bg-[#515044] hover:bg-black text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-[#515044]/10 uppercase text-xs tracking-widest"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );

  // Render loading state while checking access
  if (adminAccess.isLoading) {
    return (
      <div className="min-h-screen bg-[#fef29c] font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center justify-center p-6 text-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
          body { font-family: 'Raleway', sans-serif; }
        `}</style>
        <Loader2 className="w-12 h-12 text-[#515044]/40 animate-spin mb-6" />
        <h2 className="text-2xl font-bold tracking-tight">Verifying Access...</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 mt-3">Checking your Temporal Access Pass on-chain</p>
      </div>
    );
  }

  // Login page
  if (!adminAccess.hasAccess) {
    return (
      <div className="min-h-screen bg-[#fef29c] font-['Raleway',_sans-serif] text-[#515044] flex items-center justify-center p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
          body { font-family: 'Raleway', sans-serif; }
        `}</style>
        {/* Time Restricted Popup */}
        {showTimeRestrictedPopup && <TimeRestrictedPopup />}

        <div className="bg-white/90 backdrop-blur-xl rounded-[48px] w-full max-w-md p-12 text-center shadow-2xl border border-[#515044]/5 flex flex-col items-center">
          {/* Logo */}
          <div className="w-24 h-24 mb-10 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <img
              src={logo}
              alt="Web3Radio"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-bold tracking-tight">CMS Dashboard</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30">Connect wallet to access the control panel</p>
          </div>

          {isConnected && address ? (
            <div className="space-y-6 w-full">
              {adminAccess.isAdmin && !adminAccess.hasAccess ? (
                // Admin but time-restricted
                <div className="p-6 rounded-[24px] bg-[#515044]/5 border border-[#515044]/5 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <Clock className="h-6 w-6 text-[#515044]/40" />
                  </div>
                  <div>
                    <p className="text-[#515044] font-bold text-sm">Akses Terbatas Waktu</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40 mt-1">
                      Slot: {adminAccess.allowedSlot}
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">
                      Waktu sekarang: {adminAccess.currentTimeWITA}
                    </p>
                  </div>
                </div>
              ) : (
                // Not admin at all
                <div className="p-6 rounded-[24px] bg-red-500/5 border border-red-500/10 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-500 font-bold text-sm">Access Denied</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500/40 mt-1">
                      Wallet {address.slice(0, 6)}...{address.slice(-4)} is not authorized
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full bg-[#515044]/5 hover:bg-[#515044]/10 text-[#515044] font-bold py-5 rounded-2xl transition-all uppercase text-xs tracking-widest"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-6 w-full">
              <button
                onClick={() => open()}
                className="w-full bg-[#515044] hover:bg-black text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-[#515044]/10 uppercase text-xs tracking-widest"
              >
                Connect Wallet
              </button>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-20">
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
              <h2 className="text-xl sm:text-2xl font-bold text-[#515044]">News Management</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="bg-[#515044] hover:bg-black text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#515044]/10 uppercase text-[10px] tracking-widest w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                {showEditor ? 'Hide Editor' : 'Add Article'}
              </button>
            </div>

            {showEditor && <NewsEditor onSave={handleSaveComplete} />}

            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden border border-[#515044]/5 shadow-xl">
              <div className="p-8 border-b border-[#515044]/5">
                <h3 className="font-bold text-[#515044] text-lg">Published Articles</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">Manage your news articles</p>
              </div>
              <div className="divide-y divide-[#515044]/5">
                {newsItems.length > 0 ? (
                  newsItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-6 hover:bg-[#515044]/5 transition-colors">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-2xl shadow-md" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#515044]/5 flex items-center justify-center">
                          <Edit className="h-6 w-6 text-[#515044]/20" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#515044] truncate">{item.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">{item.date}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => navigate(`/news`)} className="p-3 rounded-xl bg-white/50 hover:bg-white text-[#515044]/40 hover:text-[#515044] transition-all shadow-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteNewsItem(item.id)} className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-500/40 hover:text-white transition-all shadow-sm">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-[#515044]/30 font-bold uppercase text-[10px] tracking-[0.2em]">No news articles found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#515044]">Events Management</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="bg-[#515044] hover:bg-black text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#515044]/10 uppercase text-[10px] tracking-widest w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                {showEditor ? 'Hide Editor' : 'Add Event'}
              </button>
            </div>

            {showEditor && <EventEditor onSave={handleSaveComplete} />}

            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden border border-[#515044]/5 shadow-xl">
              <div className="p-8 border-b border-[#515044]/5">
                <h3 className="font-bold text-[#515044] text-lg">Upcoming Events</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">Manage your events</p>
              </div>
              <div className="divide-y divide-[#515044]/5">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center gap-6 p-6 hover:bg-[#515044]/5 transition-colors">
                      {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-16 h-16 object-cover rounded-2xl shadow-md" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#515044]/5 flex items-center justify-center">
                          <Edit className="h-6 w-6 text-[#515044]/20" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#515044] truncate">{event.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">{event.date} • {event.location}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => navigate(`/events`)} className="p-3 rounded-xl bg-white/50 hover:bg-white text-[#515044]/40 hover:text-[#515044] transition-all shadow-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-500/40 hover:text-white transition-all shadow-sm">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-[#515044]/30 font-bold uppercase text-[10px] tracking-[0.2em]">No events found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'stations':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#515044]">Radio Stations</h2>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="bg-[#515044] hover:bg-black text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#515044]/10 uppercase text-[10px] tracking-widest w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                {showEditor ? 'Hide Editor' : 'Add Station'}
              </button>
            </div>

            {showEditor && <StationEditor onSave={handleSaveComplete} />}

            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden border border-[#515044]/5 shadow-xl">
              <div className="p-8 border-b border-[#515044]/5">
                <h3 className="font-bold text-[#515044] text-lg">Radio Stations</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">Manage your radio stations</p>
              </div>
              <div className="divide-y divide-[#515044]/5">
                {stations.length > 0 ? (
                  stations.map((station) => (
                    <div key={station.id} className="flex items-center gap-6 p-6 hover:bg-[#515044]/5 transition-colors">
                      {station.image_url ? (
                        <img src={station.image_url} alt={station.name} className="w-16 h-16 object-cover rounded-2xl shadow-md" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#515044]/5 flex items-center justify-center">
                          <Radio className="h-6 w-6 text-[#515044]/20" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#515044] truncate">{station.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">{station.genre}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${station.streaming ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {station.streaming ? 'Live' : 'Offline'}
                      </span>
                      <div className="flex gap-3">
                        <button onClick={() => navigate(`/stations`)} className="p-3 rounded-xl bg-white/50 hover:bg-white text-[#515044]/40 hover:text-[#515044] transition-all shadow-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteStation(station.id)} className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-500/40 hover:text-white transition-all shadow-sm">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-[#515044]/30 font-bold uppercase text-[10px] tracking-[0.2em]">No radio stations found</div>
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

  // Dashboard
  return (
    <div className="min-h-screen w-full bg-[#fef29c] font-['Raleway',_sans-serif] text-[#515044] flex relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
        body { font-family: 'Raleway', sans-serif; }
      `}</style>
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
      <div className="flex-1 overflow-y-auto min-w-0 h-screen">
        {/* Top Bar */}
        <div className="bg-white/50 backdrop-blur-xl sticky top-0 z-20 border-b border-[#515044]/5 px-6 sm:px-10 py-5 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3 ml-12 lg:ml-0">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#515044]">Super Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/40 hidden sm:block">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <button
              onClick={handleLogout}
              className="bg-[#515044]/5 hover:bg-[#515044]/10 text-[#515044] text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-10 pb-20">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
