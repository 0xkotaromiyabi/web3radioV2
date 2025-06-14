
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { balanceOf } from "thirdweb/extensions/erc20";
import { useReadContract } from "thirdweb/react";

interface W3RTokenContextType {
  balance: string;
  isLoading: boolean;
  listeningTime: number;
  pendingRewards: number;
  claimEligible: boolean;
  refreshBalance: () => void;
  updateListeningTime: (seconds: number) => void;
  getPendingRewards: () => number;
}

const W3RTokenContext = createContext<W3RTokenContextType | undefined>(undefined);

// Base Mainnet configuration
const base = defineChain({
  id: 8453,
  name: "Base",
  rpc: "https://mainnet.base.org",
});

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

// W3R Token contract on Base
const W3R_CONTRACT_ADDRESS = "0xC03a26EeaDb87410a26FdFD1755B052F1Fc7F06B";

const contract = getContract({
  client,
  chain: base,
  address: W3R_CONTRACT_ADDRESS,
});

export const W3RTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const account = useActiveAccount();
  const [listeningTime, setListeningTime] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Constants
  const CLAIM_THRESHOLD = 50000; // 50,000 W3R minimum to claim
  const REWARD_RATE = 100; // 100 W3R per hour

  // Get W3R token balance
  const { data: balance, isLoading } = useReadContract(balanceOf, {
    contract,
    address: account?.address || "",
    queryOptions: {
      enabled: !!account?.address,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  });

  // Load listening time and pending rewards from localStorage
  useEffect(() => {
    if (account?.address) {
      const savedTime = localStorage.getItem(`w3r-listening-time-${account.address}`);
      const savedPending = localStorage.getItem(`w3r-pending-rewards-${account.address}`);
      
      if (savedTime) {
        setListeningTime(parseInt(savedTime, 10));
      }
      if (savedPending) {
        setPendingRewards(parseInt(savedPending, 10));
      }
    }
  }, [account?.address]);

  const updateListeningTime = (seconds: number) => {
    setListeningTime(seconds);
    
    // Calculate pending rewards based on listening time
    const hoursListened = Math.floor(seconds / 3600);
    const newPendingRewards = hoursListened * REWARD_RATE;
    setPendingRewards(newPendingRewards);
    
    if (account?.address) {
      localStorage.setItem(`w3r-listening-time-${account.address}`, seconds.toString());
      localStorage.setItem(`w3r-pending-rewards-${account.address}`, newPendingRewards.toString());
    }
  };

  const getPendingRewards = () => {
    return pendingRewards;
  };

  const refreshBalance = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Check if user is eligible to claim (has >= 50,000 W3R pending)
  const claimEligible = pendingRewards >= CLAIM_THRESHOLD;

  const value: W3RTokenContextType = {
    balance: balance ? (Number(balance) / 10**18).toFixed(2) : "0.00",
    isLoading,
    listeningTime,
    pendingRewards,
    claimEligible,
    refreshBalance,
    updateListeningTime,
    getPendingRewards,
  };

  return (
    <W3RTokenContext.Provider value={value}>
      {children}
    </W3RTokenContext.Provider>
  );
};

export const useW3RToken = () => {
  const context = useContext(W3RTokenContext);
  if (context === undefined) {
    throw new Error('useW3RToken must be used within a W3RTokenProvider');
  }
  return context;
};

export { contract, client, base };
