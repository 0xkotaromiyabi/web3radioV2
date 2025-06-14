
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useW3RToken } from "@/contexts/W3RTokenContext";
import { useActiveAccount } from "thirdweb/react";
import { Coins, Clock, Gift } from 'lucide-react';

const W3RRewardClaim = () => {
  const account = useActiveAccount();
  const { balance, pendingRewards, claimEligible, refreshBalance } = useW3RToken();
  const { toast } = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  const CLAIM_THRESHOLD = 50000; // 50,000 W3R

  const handleClaimReward = async () => {
    if (!account?.address || !claimEligible) return;

    setIsClaiming(true);
    try {
      // In a real implementation, this would call your backend API
      // to generate a signature and then call mintWithSignature
      
      // Mock the reward claim process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset pending rewards after successful claim
      if (account?.address) {
        localStorage.setItem(`w3r-pending-rewards-${account.address}`, "0");
      }
      
      toast({
        title: "Rewards Claimed!",
        description: `You've successfully claimed ${pendingRewards.toLocaleString()} W3R tokens!`,
      });
      
      refreshBalance();
      // Force page refresh to update pending rewards
      window.location.reload();
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Claim Failed",
        description: "Unable to claim rewards. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  if (!account) return null;

  const progressPercentage = Math.min((pendingRewards / CLAIM_THRESHOLD) * 100, 100);

  return (
    <Card className="p-4 bg-[#222] border-[#444] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          W3R Rewards
        </h3>
        <Badge variant="outline" className="bg-[#111] text-yellow-400 border-[#333]">
          {balance} W3R
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Pending Rewards:</span>
            <span className="text-white font-mono">{pendingRewards.toLocaleString()} W3R</span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-[#333]"
          />
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Progress to claim:</span>
            <span className="text-blue-400">{progressPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {claimEligible ? (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-semibold">Ready to Claim!</span>
            </div>
            <Button
              onClick={handleClaimReward}
              disabled={isClaiming}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isClaiming ? "Claiming..." : `Claim ${pendingRewards.toLocaleString()} W3R`}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400">Keep Listening!</span>
            </div>
            <div className="text-xs text-gray-400">
              Need {(CLAIM_THRESHOLD - pendingRewards).toLocaleString()} more W3R to claim
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center border-t border-[#333] pt-3">
        Earn 100 W3R per hour • Claim threshold: 50,000 W3R
      </div>
    </Card>
  );
};

export default W3RRewardClaim;
