
// Backend API service for W3R rewards - Updated to use Supabase Edge Functions
import { supabase } from "@/integrations/supabase/client";

export interface ListeningSession {
  userAddress: string;
  startTime: string;
  endTime: string;
  duration: number;
  stationId?: string;
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
  async submitListeningSession(session: ListeningSession): Promise<{ success: boolean; verifiedTime: number; sessionId?: string }> {
    try {
      console.log('Submitting listening session:', session);
      
      const { data, error } = await supabase.functions.invoke('w3r-api', {
        body: {
          ...session,
          action: 'submit_session'
        },
        method: 'POST'
      });

      if (error) {
        console.error('Error calling edge function:', error);
        return { success: false, verifiedTime: 0 };
      }

      console.log('Session submitted successfully:', data);
      return {
        success: data?.success || false,
        verifiedTime: data?.verifiedTime || 0,
        sessionId: data?.sessionId
      };
    } catch (error) {
      console.error('Error submitting listening session:', error);
      return { success: false, verifiedTime: 0 };
    }
  }

  // Get verified listening time for user
  async getVerifiedListeningTime(userAddress: string): Promise<number> {
    try {
      const { data, error } = await supabase.functions.invoke('w3r-api', {
        body: {
          action: 'get_listening_time',
          userAddress
        },
        method: 'POST'
      });

      if (error) {
        console.error('Error getting listening time:', error);
        return 0;
      }

      return data?.totalListeningTime || 0;
    } catch (error) {
      console.error('Error getting verified listening time:', error);
      return 0;
    }
  }

  // Request reward claim signature
  async requestRewardSignature(userAddress: string): Promise<RewardClaim | null> {
    try {
      const { data, error } = await supabase.functions.invoke('w3r-api', {
        body: {
          action: 'claim_reward',
          userAddress
        },
        method: 'POST'
      });

      if (error) {
        console.error('Error requesting reward signature:', error);
        return null;
      }

      return data || null;
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
      const { data, error } = await supabase.functions.invoke('w3r-api', {
        body: {
          action: 'check_eligibility',
          userAddress
        },
        method: 'POST'
      });

      if (error) {
        console.error('Error checking reward eligibility:', error);
        return { eligible: false, nextRewardIn: 0, availableRewards: 0 };
      }

      return data || { eligible: false, nextRewardIn: 0, availableRewards: 0 };
    } catch (error) {
      console.error('Error checking reward eligibility:', error);
      return { eligible: false, nextRewardIn: 0, availableRewards: 0 };
    }
  }
}
