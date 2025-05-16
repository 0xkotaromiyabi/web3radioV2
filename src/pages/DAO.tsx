
import React, { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { toast } from "sonner";
import SupportSection from '@/components/dao/SupportSection';
import GovernanceSection from '@/components/dao/GovernanceSection';

const DAO = () => {
  const [selectedDonationNetwork, setSelectedDonationNetwork] = useState<'eth' | 'arbitrum'>('eth');
  const [donationAmount, setDonationAmount] = useState('0.1');
  
  // Mock proposals data
  const proposals = [
    {
      id: 1,
      title: "Sponsor a web3 development bootcamp",
      description: "Fund a 10-week bootcamp to teach web3 development to underprivileged students.",
      votesFor: 1254,
      votesAgainst: 340,
      status: "active",
      endDate: "2025-06-01",
      creator: "0x9B65...F832",
      creatorAvatar: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Add new radio station: Crypto Trading News",
      description: "Launch a new station focused on trading strategies and market analysis.",
      votesFor: 987,
      votesAgainst: 654,
      status: "active",
      endDate: "2025-05-25",
      creator: "0x7C43...A291",
      creatorAvatar: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Integrate with Lens Protocol for social features",
      description: "Add social features powered by Lens Protocol to increase user engagement.",
      votesFor: 1823,
      votesAgainst: 219,
      status: "passed",
      endDate: "2025-05-10",
      creator: "0x3F12...B456",
      creatorAvatar: "/placeholder.svg"
    }
  ];

  // Calculate vote percentages
  const getVotePercentage = (votesFor: number, votesAgainst: number) => {
    const total = votesFor + votesAgainst;
    return total > 0 ? Math.round((votesFor / total) * 100) : 0;
  };

  const handleDonate = () => {
    const network = selectedDonationNetwork === 'eth' ? 'Ethereum' : 'Arbitrum';
    const address = '0x53dfe235484465b723D81E56988263b50BafEA33';
    
    toast.success(`Thank you for your donation of ${donationAmount} ${selectedDonationNetwork.toUpperCase()} to ${address.slice(0, 6)}...${address.slice(-4)}`, {
      description: "Your support helps us build a better platform!",
      duration: 5000,
    });
  };

  const handleVote = (proposalId: number, vote: 'for' | 'against') => {
    toast.success(`Vote submitted: ${vote === 'for' ? 'Supporting' : 'Against'} proposal #${proposalId}`, {
      description: "Your vote has been recorded on-chain",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <SupportSection 
          selectedDonationNetwork={selectedDonationNetwork}
          setSelectedDonationNetwork={setSelectedDonationNetwork}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount}
          handleDonate={handleDonate}
        />
        
        <GovernanceSection 
          proposals={proposals}
          getVotePercentage={getVotePercentage}
          handleVote={handleVote}
        />
      </main>
    </div>
  );
};

export default DAO;
