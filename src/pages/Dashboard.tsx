import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Trash2, Plus, Edit, Wallet, Radio, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { fetchEvents, deleteEvent, fetchStations, deleteStation, subscribeToTable } from '@/lib/supabase';
import EventEditor from '@/components/cms/EventEditor';
import StationEditor from '@/components/cms/StationEditor';
import CMSSidebar from '@/components/cms/CMSSidebar';
import MediaLibrary from '@/components/cms/MediaLibrary';
import DashboardOverview from '@/components/cms/DashboardOverview';
import RadioHub from '@/components/radio/RadioHub';
import logo from '@/assets/web3radio-logo.png';

// Type definitions
type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url?: string;
  category?: 'news' | 'job' | 'event';
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
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditor, setShowEditor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem('cms_auth');
    if (auth !== 'true') {
      navigate('/pintu_masuk');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Load data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [eventsRes, stationsRes] = await Promise.all([
          fetchEvents(),
          fetchStations()
        ]);
        setEvents(eventsRes.data || []);
        setStations(stationsRes.data || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data dari database.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Setup subscriptions
    const eventsSub = subscribeToTable('events', loadData);
    const stationsSub = subscribeToTable('stations', loadData);

    return () => {
      eventsSub.unsubscribe();
      stationsSub.unsubscribe();
    };
  }, [isAuthenticated, toast]);

  const handleLogout = () => {
    localStorage.removeItem('cms_auth');
    navigate('/pintu_masuk');
    toast({
      title: "Logged Out",
      description: "Anda telah keluar dari Control Panel.",
    });
  };

  const handleSaveComplete = () => {
    setShowEditor(false);
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Hapus event ini?')) {
      const { error } = await deleteEvent(id);
      if (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus event",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Event berhasil dihapus",
        });
      }
    }
  };

  const handleDeleteStation = async (id: number) => {
    if (window.confirm('Hapus station ini?')) {
      const { error } = await deleteStation(id);
      if (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus station",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Station berhasil dihapus",
        });
      }
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen w-full bg-transparent flex justify-center items-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin opacity-20" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30">Loading Dashboard</p>
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
            eventsCount={events.length}
            stationsCount={stations.length}
          />
        );

      case 'events':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Events Management</h2>
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
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mt-1">
                          {event.date} • {event.location} • <span className="text-[#515044]/60">{event.category || 'event'}</span>
                        </p>
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
              <h2 className="text-xl sm:text-2xl font-bold text-white">Radio Stations</h2>
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
    <div className="min-h-screen w-full bg-transparent text-white flex relative overflow-hidden">
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
            <button
              onClick={handleLogout}
              className="bg-[#515044] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#515044]/10"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-10 pb-32">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
