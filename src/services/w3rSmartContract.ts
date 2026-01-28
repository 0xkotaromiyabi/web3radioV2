
import { createPublicClient, http, getContract, parseAbi, PublicClient, WalletClient, custom } from 'viem';
import { base } from 'viem/chains';

// Contract addresses (update these after deployment)
const W3R_TOKEN_ADDRESS = "0xC03a26EeaDb87410a26FdFD1755B052F1Fc7F06B";
const W3R_REWARDS_ADDRESS = "0xC03a26EeaDb87410a26FdFD1755B052F1Fc7F06B"; // Using token address as placeholder

// Basic ABIs
const TOKEN_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
]);

const REWARDS_ABI = parseAbi([
  'function getUserData(address) view returns (uint256, uint256, uint256, bool)',
  'function isRewardEligible(address) view returns (bool)',
  'function claimReward()',
  'function updateListeningTime(address user, uint256 time)',
  'function getNextRewardTime(address) view returns (uint256)'
]);

// Validate contract address
const isValidAddress = (address: string): boolean => {
  return address && address !== "0x" && address.length === 42 && address.startsWith("0x");
};

export class W3RSmartContract {
  private publicClient: PublicClient;
  private isInitialized: boolean = false;

  constructor() {
    try {
      this.publicClient = createPublicClient({
        chain: base,
        transport: http("https://mainnet.base.org") // Or use Alchemy/Infura if available
      });
      this.isInitialized = true;
      console.log('W3RSmartContract initialized successfully with Viem');
    } catch (error) {
      console.error('Error initializing W3RSmartContract:', error);
      this.isInitialized = false;
      // Initialize with default/empty to satisfy TS if strict, but here we just flag it
      this.publicClient = createPublicClient({ chain: base, transport: http() });
    }
  }

  // Get user's W3R token balance
  async getTokenBalance(userAddress: string): Promise<string> {
    if (!this.isInitialized) {
      console.warn('Viem client not initialized');
      return "0.00";
    }

    try {
      const balance = await this.publicClient.readContract({
        address: W3R_TOKEN_ADDRESS as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`]
      });

      return (Number(balance) / 10 ** 18).toFixed(2);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return "0.00";
    }
  }

  // Get user's listening time from contract
  async getUserListeningTime(userAddress: string): Promise<number> {
    if (!this.isInitialized) return 0;

    try {
      const userData = await this.publicClient.readContract({
        address: W3R_REWARDS_ADDRESS as `0x${string}`,
        abi: REWARDS_ABI,
        functionName: 'getUserData',
        args: [userAddress as `0x${string}`]
      });

      return Number(userData[0]); // totalListeningTime
    } catch (error) {
      console.error('Error getting user listening time:', error);
      return 0;
    }
  }

  // Check if user is eligible for reward
  async isRewardEligible(userAddress: string): Promise<boolean> {
    if (!this.isInitialized) return false;

    try {
      const eligible = await this.publicClient.readContract({
        address: W3R_REWARDS_ADDRESS as `0x${string}`,
        abi: REWARDS_ABI,
        functionName: 'isRewardEligible',
        args: [userAddress as `0x${string}`]
      });

      return Boolean(eligible);
    } catch (error) {
      console.error('Error checking reward eligibility:', error);
      return false;
    }
  }

  // Claim reward tokens - Requires Wallet Client (Signer)
  // account arg should be a WalletClient or similar capable of write
  // Updated signature to accept what Wagmi provides or manage it externally
  async claimReward(walletInterface: { address?: string }): Promise<boolean> {
    // This is a view-only service by default. Writing requires a signer.
    // In Wagmi v2, we usually use useWriteContract hook in the component.
    // migrating logic to use useWriteContract in React components is preferred.
    // Keeping this method as a stub or "simulation" if real contract calls are needed via a passed signer.

    console.warn("claimReward called in W3RSmartContract. Please use useWriteContract hook in React components.");
    return false; // Placeholder
  }

  // Update listening time (only for authorized updaters)
  async updateListeningTime(userAddress: string, timeToAdd: number, signer?: any): Promise<boolean> {
    console.warn("updateListeningTime called. Use useWriteContract hook.");
    return false;
  }

  // Get next reward time
  async getNextRewardTime(userAddress: string): Promise<number> {
    if (!this.isInitialized) return 0;

    try {
      const nextRewardTime = await this.publicClient.readContract({
        address: W3R_REWARDS_ADDRESS as `0x${string}`,
        abi: REWARDS_ABI,
        functionName: 'getNextRewardTime',
        args: [userAddress as `0x${string}`]
      });

      return Number(nextRewardTime);
    } catch (error) {
      console.error('Error getting next reward time:', error);
      return 0;
    }
  }

  // Check if contracts are properly initialized
  isContractsInitialized(): boolean {
    return this.isInitialized;
  }
}
