import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import CryptoPanicNews from '@/components/news/CryptoPanicNews';

const News = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container py-12">
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-green-400 tracking-tight">Market Intelligence</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Real-time insights, sentiment analysis, and breaking news from the crypto world.
          </p>
        </div>

        <CryptoPanicNews />

        <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-800 pt-8">
          <p>Data provided by <a href="https://cryptopanic.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 underline">CryptoPanic API</a></p>
          <p className="mt-1">News is delayed by up to 24 hours on the standard plan.</p>
        </div>
      </div>
    </div>
  );
};

export default News;
