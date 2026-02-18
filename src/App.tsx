
import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { AppKitProvider } from './config/appkit';
import { SolanaProvider } from "./providers/SolanaProvider";
import { W3RTokenProvider } from "./contexts/W3RTokenContext";
import { MiniKitContextProvider } from "./providers/MiniKitProvider";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import News from "./pages/News";
import Events from "./pages/Events";
import Stations from "./pages/Stations";
import Dashboard from "./pages/Dashboard";
import Web3RadioDAO from "./pages/Web3RadioDAO";
import PremiumContent from "./pages/PremiumContent";
import DynamicPage from "./pages/DynamicPage";

import NewsDetail from "./pages/NewsDetail";
import EventDetail from "./pages/EventDetail";
import StationDetail from "./pages/StationDetail";
import RentalAccess from "./pages/RentalAccess";
import PLY from "./pages/PLY";
import { AudioProvider } from "./contexts/AudioProvider";
import PersistentPlayer from "./components/radio/PersistentPlayer";
import ExtensionHome from "./pages/ExtensionHome";

import IndexV2 from "./pages/IndexV2";

import "./App.css";

function App() {
  return (
    <MiniKitContextProvider>
      <AppKitProvider>
        <SolanaProvider>
          <W3RTokenProvider>
            <AudioProvider>
              {import.meta.env.MODE === 'extension' ? (
                <HashRouter>
                  <Routes>
                    <Route path="/" element={<ExtensionHome />} />
                  </Routes>
                  <Toaster />
                </HashRouter>
              ) : (
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<IndexV2 />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:slug" element={<NewsDetail />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:slug" element={<EventDetail />} />
                    <Route path="/stations" element={<Stations />} />
                    <Route path="/stations/:slug" element={<StationDetail />} />
                    <Route path="/rental" element={<RentalAccess />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dao" element={<Web3RadioDAO />} />
                    <Route path="/ply" element={<PLY />} />
                    <Route path="/premium" element={<PremiumContent />} />
                    <Route path="/p/:slug" element={<DynamicPage />} />
                  </Routes>
                  <PersistentPlayer />
                  <Toaster />
                </BrowserRouter>
              )}
            </AudioProvider>
          </W3RTokenProvider>
        </SolanaProvider>
      </AppKitProvider>
    </MiniKitContextProvider>
  );
}

export default App;
