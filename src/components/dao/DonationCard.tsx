
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

interface DonationCardProps {
  selectedDonationNetwork: 'eth' | 'arbitrum';
  setSelectedDonationNetwork: (network: 'eth' | 'arbitrum') => void;
  donationAmount: string;
  setDonationAmount: (amount: string) => void;
  handleDonate: () => void;
}

const DonationCard: React.FC<DonationCardProps> = ({
  selectedDonationNetwork,
  setSelectedDonationNetwork,
  donationAmount,
  setDonationAmount,
  handleDonate
}) => {
  return (
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
  );
};

export default DonationCard;
