import React, { useState } from "react";
import {
  createThirdwebClient,
  NATIVE_TOKEN_ADDRESS,
  getContract,
  prepareContractCall,
  sendTransaction,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart } from "lucide-react";

const TOKENS = [
  {
    label: "ETH",
    address: NATIVE_TOKEN_ADDRESS,
    decimals: 18,
  },
  {
    label: "USDT",
    address: "0xA7D9Ddbe1f17865597fBD27EC712455208B6B76D",
    decimals: 6,
  },
  {
    label: "USDC",
    address: "0xd9AAEC86b65d86F6a7B5b1b0c42Ffa531710b6CA",
    decimals: 6,
  },
  {
    label: "IDRX",
    address: "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
    decimals: 18,
  },
];

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const TIP_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";

function toWei(amount: string, decimals: number): bigint {
  return BigInt(Math.floor(Number(amount) * 10 ** decimals));
}

const TipComponent = () => {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const account = useActiveAccount();
  const { toast } = useToast();

  const handleTip = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first!",
        variant: "destructive",
      });
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to tip",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let tx;
      if (selectedToken.address === NATIVE_TOKEN_ADDRESS) {
        // Native ETH transfer
        tx = {
          to: TIP_ADDRESS,
          value: toWei(amount, selectedToken.decimals),
        };
      } else {
        // ERC20 transfer
        const contract = await getContract({
          client,
          address: selectedToken.address,
          chain: base,
        });
        tx = prepareContractCall({
          contract,
          method: "function transfer(address to, uint256 amount)",
          params: [TIP_ADDRESS, toWei(amount, selectedToken.decimals)],
        });
      }
      
      await sendTransaction({ account, transaction: tx });
      
      toast({
        title: "Tip Sent Successfully!",
        description: `${amount} ${selectedToken.label} tip has been sent`,
      });
      
      setAmount("");
    } catch (err: any) {
      toast({
        title: "Transaction Failed",
        description: err?.message || "Failed to send tip",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-[#1a1a1a] to-[#333] border-[#555]">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">Send a Tip</h3>
          <p className="text-xs sm:text-sm text-gray-400">
            Support Web3 Radio with your favorite token
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Select Token</label>
            <Select 
              value={selectedToken.label} 
              onValueChange={(value) => setSelectedToken(TOKENS.find(t => t.label === value) || TOKENS[0])}
            >
              <SelectTrigger className="bg-[#222] border-[#444] text-white">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-[#222] border-[#444]">
                {TOKENS.map((token) => (
                  <SelectItem key={token.label} value={token.label} className="text-white hover:bg-[#333]">
                    {token.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Amount</label>
            <Input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter ${selectedToken.label} amount`}
              className="bg-[#222] border-[#444] text-white placeholder:text-gray-500"
            />
          </div>

          <Button
            onClick={handleTip}
            disabled={loading || !amount}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Tip...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Send Tip
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TipComponent;