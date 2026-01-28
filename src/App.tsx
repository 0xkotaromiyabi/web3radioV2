
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppKitProvider } from './config/appkit';
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

import "./App.css";

function App() {
  return (
    <MiniKitContextProvider>
      <AppKitProvider>
        <W3RTokenProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/news" element={<News />} />
              <Route path="/events" element={<Events />} />
              <Route path="/stations" element={<Stations />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dao" element={<Web3RadioDAO />} />
              <Route path="/premium" element={<PremiumContent />} />
              <Route path="/p/:slug" element={<DynamicPage />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </W3RTokenProvider>
      </AppKitProvider>
    </MiniKitContextProvider>
  );
}

export default App;
