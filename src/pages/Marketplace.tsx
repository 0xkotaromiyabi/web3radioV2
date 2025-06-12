
import NFTMarketplace from '@/components/marketplace/NFTMarketplace';
import NavBar from '@/components/navigation/NavBar';
import { ThirdwebProvider } from "thirdweb/react";

const Marketplace = () => {
  return (
    <ThirdwebProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavBar />
        <div className="container py-8">
          <NFTMarketplace />
        </div>
      </div>
    </ThirdwebProvider>
  );
};

export default Marketplace;
