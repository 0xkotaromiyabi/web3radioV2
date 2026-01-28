import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';
import { Wallet } from 'lucide-react';

const WalletConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => open({ view: 'Account' })}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
};

export default WalletConnectButton;
