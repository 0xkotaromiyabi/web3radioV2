import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';
import { Wallet, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";

const WalletConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => open({ view: 'Account' })}
          className="flex items-center gap-3 px-6 py-4 bg-white/90 border border-[#515044]/10 text-[#515044] rounded-2xl shadow-sm hover:bg-white transition-all font-mono text-[10px]"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
        <button
          onClick={() => disconnect()}
          className="p-4 bg-red-500/5 hover:bg-red-500 text-red-500/40 hover:text-white rounded-2xl transition-all shadow-sm"
          title="Disconnect Wallet"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#515044] hover:bg-black text-white rounded-[24px] transition-all shadow-xl shadow-[#515044]/10 uppercase text-[10px] tracking-[0.3em] font-bold"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
};

export default WalletConnectButton;
