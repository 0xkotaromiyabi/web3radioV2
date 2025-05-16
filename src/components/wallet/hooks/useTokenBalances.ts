
import { useState } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { IDRX_TOKENS, ERC20_ABI, SOLANA_RPC } from '../constants/TokenConstants';
import { ToastAction } from '@/components/ui/toast';

export const useTokenBalances = ({
  setLoadingBalances,
  toast
}: {
  setLoadingBalances: React.Dispatch<React.SetStateAction<{ base: boolean; solana: boolean }>>;
  toast: any;
}) => {
  const fetchBaseIdrxBalance = async (address: string) => {
    try {
      setLoadingBalances(prev => ({ ...prev, base: true }));
      
      // Connect to Base network
      const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
      const tokenContract = new ethers.Contract(IDRX_TOKENS.base, ERC20_ABI, provider);
      
      // Get balance and decimals
      const balance = await tokenContract.balanceOf(address);
      const decimals = await tokenContract.decimals();
      
      // Format balance with proper decimals
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      console.log(`Base IDRX Balance: ${formattedBalance}`);
      
      setLoadingBalances(prev => ({ ...prev, base: false }));
      return formattedBalance;
    } catch (error) {
      setLoadingBalances(prev => ({ ...prev, base: false }));
      console.error("Error fetching Base IDRX balance:", error);
      toast({
        title: "Error fetching IDRX balance",
        description: "Could not retrieve your Base IDRX balance",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return "0";
    }
  };
  
  const fetchSolanaIdrxBalance = async (walletAddress: string) => {
    try {
      setLoadingBalances(prev => ({ ...prev, solana: true }));
      
      // Connect to Solana network
      const connection = new Connection(SOLANA_RPC);
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMintAddress = new PublicKey(IDRX_TOKENS.solana);
      
      // Get the associated token account
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMintAddress,
        walletPublicKey
      );
      
      try {
        // Get account info
        const tokenAccount = await getAccount(connection, associatedTokenAddress);
        const balance = Number(tokenAccount.amount) / Math.pow(10, 9); // Assuming 9 decimals for SPL tokens
        
        setLoadingBalances(prev => ({ ...prev, solana: false }));
        return balance.toString();
      } catch (e) {
        console.log("Token account not found, balance is 0");
        setLoadingBalances(prev => ({ ...prev, solana: false }));
        return "0";
      }
    } catch (error) {
      setLoadingBalances(prev => ({ ...prev, solana: false }));
      console.error("Error fetching Solana IDRX balance:", error);
      toast({
        title: "Error fetching IDRX balance",
        description: "Could not retrieve your Solana IDRX balance",
        variant: "destructive", 
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return "0";
    }
  };
  
  return {
    fetchBaseIdrxBalance,
    fetchSolanaIdrxBalance
  };
};

export default useTokenBalances;
