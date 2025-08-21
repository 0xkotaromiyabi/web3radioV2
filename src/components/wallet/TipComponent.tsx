import React, { useState } from "react";
import { createThirdwebClient, prepareTransaction } from "thirdweb";
import { base } from "thirdweb/chains";
import {
  useConnect,
  useActiveWallet,
  useSendTransaction,
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, Wallet } from "lucide-react";

const BASE_TIP_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const TipComponent = () => {
  const [amount, setAmount] = useState("0.001");
  const { connect, isConnecting, error } = useConnect();
  const wallet = useActiveWallet();
  const {
    mutate: sendTx,
    data: txResult,
    error: txError,
    isPending,
  } = useSendTransaction();
  const { toast } = useToast();

  // Show success toast when transaction completes
  React.useEffect(() => {
    if (txResult) {
      toast({
        title: "Sawer Sent Successfully!",
        description: `${amount} ETH has been sent`,
      });
    }
  }, [txResult, amount, toast]);

  // Connect Metamask
  const handleConnect = () => {
    connect(async () => {
      const metamask = createWallet("io.metamask");
      await metamask.connect({ client });
      return metamask;
    });
  };

  // Kirim Tip
  const handleSendTip = async () => {
    try {
      // Konversi ETH ke wei
      const valueWei = BigInt(Number(amount) * 1e18);
      const transaction = prepareTransaction({
        to: BASE_TIP_ADDRESS,
        value: valueWei,
        chain: base,
        client,
        data: "0x",
      });
      sendTx(transaction);
    } catch (err: any) {
      toast({
        title: "Transaction Failed",
        description: err?.message || "Failed to send tip",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-[#1a1a1a] to-[#333] border-[#555]">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            Sawer Onchain ke {BASE_TIP_ADDRESS.slice(0, 6)}...
            {BASE_TIP_ADDRESS.slice(-4)}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400">
            Support Web3 Radio dengan ETH
          </p>
        </div>

        {!wallet ? (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Amount (ETH)</label>
              <Input
                type="number"
                step="0.0001"
                value={amount}
                min={0.0001}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#222] border-[#444] text-white placeholder:text-gray-500"
              />
            </div>

            <Button
              onClick={handleSendTip}
              disabled={isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Send Tip
                </>
              )}
            </Button>

            {txResult && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md">
                <p className="text-green-400 text-sm font-medium">Sent! Tx hash:</p>
                <a
                  href={`https://basescan.org/tx/${txResult.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs break-all"
                >
                  {txResult.transactionHash}
                </a>
              </div>
            )}

            {txError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md">
                <p className="text-red-400 text-sm">{txError.message}</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md">
            <p className="text-red-400 text-sm">{error.message}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TipComponent;