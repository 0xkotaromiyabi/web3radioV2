
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useW3RToken } from "@/contexts/W3RTokenContext";
import { useActiveAccount } from "thirdweb/react";
import { Coins, Clock, Gift } from 'lucide-react';

const W3RRewardClaim = () => {
  const account = useActiveAccount();
  const { balance, rewardEligible, nextRewardIn, refreshBalance } = useW3RToken();
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
      // In a real implementation, this would call your backend API
      // to generate a signature and then mint tokens
      
      // Mock the reward claim process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Reward Claimed!",
        description: "You've received 100 W3R tokens for your listening time!",
      });
      
      refreshBalance();
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Claim Failed",
        description: "Unable to claim reward. Please try again later.",
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
        <Badge variant="outline" className="bg-[#111] text-yellow-400 border-[#333]">
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
              disabled={isClaiming}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
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
        Earn 100 W3R tokens for every hour of listening
      </div>
    </Card>
  );
};

export default W3RRewardClaim;
