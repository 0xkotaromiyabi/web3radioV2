
import React, { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, CreditCard, Wallet, Sparkles, HelpCircle, Check, X, LineChart } from "lucide-react";
import { toast } from "sonner";

const DAO = () => {
  const [selectedDonationNetwork, setSelectedDonationNetwork] = useState<'eth' | 'arbitrum'>('eth');
  const [donationAmount, setDonationAmount] = useState('0.1');
  
  // Mock proposals data
  const proposals = [
    {
      id: 1,
      title: "Sponsor a web3 development bootcamp",
      description: "Fund a 10-week bootcamp to teach web3 development to underprivileged students.",
      votesFor: 1254,
      votesAgainst: 340,
      status: "active",
      endDate: "2025-06-01",
      creator: "0x9B65...F832",
      creatorAvatar: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Add new radio station: Crypto Trading News",
      description: "Launch a new station focused on trading strategies and market analysis.",
      votesFor: 987,
      votesAgainst: 654,
      status: "active",
      endDate: "2025-05-25",
      creator: "0x7C43...A291",
      creatorAvatar: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Integrate with Lens Protocol for social features",
      description: "Add social features powered by Lens Protocol to increase user engagement.",
      votesFor: 1823,
      votesAgainst: 219,
      status: "passed",
      endDate: "2025-05-10",
      creator: "0x3F12...B456",
      creatorAvatar: "/placeholder.svg"
    }
  ];

  // Calculate vote percentages
  const getVotePercentage = (votesFor: number, votesAgainst: number) => {
    const total = votesFor + votesAgainst;
    return total > 0 ? Math.round((votesFor / total) * 100) : 0;
  };

  const handleDonate = () => {
    const network = selectedDonationNetwork === 'eth' ? 'Ethereum' : 'Arbitrum';
    const address = '0x53dfe235484465b723D81E56988263b50BafEA33';
    
    toast.success(`Thank you for your donation of ${donationAmount} ${selectedDonationNetwork.toUpperCase()} to ${address.slice(0, 6)}...${address.slice(-4)}`, {
      description: "Your support helps us build a better platform!",
      duration: 5000,
    });
  };

  const handleVote = (proposalId: number, vote: 'for' | 'against') => {
    toast.success(`Vote submitted: ${vote === 'for' ? 'Supporting' : 'Against'} proposal #${proposalId}`, {
      description: "Your vote has been recorded on-chain",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Support/Donation Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-6 border border-blue-500/20">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold flex items-center">
                  <Heart className="mr-2 text-red-500" /> Support Web3 Radio DAO
                </h2>
                <p className="mt-2 text-gray-300">
                  Your donation helps us maintain the platform, add new features, and support the community.
                  Donations are made directly to our treasury wallet on ETH or Arbitrum.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">Community Owned</Badge>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">Non-profit</Badge>
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">Transparent</Badge>
                </div>
              </div>
              
              <Card className="bg-gray-900 border-gray-700 w-full md:w-auto min-w-[320px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Donate to Treasury</CardTitle>
                  <CardDescription>Support with ETH or tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={selectedDonationNetwork === 'eth' ? "default" : "outline"}
                        onClick={() => setSelectedDonationNetwork('eth')}
                        className="flex items-center justify-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-[8px] font-bold">Ξ</span>
                        </div>
                        Ethereum
                      </Button>
                      <Button 
                        variant={selectedDonationNetwork === 'arbitrum' ? "default" : "outline"}
                        onClick={() => setSelectedDonationNetwork('arbitrum')}
                        className="flex items-center justify-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center">
                          <span className="text-[8px] font-bold">A</span>
                        </div>
                        Arbitrum
                      </Button>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Amount</p>
                      <div className="flex">
                        <Input 
                          type="number" 
                          value={donationAmount} 
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                        <Button variant="ghost" className="ml-2">Max</Button>
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className="text-gray-400">Recipient Address:</p>
                      <p className="font-mono text-xs bg-gray-800 p-2 rounded truncate">
                        0x53dfe235484465b723D81E56988263b50BafEA33
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleDonate} 
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Donate
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        
        {/* DAO Governance Section */}
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
            {proposals.map(proposal => {
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
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-600 text-green-400 hover:bg-green-900/20"
                              onClick={() => handleVote(proposal.id, 'for')}
                            >
                              <Check className="mr-1 h-4 w-4" /> For
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                              onClick={() => handleVote(proposal.id, 'against')}
                            >
                              <X className="mr-1 h-4 w-4" /> Against
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 flex items-center gap-3">
            <HelpCircle className="text-blue-400 h-6 w-6" />
            <p className="text-sm text-gray-300">
              Voting requires at least 100 RADIO tokens in your wallet. <a href="#" className="text-blue-400 underline">Learn more about governance</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DAO;
