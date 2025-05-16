
import { createSmartAccountClient } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { mnemonicToAccount } from "viem/accounts";

// Function to initialize a smart account with a given mnemonic
export const initializeSmartAccount = async (mnemonic?: string) => {
  try {
    // Use provided mnemonic or generate a random one
    const randomMnemonic = `test ${Math.random().toString(16).substring(2, 10)} test test test test test test test test test test junk`;
    const account = mnemonic 
      ? mnemonicToAccount(mnemonic)
      : mnemonicToAccount(randomMnemonic); // Random mnemonic for demo purposes

    // Create provider first
    const provider = new AlchemyProvider({
      apiKey: "demo", // This is a placeholder - in production use a real API key
      chain: sepolia,
    });

    // Then create the smart account client
    const smartAccount = createSmartAccountClient({
      provider,
      account,
    });

    return {
      smartAccount,
      account,
      address: await smartAccount.getAddress(),
      success: true
    };
  } catch (error) {
    console.error("Error initializing smart account:", error);
    return {
      smartAccount: null,
      account: null,
      address: "",
      success: false,
      error
    };
  }
};

// Function to get the current smart account from storage or create a new one
export const getOrCreateSmartAccount = async () => {
  // Check if we have a stored mnemonic in local storage
  const storedMnemonic = localStorage.getItem('walletMnemonic');
  
  return await initializeSmartAccount(storedMnemonic || undefined);
};

// Function to store the mnemonic securely
export const storeWalletMnemonic = (mnemonic: string) => {
  localStorage.setItem('walletMnemonic', mnemonic);
};

// Function to check if a wallet is already setup
export const hasStoredWallet = () => {
  return !!localStorage.getItem('walletMnemonic');
};
