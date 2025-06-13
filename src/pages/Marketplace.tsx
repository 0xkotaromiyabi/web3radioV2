
import React from 'react';
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import NavBar from '@/components/navigation/NavBar';
import NFTMarketplace from '@/components/marketplace/NFTMarketplace';

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const Marketplace = () => {
  return (
    <ThirdwebProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavBar />
        <div className="container py-8">
          <NFTMarketplace client={client} />
        </div>
      </div>
    </ThirdwebProvider>
  );
};

export default Marketplace;
