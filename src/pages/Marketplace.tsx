
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import NFTMarketplace from '@/components/marketplace/NFTMarketplace';

const Marketplace = () => {
  return (
    <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
        body { font-family: 'Raleway', sans-serif; }
      `}</style>
      <NavBar />
      <div className="container py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <NFTMarketplace />
      </div>
    </div>
  );
};

export default Marketplace;
