
import React from 'react';
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DonationCard from './DonationCard';

interface SupportSectionProps {
  selectedDonationNetwork: 'eth' | 'arbitrum';
  setSelectedDonationNetwork: (network: 'eth' | 'arbitrum') => void;
  donationAmount: string;
  setDonationAmount: (amount: string) => void;
  handleDonate: () => void;
}

const SupportSection: React.FC<SupportSectionProps> = ({
  selectedDonationNetwork,
  setSelectedDonationNetwork,
  donationAmount,
  setDonationAmount,
  handleDonate
}) => {
  return (
    <section className="mb-10">
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-6 border border-blue-500/20">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold flex items-center">
              <Heart className="mr-2 text-red-500" /> Support Web3 Radio DAO
            </h2>
            <p className="mt-2 text-gray-300">
              Your donation helps us maintain the platform, add new features, and support the community.
              Donations are made directly to our treasury wallet on ETH or Arbitrum.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">Community Owned</Badge>
              <Badge variant="secondary" className="bg-green-900/30 text-green-300">Non-profit</Badge>
              <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">Transparent</Badge>
            </div>
          </div>
          
          <DonationCard 
            selectedDonationNetwork={selectedDonationNetwork}
            setSelectedDonationNetwork={setSelectedDonationNetwork}
            donationAmount={donationAmount}
            setDonationAmount={setDonationAmount}
            handleDonate={handleDonate}
          />
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
