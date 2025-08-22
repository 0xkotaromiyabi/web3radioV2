import React, { useState } from "react";
import { createThirdwebClient, prepareTransaction, getContract, prepareContractCall } from "thirdweb";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, Wallet, Send } from "lucide-react";

const TOKENS = [
  {
    symbol: "ETH",
    name: "Base ETH",
    decimals: 18,
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    symbol: "USDC",
    name: "USDC",
    decimals: 6,
    address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
  },
  {
    symbol: "USDT",
    name: "Tether USDT",
    decimals: 6,
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  },
  {
    symbol: "IDRX",
    name: "IDRX",
    decimals: 18,
    address: "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
  },
];

const BASE_TIP_ADDRESS = "0x242DfB7849544eE242b2265cA7E585bdec60456B";

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

const TipComponent = () => {
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
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
        description: `${amount} ${selectedToken.symbol} has been sent`,
      });
    }
  }, [txResult, amount, selectedToken.symbol, toast]);

  // Connect Metamask
  const handleConnect = () => {
    connect(async () => {
      const metamask = createWallet("io.metamask");
      await metamask.connect({ client });
      return metamask;
    });
  };

  // Send Tip
  const handleSendTip = async () => {
    try {
      const n = Number(amount);
      if (!n || n <= 0) throw new Error("Invalid amount");
      
      const value = BigInt(n * Math.pow(10, selectedToken.decimals));
      
      if (selectedToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        // Native ETH transfer
        const transaction = prepareTransaction({
          to: BASE_TIP_ADDRESS,
          value: value,
          chain: base,
          client,
          data: "0x",
        });
        sendTx(transaction);
      } else {
        // TRANSFER ERC20
        const contract = getContract({
          address: selectedToken.address,
          chain: base,
          client,
        });
        const transaction = prepareContractCall({
          contract,
          method: "function transfer(address to, uint256 value)",
          params: [BASE_TIP_ADDRESS, value],
        });
        sendTx(transaction);
      }
    } catch (err: any) {
      toast({
        title: "Transaction Failed",
        description: err?.message || "Failed to send sawer",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-background border-border shadow-lg">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
            Sawer Onchain
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Support Web3Radio
          </p>
        </div>

        {!wallet ? (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
            variant="default"
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
              <label className="text-sm text-foreground mb-2 block">Select Token</label>
              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                {TOKENS.map((token) => (
                  <Button
                    key={token.symbol}
                    variant={selectedToken.symbol === token.symbol ? "default" : "outline"}
                    onClick={() => setSelectedToken(token)}
                    className="flex-1 h-auto p-2 sm:p-3 flex flex-col items-center min-w-0"
                  >
                    <span className="font-semibold text-xs sm:text-sm">{token.symbol}</span>
                    <span className="text-xs opacity-70 truncate">{token.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-foreground mb-2 block">Amount ({selectedToken.symbol})</label>
              <Input
                type="number"
                step="0.0001"
                value={amount}
                min={0.0001}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              onClick={handleSendTip}
              disabled={isPending || !wallet}
              className="w-full"
              variant="default"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Sawer Gan!!
                </>
              )}
            </Button>

            {txResult && (
              <div className="mt-4 p-3 bg-secondary border border-border rounded-md">
                <p className="text-foreground text-sm font-medium">Sent! Tx hash:</p>
                <a
                  href={`https://basescan.org/tx/${txResult.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 text-xs break-all underline"
                >
                  {txResult.transactionHash}
                </a>
              </div>
            )}

            {txError && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{txError.message}</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error.message}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TipComponent;
