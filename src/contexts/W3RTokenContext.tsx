
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { W3RBackendApi } from "@/services/w3rBackendApi";
import { W3RSmartContract } from "@/services/w3rSmartContract";

interface W3RTokenContextType {
  balance: string;
  isLoading: boolean;
  listeningTime: number;
  rewardEligible: boolean;
  nextRewardIn: number;
  refreshBalance: () => void;
  updateListeningTime: (seconds: number) => void;
  claimReward: () => Promise<boolean>;
  submitListeningSession: (duration: number) => Promise<void>;
}

const W3RTokenContext = createContext<W3RTokenContextType | undefined>(undefined);

export const W3RTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const account = useActiveAccount();
  const [balance, setBalance] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [listeningTime, setListeningTime] = useState(0);
  const [rewardEligible, setRewardEligible] = useState(false);
  const [nextRewardIn, setNextRewardIn] = useState(0);

  const backendApi = W3RBackendApi.getInstance();
  const smartContract = new W3RSmartContract();

  // Load user data when account changes
  useEffect(() => {
    if (account?.address) {
      loadUserData();
    } else {
      resetUserData();
    }
  }, [account?.address]);

  const loadUserData = async () => {
    if (!account?.address) return;

    setIsLoading(true);
    try {
      console.log('Loading user data for:', account.address);
      
      // Load balance from smart contract
      try {
        const tokenBalance = await smartContract.getTokenBalance(account.address);
        setBalance(tokenBalance);
      } catch (error) {
        console.error('Error loading token balance:', error);
        setBalance("0.00");
      }

      // Load verified listening time from backend
      try {
        const verifiedTime = await backendApi.getVerifiedListeningTime(account.address);
        setListeningTime(verifiedTime);
      } catch (error) {
        console.error('Error loading verified listening time:', error);
      }

      // Check reward eligibility
      try {
        const eligibility = await backendApi.checkRewardEligibility(account.address);
        setRewardEligible(eligibility.eligible);
        setNextRewardIn(eligibility.nextRewardIn);
      } catch (error) {
        console.error('Error checking reward eligibility:', error);
      }

      // Also load from localStorage as backup
      const savedTime = localStorage.getItem(`w3r-listening-time-${account.address}`);
      if (savedTime && listeningTime === 0) {
        const localTime = parseInt(savedTime, 10);
        setListeningTime(localTime);
        console.log('Loaded listening time from localStorage:', localTime);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserData = () => {
    setBalance("0.00");
    setListeningTime(0);
    setRewardEligible(false);
    setNextRewardIn(0);
  };

  const updateListeningTime = (seconds: number) => {
    setListeningTime(seconds);
    if (account?.address) {
      localStorage.setItem(`w3r-listening-time-${account.address}`, seconds.toString());
    }
  };

  const submitListeningSession = async (duration: number) => {
    if (!account?.address || duration < 30) return; // Minimum 30 seconds

    try {
      console.log('Submitting listening session:', { duration, userAddress: account.address });
      
      const session = {
        userAddress: account.address,
        startTime: new Date(Date.now() - (duration * 1000)).toISOString(),
        endTime: new Date().toISOString(),
        duration,
      };

      const result = await backendApi.submitListeningSession(session);
      if (result.success) {
        console.log('Listening session verified:', result.verifiedTime);
        // Refresh user data after successful submission
        await loadUserData();
      } else {
        console.warn('Session submission failed');
      }
    } catch (error) {
      console.error('Error submitting listening session:', error);
    }
  };

  const claimReward = async (): Promise<boolean> => {
    if (!account?.address || !rewardEligible) return false;

    try {
      setIsLoading(true);
      console.log('Claiming reward for:', account.address);
      
      // Request signature from backend
      const rewardClaim = await backendApi.requestRewardSignature(account.address);
      if (!rewardClaim) {
        throw new Error('Failed to get reward signature');
      }

      console.log('Received reward claim signature:', rewardClaim);

      // Execute claim on smart contract
      const success = await smartContract.claimReward(account);
      if (success) {
        console.log('Reward claimed successfully on blockchain');
        // Refresh user data after successful claim
        await loadUserData();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = () => {
    loadUserData();
  };

  // Calculate reward eligibility locally (every 3600 seconds = 1 hour)
  const REWARD_INTERVAL = 3600;
  const calculatedRewardEligible = listeningTime >= REWARD_INTERVAL && listeningTime % REWARD_INTERVAL < 60;
  const calculatedNextRewardIn = REWARD_INTERVAL - (listeningTime % REWARD_INTERVAL);

  const value: W3RTokenContextType = {
    balance,
    isLoading,
    listeningTime,
    rewardEligible: rewardEligible || calculatedRewardEligible,
    nextRewardIn: nextRewardIn || calculatedNextRewardIn,
    refreshBalance,
    updateListeningTime,
    claimReward,
    submitListeningSession,
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
