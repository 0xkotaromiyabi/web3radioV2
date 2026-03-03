
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import NFTMarketplace from '@/components/marketplace/NFTMarketplace';

const Marketplace = () => {
  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-y-auto text-white flex flex-col items-center">
      <NavBar />
      <div className="container py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <NFTMarketplace />
      </div>
    </div>
  );
};

export default Marketplace;
