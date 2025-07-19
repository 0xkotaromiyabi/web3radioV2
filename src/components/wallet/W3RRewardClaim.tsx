
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useW3RToken } from "@/contexts/W3RTokenContext";
import { useActiveAccount } from "thirdweb/react";
import { Coins, Clock, Gift, Loader } from 'lucide-react';

const W3RRewardClaim = () => {
  const account = useActiveAccount();
  const { balance, rewardEligible, nextRewardIn, claimReward, isLoading } = useW3RToken();
  const { toast } = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleClaimReward = async () => {
    if (!account?.address || !rewardEligible) return;

    setIsClaiming(true);
    try {
      const success = await claimReward();
      
      if (success) {
        toast({
          title: "Reward Claimed Successfully! 🎉",
          description: "You've received 100 W3R tokens for your listening time!",
        });
      } else {
        throw new Error('Claim failed');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Claim Failed",
        description: "Unable to claim reward. Please ensure you have sufficient gas and try again.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  if (!account) return null;

  return (
    <Card className="p-3 bg-[#222] border-[#444] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          W3R Rewards
        </h3>
        <Badge variant="outline" className="bg-[#111] text-yellow-400 border-[#333] flex items-center gap-1">
          {isLoading && <Loader className="w-3 h-3 animate-spin" />}
          {balance} W3R
        </Badge>
      </div>

      <div className="space-y-2">
        {rewardEligible ? (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-semibold">Reward Available!</span>
            </div>
            <Button
              onClick={handleClaimReward}
              disabled={isClaiming || isLoading}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              {isClaiming && <Loader className="w-3 h-3 animate-spin" />}
              {isClaiming ? "Claiming..." : "Claim 100 W3R"}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400">Next reward in:</span>
            </div>
            <Badge variant="outline" className="bg-[#111] text-blue-400 border-[#333] font-mono">
              {formatTime(nextRewardIn)}
            </Badge>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center">
        🎵 Earn 100 W3R tokens for every hour of verified listening
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
        <span className="text-gray-400">
          {isLoading ? 'Syncing...' : 'Connected to Base'}
        </span>
      </div>
    </Card>
  );
};

export default W3RRewardClaim;
