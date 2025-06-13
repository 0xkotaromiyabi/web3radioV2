
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import NFTMarketplace from '@/components/marketplace/NFTMarketplace';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container py-8">
        <NFTMarketplace />
      </div>
    </div>
  );
};

export default Marketplace;
