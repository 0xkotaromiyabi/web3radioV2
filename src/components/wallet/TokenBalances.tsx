
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, RefreshCw, Link } from 'lucide-react';
import { IDRX_TOKENS } from './constants/TokenConstants';

interface TokenBalancesProps {
  address: string | undefined;
  solanaWallet: string | null;
  idrxBalances: {
    base: string;
    solana: string;
  };
  loadingBalances: {
    base: boolean;
    solana: boolean;
  };
  refreshBalances: () => Promise<void>;
  openTransferDialog: (network: 'base' | 'solana') => void;
}

const TokenBalances = ({ 
  address, 
  solanaWallet, 
  idrxBalances, 
  loadingBalances, 
  refreshBalances,
  openTransferDialog 
}: TokenBalancesProps) => {
  return (
    <Card className="p-3 bg-[#222] border-[#444]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-white">IDRX Balances</h3>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-xs px-2 bg-[#333] hover:bg-[#444] border-[#555] text-white"
          onClick={refreshBalances}
          disabled={loadingBalances.base || loadingBalances.solana}
        >
          <RefreshCw size={12} className="mr-1" /> Refresh
        </Button>
      </div>
      
      <div className="space-y-2">
        {address && (
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">Base:</span>
            </div>
            <div className="flex items-center">
              {loadingBalances.base ? (
                <span className="font-mono text-gray-400">Loading...</span>
              ) : (
                <>
                  <span className="font-mono text-[#00ff00]">{idrxBalances.base} IDRX</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 ml-2 px-1 text-xs text-blue-400 hover:text-blue-300"
                    onClick={() => openTransferDialog('base')}
                    disabled={parseFloat(idrxBalances.base) <= 0}
                  >
                    <ArrowRight size={12} className="mr-1" /> Send
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
        
        {solanaWallet && (
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-300">Solana:</span>
            </div>
            <div className="flex items-center">
              {loadingBalances.solana ? (
                <span className="font-mono text-gray-400">Loading...</span>
              ) : (
                <>
                  <span className="font-mono text-[#00ff00]">{idrxBalances.solana} IDRX</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 ml-2 px-1 text-xs text-purple-400 hover:text-purple-300"
                    onClick={() => openTransferDialog('solana')}
                    disabled={parseFloat(idrxBalances.solana) <= 0}
                  >
                    <ArrowRight size={12} className="mr-1" /> Send
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-[#444]">
        <div className="flex flex-col space-y-1">
          {address && (
            <a 
              href={`https://explorer.base.org/token/${IDRX_TOKENS.base}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Link size={12} />
              <span>View on Base Explorer</span>
            </a>
          )}
          
          {solanaWallet && (
            <a 
              href={`https://explorer.solana.com/address/${IDRX_TOKENS.solana}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Link size={12} />
              <span>View on Solana Explorer</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TokenBalances;
