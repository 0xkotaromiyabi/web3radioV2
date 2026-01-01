import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// NOTE: Ensure THIRDWEB_SECRET_KEY is set in your environment variables
const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
});

// NOTE: Update serverWalletAddress with your actual server wallet address
const thirdwebFacilitator = facilitator({
    client,
    serverWalletAddress: "0xYourServerWalletAddress",
    waitUtil: "simulated",
});

export async function POST(request: Request) {
    const paymentData = request.headers.get("x-payment");

    if (!paymentData) {
        return Response.json({ error: "Missing x-payment header" }, { status: 400 });
    }

    // verify and process the payment
    const result = await settlePayment({
        resourceUrl: "https://api.example.com/premium-content", // Update this if needed
        method: "POST",
        paymentData,
        payTo: "0x242DfB7849544eE242b2265cA7E585bdec60456B", // User provided address
        network: defineChain(8453), // Base
        price: {
            amount: "10000",
            asset: {
                address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // User provided asset address
            },
        },
        facilitator: thirdwebFacilitator,
    });

    if (result.status === 200) {
        // Payment verified and settled successfully
        return Response.json({ data: "premium content unlocked!" });
    } else {
        // Payment required
        return Response.json(result.responseBody, {
            status: result.status,
            headers: result.responseHeaders,
        });
    }
}
