
// Simplified mock wallet functionality
// This removes all Alchemy dependencies

// Function to initialize a wallet with a given mnemonic
export const initializeSmartAccount = async (mnemonic?: string) => {
  try {
    // Generate a mock address that looks like an Ethereum address
    const mockAddress = `0x${Math.random().toString(16).substring(2, 42).padEnd(40, '0')}`;
    
    return {
      address: mockAddress,
      success: true
    };
  } catch (error) {
    console.error("Error initializing account:", error);
    return {
      address: "",
      success: false,
      error
    };
  }
};

// Function to get the current wallet from storage or create a new one
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
