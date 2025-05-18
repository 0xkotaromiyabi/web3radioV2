
import { createSmartAccountClient } from "@alchemy/aa-core";
import { LocalAccountSigner } from "@alchemy/aa-core/signer";
import { polygonMumbai } from "viem/chains";

// Function to initialize a smart account with a given mnemonic
export const initializeSmartAccount = async (mnemonic?: string) => {
  try {
    // Use provided mnemonic or generate a random one
    const randomMnemonic = `test ${Math.random().toString(16).substring(2, 10)} test test test test test test test test test test junk`;
    
    // Use LocalAccountSigner which is available in @alchemy/aa-core
    const signer = mnemonic
      ? LocalAccountSigner.mnemonicToAccountSigner(mnemonic)
      : LocalAccountSigner.mnemonicToAccountSigner(randomMnemonic);

    const smartAccount = await createSmartAccountClient({
      chain: polygonMumbai,
      owner: signer,
    });

    return {
      smartAccount,
      signer,
      address: await smartAccount.getAddress(),
      success: true
    };
  } catch (error) {
    console.error("Error initializing smart account:", error);
    return {
      smartAccount: null,
      signer: null,
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
