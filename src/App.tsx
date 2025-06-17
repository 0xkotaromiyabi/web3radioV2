
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { client } from "./services/w3rSmartContract";
import { W3RTokenProvider } from "./contexts/W3RTokenContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import News from "./pages/News";
import Events from "./pages/Events";
import Stations from "./pages/Stations";
import CMS from "./pages/CMS";
import Dashboard from "./pages/Dashboard";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
          <W3RTokenProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/news" element={<News />} />
                <Route path="/events" element={<Events />} />
                <Route path="/stations" element={<Stations />} />
                <Route path="/cms" element={<CMS />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </W3RTokenProvider>
        </TonConnectUIProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default App;
