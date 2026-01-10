import { useAccount, useChainId } from "wagmi";

export function useWallet() {
    const { address, isConnected, status } = useAccount();
    const chainId = useChainId();

    // Base Mainnet Chain ID is 8453
    const isCorrectNetwork = chainId === 8453;

    return {
        address,
        isConnected,
        chainId,
        isCorrectNetwork,
        status,
    };
}
