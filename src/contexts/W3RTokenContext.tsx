
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
  rewardEligible: boolean;
  nextRewardIn: number;
  refreshBalance: () => void;
  updateListeningTime: (seconds: number) => void;
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get W3R token balance
  const { data: balance, isLoading } = useReadContract(balanceOf, {
    contract,
    address: account?.address || "",
    queryOptions: {
      enabled: !!account?.address,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  });

  // Load listening time from localStorage
  useEffect(() => {
    if (account?.address) {
      const savedTime = localStorage.getItem(`w3r-listening-time-${account.address}`);
      if (savedTime) {
        setListeningTime(parseInt(savedTime, 10));
      }
    }
  }, [account?.address]);

  const updateListeningTime = (seconds: number) => {
    setListeningTime(seconds);
    if (account?.address) {
      localStorage.setItem(`w3r-listening-time-${account.address}`, seconds.toString());
    }
  };

  const refreshBalance = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Calculate reward eligibility (every 3600 seconds = 1 hour)
  const REWARD_INTERVAL = 3600; // 1 hour in seconds
  const rewardEligible = listeningTime >= REWARD_INTERVAL && listeningTime % REWARD_INTERVAL < 60;
  const nextRewardIn = REWARD_INTERVAL - (listeningTime % REWARD_INTERVAL);

  const value: W3RTokenContextType = {
    balance: balance ? (Number(balance) / 10**18).toFixed(2) : "0.00",
    isLoading,
    listeningTime,
    rewardEligible,
    nextRewardIn,
    refreshBalance,
    updateListeningTime,
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
