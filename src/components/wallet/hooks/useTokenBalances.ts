
import { useState } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { IDRX_TOKENS, SOLANA_RPC, ERC20_ABI } from '../constants/TokenConstants';

interface UseTokenBalancesProps {
  setLoadingBalances: React.Dispatch<React.SetStateAction<{
    base: boolean;
    solana: boolean;
  }>>;
  toast: any;
}

// Hook for handling token balance fetching
export const useTokenBalances = ({ setLoadingBalances, toast }: UseTokenBalancesProps) => {
  
  // Function to fetch IDRX balance on Base network using ethers.js
  const fetchBaseIdrxBalance = async (ethAddress: string) => {
    try {
      setLoadingBalances(prev => ({ ...prev, base: true }));

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(IDRX_TOKENS.base, ERC20_ABI, provider);
      
      const [rawBalance, decimals] = await Promise.all([
        contract.balanceOf(ethAddress),
        contract.decimals()
      ]);
      
      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      
      setLoadingBalances(prev => ({ ...prev, base: false }));
      return parseFloat(formattedBalance).toFixed(2);
    } catch (error) {
      console.error('Error fetching Base IDRX balance:', error);
      setLoadingBalances(prev => ({ ...prev, base: false }));
      toast({
        title: "Error fetching Base IDRX balance",
        description: "Could not retrieve your IDRX balance from Base network",
        variant: "destructive",
      });
      return "0";
    }
  };

  // Function to fetch IDRX balance on Solana
  const fetchSolanaIdrxBalance = async (solAddress: string) => {
    try {
      setLoadingBalances(prev => ({ ...prev, solana: true }));

      const connection = new Connection(SOLANA_RPC, 'confirmed');
      const owner = new PublicKey(solAddress);
      const mint = new PublicKey(IDRX_TOKENS.solana);

      const ata = await getAssociatedTokenAddress(mint, owner);
      const accountInfo = await getAccount(connection, ata);
      
      const rawBalance = Number(accountInfo.amount);
      const decimals = 6; // Ganti sesuai desimal token IDRX di Solana

      const formattedBalance = (rawBalance / Math.pow(10, decimals)).toFixed(2);
      setLoadingBalances(prev => ({ ...prev, solana: false }));
      return formattedBalance;
    } catch (error) {
      console.error('Error fetching Solana IDRX balance:', error);
      setLoadingBalances(prev => ({ ...prev, solana: false }));
      toast({
        title: "Error fetching Solana IDRX balance",
        description: "Could not retrieve your IDRX balance from Solana network",
        variant: "destructive",
      });
      return "0";
    }
  };
  
  return { fetchBaseIdrxBalance, fetchSolanaIdrxBalance };
};

export default useTokenBalances;
