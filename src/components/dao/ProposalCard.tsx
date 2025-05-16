
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Check, X, LineChart } from "lucide-react";
import VoteButtons from './VoteButtons';

interface ProposalCardProps {
  proposal: {
    id: number;
    title: string;
    description: string;
    votesFor: number;
    votesAgainst: number;
    status: 'active' | 'passed';
    endDate: string;
    creator: string;
    creatorAvatar: string;
  };
  getVotePercentage: (votesFor: number, votesAgainst: number) => number;
  handleVote: (proposalId: number, vote: 'for' | 'against') => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, getVotePercentage, handleVote }) => {
  const percentage = getVotePercentage(proposal.votesFor, proposal.votesAgainst);

  return (
    <Card key={proposal.id} className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{proposal.title}</CardTitle>
            <CardDescription>{proposal.description}</CardDescription>
          </div>
          <Badge 
            variant={proposal.status === 'passed' ? 'default' : 'secondary'}
            className={proposal.status === 'passed' ? 'bg-green-700' : 'bg-blue-700'}
          >
            {proposal.status === 'passed' ? 'Passed' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Support: {percentage}%</span>
              <span>Ends: {proposal.endDate}</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              <span>{proposal.votesFor.toLocaleString()} For</span>
            </div>
            <div className="flex items-center">
              <X className="h-4 w-4 text-red-500 mr-1" />
              <span>{proposal.votesAgainst.toLocaleString()} Against</span>
            </div>
            <div className="flex items-center">
              <LineChart className="h-4 w-4 text-blue-500 mr-1" />
              <span>{(proposal.votesFor + proposal.votesAgainst).toLocaleString()} Total</span>
            </div>
          </div>
          
          <Separator className="bg-gray-700" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <img src={proposal.creatorAvatar} alt="Creator" />
              </Avatar>
              <span className="text-xs text-gray-400">Created by {proposal.creator}</span>
            </div>
            
            {proposal.status === 'active' && (
              <VoteButtons 
                proposalId={proposal.id} 
                handleVote={handleVote}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
