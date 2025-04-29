
import React, { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Radio program schedule data
const weeklySchedule = [
  // Monday
  [
    { time: "08:00-10:00", program: "Blockchain Breakfast", host: "Alex Johnson", description: "Start your day with the latest blockchain news and trends" },
    { time: "10:00-12:00", program: "DeFi Discussions", host: "Maria Garcia", description: "Deep dive into decentralized finance projects and analysis" },
    { time: "12:00-14:00", program: "NFT Noon", host: "Jamal Williams", description: "Everything about NFTs, digital art, and collectibles" },
    { time: "14:00-16:00", program: "Crypto Charts", host: "Sophie Chen", description: "Technical analysis and trading strategies for cryptocurrencies" },
    { time: "16:00-18:00", program: "Web3 Wonders", host: "David Kim", description: "Exploring the latest innovations in Web3 technologies" },
    { time: "18:00-20:00", program: "The Ethereum Evening", host: "Elena Rodriguez", description: "Focus on Ethereum ecosystem developments and projects" },
    { time: "20:00-22:00", program: "Metaverse Moments", host: "Marcus Lee", description: "Virtual worlds, gaming, and the metaverse landscape" },
    { time: "22:00-00:00", program: "Crypto Night Owl", host: "Samantha Taylor", description: "Late-night discussions on crypto philosophy and future" },
  ],
  // Tuesday
  [
    { time: "08:00-10:00", program: "Token Talk", host: "Ryan Mitchell", description: "Analysis of new and established tokens in the market" },
    { time: "10:00-12:00", program: "Smart Contract Sessions", host: "Olivia Brown", description: "Detailed look at smart contract technology and applications" },
    { time: "12:00-14:00", program: "Mining Midday", host: "Carlos Vega", description: "All about mining, staking, and consensus mechanisms" },
    { time: "14:00-16:00", program: "DAO Discussions", host: "Priya Patel", description: "Exploring decentralized autonomous organizations" },
    { time: "16:00-18:00", program: "Crypto Compliance", host: "Michael Stevens", description: "Regulatory updates and compliance in the crypto space" },
    { time: "18:00-20:00", program: "Layer 2 Lounge", host: "Aisha Johnson", description: "Scalability solutions and Layer 2 technology discussions" },
    { time: "20:00-22:00", program: "Bitcoin Beat", host: "Thomas Wright", description: "Bitcoin-focused news, analysis, and market trends" },
    { time: "22:00-00:00", program: "DApps After Dark", host: "Nina Zhao", description: "Showcase of innovative decentralized applications" },
  ],
  // Wednesday
  [
    { time: "08:00-10:00", program: "Crypto Cafe", host: "James Wilson", description: "Casual crypto discussions with special guest interviews" },
    { time: "10:00-12:00", program: "Wallet Workshop", host: "Linda Martinez", description: "Security, features, and tips for crypto wallets" },
    { time: "12:00-14:00", program: "Tokenomics Today", host: "Kevin Patel", description: "In-depth analysis of token economics and design" },
    { time: "14:00-16:00", program: "Solana Spotlight", host: "Rachel Kim", description: "Focus on Solana ecosystem projects and development" },
    { time: "16:00-18:00", program: "Privacy Protocols", host: "Daniel Lee", description: "Discussions on privacy coins and confidential transactions" },
    { time: "18:00-20:00", program: "Founders Forum", host: "Sarah Johnson", description: "Interviews with blockchain and crypto project founders" },
    { time: "20:00-22:00", program: "Governance Gathering", host: "Omar Hassan", description: "Blockchain governance models and token voting systems" },
    { time: "22:00-00:00", program: "Cross-Chain Chronicles", host: "Lily Chen", description: "Interoperability solutions and cross-chain technologies" },
  ],
  // Thursday
  [
    { time: "08:00-10:00", program: "DeFi Daybreak", host: "Andrew Smith", description: "Morning update on DeFi yields, trends, and opportunities" },
    { time: "10:00-12:00", program: "Tech Talk", host: "Zoe Williams", description: "Technical deep dives into blockchain architecture" },
    { time: "12:00-14:00", program: "Alt Coin Analysis", host: "Miguel Rodriguez", description: "Research and analysis of alternative cryptocurrencies" },
    { time: "14:00-16:00", program: "Enterprise Blockchain", host: "Jennifer Lee", description: "Blockchain applications in enterprise and industry" },
    { time: "16:00-18:00", program: "Green Blockchain", host: "Ethan Green", description: "Sustainability and environmental aspects of blockchain" },
    { time: "18:00-20:00", program: "Crypto Economics", host: "Sophia Adams", description: "Economic theories and implications of cryptocurrencies" },
    { time: "20:00-22:00", program: "NFT Night", host: "Jason Taylor", description: "Evening showcase of NFT projects and artist interviews" },
    { time: "22:00-00:00", program: "Midnight Mining", host: "Lucas Martin", description: "Late-night discussions on mining technology and trends" },
  ],
  // Friday
  [
    { time: "08:00-10:00", program: "Crypto Kickstart", host: "Natalie Johnson", description: "End the week with major crypto news and market analysis" },
    { time: "10:00-12:00", program: "Polkadot Perspectives", host: "Chris Wong", description: "Focus on Polkadot ecosystem and parachains" },
    { time: "12:00-14:00", program: "Lunch with Leaders", host: "Gabriela Sanchez", description: "Interviews with blockchain industry leaders" },
    { time: "14:00-16:00", program: "Trading Tactics", host: "Derek Chen", description: "Crypto trading strategies and market psychology" },
    { time: "16:00-18:00", program: "Regulatory Roundup", host: "Victoria Taylor", description: "Weekly summary of global crypto regulations" },
    { time: "18:00-20:00", program: "Weekend Watchlist", host: "Robert Kim", description: "Projects and developments to watch over the weekend" },
    { time: "20:00-22:00", program: "Community Corner", host: "Maya Johnson", description: "Highlighting crypto community initiatives and projects" },
    { time: "22:00-00:00", program: "Crypto Clubhouse", host: "Aiden Smith", description: "Friday night crypto discussions in a relaxed format" },
  ],
  // Saturday
  [
    { time: "08:00-10:00", program: "Weekend Web3", host: "Tyler Brown", description: "Weekend catch-up on Web3 developments" },
    { time: "10:00-12:00", program: "DeFi Deep Dive", host: "Hannah Lee", description: "Extended analysis of DeFi protocols and strategies" },
    { time: "12:00-14:00", program: "Metaverse Meetup", host: "Jordan Taylor", description: "Weekend exploration of metaverse platforms" },
    { time: "14:00-16:00", program: "Crypto Crash Course", host: "Nicole Garcia", description: "Educational content for crypto beginners" },
    { time: "16:00-18:00", program: "The Hash Rate", host: "Benjamin Moore", description: "Mining difficulty, hash rates, and network security" },
    { time: "18:00-20:00", program: "Saturday Social", host: "Isabella Martinez", description: "Social applications of blockchain technology" },
    { time: "20:00-22:00", program: "Weekend Wallet", host: "Eric Johnson", description: "Personal finance and crypto investment strategies" },
    { time: "22:00-00:00", program: "Blockchain Beats", host: "Alicia Williams", description: "Crypto news with music and entertainment" },
  ],
  // Sunday
  [
    { time: "08:00-10:00", program: "Sunday Staking", host: "Brian Lee", description: "All about staking, rewards, and passive income in crypto" },
    { time: "10:00-12:00", program: "Weekly Wrap-up", host: "Jessica Chen", description: "Review of the week's most important crypto stories" },
    { time: "12:00-14:00", program: "Future Finance", host: "Aaron Smith", description: "Vision and predictions for the future of finance" },
    { time: "14:00-16:00", program: "Blockchain Basics", host: "Melissa Johnson", description: "Fundamental concepts in blockchain for new listeners" },
    { time: "16:00-18:00", program: "Global Crypto", host: "David Zhang", description: "International perspectives on blockchain adoption" },
    { time: "18:00-20:00", program: "The Week Ahead", host: "Laura Martinez", description: "Preview of upcoming events in the crypto space" },
    { time: "20:00-22:00", program: "Dev Den", host: "Joshua Williams", description: "Developer-focused discussion on blockchain technology" },
    { time: "22:00-00:00", program: "Crypto Closeout", host: "Sophia Lee", description: "Winding down the week with relaxed crypto conversations" },
  ],
];

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Events = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  const handleDaySelect = (index: number) => {
    setSelectedDay(index);
  };

  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
          <div className="relative z-10">
            <NavBar />
            <div className="container py-8 px-4 md:px-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Radio Broadcast Schedule</h1>
                  <p className="text-gray-300 max-w-2xl">
                    Tune in to our Web3 radio programs throughout the week. From blockchain basics to advanced crypto analysis,
                    we've got you covered with 2-hour programs dedicated to the world of Web3, crypto, and blockchain.
                  </p>
                </div>
                
                <Card className="w-full md:w-auto bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Calendar</CardTitle>
                    <CardDescription className="text-gray-400">Select a date to see events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="text-white bg-gray-800/50 rounded-md border-gray-700"
                    />
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2 text-purple-300">
                    <CalendarIcon className="h-5 w-5" />
                    <CardTitle>Weekly Schedule</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    Our radio programs run 24/7 with 2-hour slots dedicated to different Web3 topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={dayNames[selectedDay].toLowerCase()} className="w-full">
                    <TabsList className="w-full md:w-auto flex flex-wrap mb-4 bg-gray-800 border-gray-700">
                      {dayNames.map((day, index) => (
                        <TabsTrigger 
                          key={day} 
                          value={day.toLowerCase()}
                          className="text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                          onClick={() => handleDaySelect(index)}
                        >
                          {day}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {dayNames.map((day, index) => (
                      <TabsContent key={day} value={day.toLowerCase()} className="mt-0">
                        <div className="rounded-md border border-gray-700 overflow-hidden">
                          <Table>
                            <TableHeader className="bg-gray-800">
                              <TableRow className="hover:bg-gray-800/70 border-gray-700">
                                <TableHead className="text-gray-300 w-32">Time</TableHead>
                                <TableHead className="text-gray-300">Program</TableHead>
                                <TableHead className="text-gray-300 hidden md:table-cell">Host</TableHead>
                                <TableHead className="text-gray-300 hidden lg:table-cell">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {weeklySchedule[index].map((slot, slotIndex) => (
                                <TableRow key={slotIndex} className="hover:bg-purple-900/20 border-gray-700">
                                  <TableCell className="font-medium text-gray-300 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-purple-400" />
                                    {slot.time}
                                  </TableCell>
                                  <TableCell className="font-semibold text-white">{slot.program}</TableCell>
                                  <TableCell className="text-gray-300 hidden md:table-cell">{slot.host}</TableCell>
                                  <TableCell className="text-gray-400 hidden lg:table-cell">{slot.description}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Special Events</CardTitle>
                    <CardDescription className="text-gray-400">Upcoming special broadcasts and guest appearances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-purple-900/30 border border-purple-700">
                        <div className="flex items-center gap-2 mb-2 text-purple-300">
                          <CalendarIcon className="h-4 w-4" />
                          <span className="font-semibold">{format(new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), "MMMM dd, yyyy")}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Crypto Summit Live Broadcast</h3>
                        <p className="text-gray-300">Special 4-hour broadcast covering the annual Crypto Summit with live interviews and panel discussions.</p>
                      </div>
                      
                      <div className="p-4 rounded-md bg-blue-900/30 border border-blue-700">
                        <div className="flex items-center gap-2 mb-2 text-blue-300">
                          <CalendarIcon className="h-4 w-4" />
                          <span className="font-semibold">{format(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), "MMMM dd, yyyy")}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">NFT Artist Showcase</h3>
                        <p className="text-gray-300">A special weekend program featuring interviews with top NFT artists and creators.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default Events;
