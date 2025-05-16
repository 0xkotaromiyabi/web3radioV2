
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import ProposalCard from './ProposalCard';

interface Proposal {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed';
  endDate: string;
  creator: string;
  creatorAvatar: string;
}

interface GovernanceSectionProps {
  proposals: Proposal[];
  getVotePercentage: (votesFor: number, votesAgainst: number) => number;
  handleVote: (proposalId: number, vote: 'for' | 'against') => void;
}

const GovernanceSection: React.FC<GovernanceSectionProps> = ({ 
  proposals, 
  getVotePercentage, 
  handleVote 
}) => {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Sparkles className="mr-2 text-yellow-500" /> Governance Proposals
        </h2>
        <Button>
          New Proposal <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {proposals.map(proposal => (
          <ProposalCard 
            key={proposal.id}
            proposal={proposal}
            getVotePercentage={getVotePercentage}
            handleVote={handleVote}
          />
        ))}
      </div>
      
      <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 flex items-center gap-3">
        <HelpCircle className="text-blue-400 h-6 w-6" />
        <p className="text-sm text-gray-300">
          Voting requires at least 100 RADIO tokens in your wallet. <a href="#" className="text-blue-400 underline">Learn more about governance</a>
        </p>
      </div>
    </section>
  );
};

export default GovernanceSection;
