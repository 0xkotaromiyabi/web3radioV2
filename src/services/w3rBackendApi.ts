
// Backend API service for W3R rewards
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ListeningSession {
  userAddress: string;
  startTime: number;
  endTime: number;
  duration: number;
  stationId?: string;
  signature?: string;
}

export interface RewardClaim {
  userAddress: string;
  listeningTime: number;
  rewardAmount: string;
  signature: string;
  nonce: number;
}

export class W3RBackendApi {
  private static instance: W3RBackendApi;

  public static getInstance(): W3RBackendApi {
    if (!W3RBackendApi.instance) {
      W3RBackendApi.instance = new W3RBackendApi();
    }
    return W3RBackendApi.instance;
  }

  // Submit listening session for verification
  async submitListeningSession(session: ListeningSession): Promise<{ success: boolean; verifiedTime: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/listening/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting listening session:', error);
      return { success: false, verifiedTime: 0 };
    }
  }

  // Get verified listening time for user
  async getVerifiedListeningTime(userAddress: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/listening/${userAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.totalListeningTime || 0;
    } catch (error) {
      console.error('Error getting verified listening time:', error);
      return 0;
    }
  }

  // Request reward claim signature
  async requestRewardSignature(userAddress: string): Promise<RewardClaim | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddress }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error requesting reward signature:', error);
      return null;
    }
  }

  // Verify user eligibility for rewards
  async checkRewardEligibility(userAddress: string): Promise<{
    eligible: boolean;
    nextRewardIn: number;
    availableRewards: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/check/${userAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking reward eligibility:', error);
      return { eligible: false, nextRewardIn: 0, availableRewards: 0 };
    }
  }
}
