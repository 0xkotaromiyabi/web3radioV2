
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface VoteButtonsProps {
  proposalId: number;
  handleVote: (proposalId: number, vote: 'for' | 'against') => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ proposalId, handleVote }) => {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="border-green-600 text-green-400 hover:bg-green-900/20"
        onClick={() => handleVote(proposalId, 'for')}
      >
        <Check className="mr-1 h-4 w-4" /> For
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="border-red-600 text-red-400 hover:bg-red-900/20"
        onClick={() => handleVote(proposalId, 'against')}
      >
        <X className="mr-1 h-4 w-4" /> Against
      </Button>
    </div>
  );
};

export default VoteButtons;
