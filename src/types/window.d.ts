
interface SolanaProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => void;
}

interface Window {
  solana?: SolanaProvider;
}
