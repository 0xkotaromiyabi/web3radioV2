
import { createMultiOwnerModularAccount } from "@alchemy/aa-accounts";
import { http } from "viem";
import { polygonMumbai } from "viem/chains";

// Smart account creation function
export const createAlchemySmartAccount = async (ownerAddress) => {
  try {
    console.log("Creating smart account with owner:", ownerAddress);
    
    // Using the correct imports based on latest version of @alchemy/aa packages
    const smartAccount = await createMultiOwnerModularAccount({
      transport: http("https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY"),
      chain: polygonMumbai,
      signer: { type: "local", privateKey: process.env.PRIVATE_KEY || "" },
      owners: [ownerAddress]
    });
    
    return {
      address: smartAccount.address,
      isDeployed: await smartAccount.isDeployed(),
      chain: "Polygon Mumbai"
    };
  } catch (error) {
    console.error("Failed to create smart account:", error);
    return null;
  }
};
