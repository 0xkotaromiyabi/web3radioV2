import { useFetchWithPayment } from "thirdweb/react";
import { client } from "../services/w3rSmartContract";
import { Button } from "./ui/button";
import { useState } from "react";

export function MicropaymentButton() {
  const { fetchWithPayment, isPending } = useFetchWithPayment(client);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    try {
      setError(null);
      const response = await fetchWithPayment("/api/paid-endpoint");
      const data = await response.json();
      setPaymentResult(data);
      console.log("Payment successful:", data);
    } catch (err: any) {
      console.error("Payment failed:", err);
      setError(err.message || "Payment failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={onClick} disabled={isPending}>
        {isPending ? "Processing..." : "Pay Now (10000 USDC)"}
      </Button>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {paymentResult && (
        <div className="mt-4 p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
          <h3 className="font-bold text-green-700 dark:text-green-400">Success!</h3>
          <pre className="text-xs mt-2 overflow-auto max-w-xs">
            {JSON.stringify(paymentResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
