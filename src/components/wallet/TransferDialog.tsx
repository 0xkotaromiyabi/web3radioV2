
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { Label } from '@/components/ui/label';

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  network: 'base' | 'solana';
  balance: string;
  onTransfer: (recipient: string, amount: string) => Promise<void>;
}

const TransferDialog = ({ isOpen, onClose, network, balance, onTransfer }: TransferDialogProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const networkColors = {
    base: 'text-blue-500',
    solana: 'text-purple-500'
  };
  
  const handleTransfer = async () => {
    // Basic validation
    if (!recipient) {
      toast({
        title: "Recipient required",
        description: "Please enter a recipient address",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(amount) > parseFloat(balance)) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${balance} IDRX available`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await onTransfer(recipient, amount);
      toast({
        title: "Transfer initiated",
        description: `${amount} IDRX is being transferred to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      });
      
      // Reset form and close dialog
      setRecipient('');
      setAmount('');
      onClose();
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#222] text-white border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-white">Transfer IDRX</DialogTitle>
          <DialogDescription className="text-gray-400">
            Send IDRX tokens on the <span className={networkColors[network]}>
              {network.charAt(0).toUpperCase() + network.slice(1)}
            </span> network
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm text-gray-300">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder={network === 'base' ? '0x...' : '...'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-[#333] border-[#555] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount" className="text-sm text-gray-300">Amount</Label>
              <span className="text-xs text-gray-400">Balance: {balance} IDRX</span>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#333] border-[#555] text-white"
              min="0"
              step="0.01"
            />
            <div className="flex justify-end">
              <button 
                type="button" 
                className="text-xs text-blue-400 hover:text-blue-300" 
                onClick={() => setAmount(balance)}
              >
                Max
              </button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-[#333] text-gray-200 border-[#555] hover:bg-[#444]"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer} 
            disabled={isLoading}
            className={`${network === 'base' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-1 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <ArrowRight size={16} className="mr-1" />
                Transfer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDialog;
