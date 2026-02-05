
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Gift,
    Coins,
    Timer,
    TrendingUp,
    Shield,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Zap,
    Trophy,
    Clock,
    Shuffle,
    Wallet,
    History,
    Users
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const PLY = () => {
    const { address, isConnected } = useAccount();
    const { open } = useAppKit();

    // Mock data for demonstration
    const currentEpoch = {
        id: 7,
        daysRemaining: 8,
        totalTips: 1250000,
        prizePool: 125000,
        participants: 342,
        progress: 47
    };

    const previousWinners = [
        { address: '0x1234...5678', prize: 8500, epoch: 6 },
        { address: '0xabcd...efgh', prize: 6200, epoch: 5 },
        { address: '0x9876...4321', prize: 9800, epoch: 4 },
    ];

    const myTips = [
        { amount: 5000, date: '2026-01-28', epochId: 7 },
        { amount: 2500, date: '2026-01-25', epochId: 7 },
        { amount: 10000, date: '2026-01-15', epochId: 6 },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <NavBar />

            {/* Hero Section - Apple Style */}
            <div className="bg-white border-b border-gray-200 px-4 py-16 md:py-24 text-center">
                <div className="container mx-auto max-w-4xl space-y-4">
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 mb-2">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Prize-Linked Yield
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        PLY: Tip & Win
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Setiap tip yang kamu berikan ikut membangun ekosistem dan bisa kembali ke kamu sebagai hadiah setiap 15 hari!
                    </p>

                    <div className="flex justify-center gap-4 pt-4">
                        {!isConnected ? (
                            <Button onClick={() => open()} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/20">
                                <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                            </Button>
                        ) : (
                            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/20">
                                <Gift className="w-4 h-4 mr-2" /> Tip Sekarang
                            </Button>
                        )}
                        <Button variant="outline" size="lg" className="rounded-xl">
                            Pelajari Lebih Lanjut <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <Tabs defaultValue="overview" className="space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                            <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                <TrendingUp className="w-4 h-4 mr-2" /> Overview
                            </TabsTrigger>
                            <TabsTrigger value="how-it-works" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                <Zap className="w-4 h-4 mr-2" /> How It Works
                            </TabsTrigger>
                            <TabsTrigger value="history" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
                                <History className="w-4 h-4 mr-2" /> History
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Current Epoch Card */}
                            <Card className="shadow-lg border-purple-100 bg-gradient-to-br from-purple-50 to-white md:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-purple-900">
                                        <Clock className="w-6 h-6 text-purple-600" />
                                        Epoch #{currentEpoch.id}
                                    </CardTitle>
                                    <CardDescription className="text-purple-700/80">
                                        {currentEpoch.daysRemaining} hari tersisa dalam epoch ini
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-purple-900">{currentEpoch.prizePool.toLocaleString()}</span>
                                        <span className="text-lg text-purple-600 font-medium">IDRX Prize Pool</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-purple-800">
                                            <span>Progress Epoch</span>
                                            <span>{currentEpoch.progress}%</span>
                                        </div>
                                        <Progress value={currentEpoch.progress} className="h-3 bg-purple-100" />
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-purple-100 flex-1">
                                            <p className="text-xs text-purple-500 uppercase font-bold">Total Tips</p>
                                            <p className="font-bold text-gray-900">{currentEpoch.totalTips.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-purple-100 flex-1">
                                            <p className="text-xs text-pink-500 uppercase font-bold">Participants</p>
                                            <p className="font-bold text-gray-900">{currentEpoch.participants}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-purple-100 flex-1">
                                            <p className="text-xs text-orange-500 uppercase font-bold">Your Entries</p>
                                            <p className="font-bold text-gray-900">{isConnected ? '3' : '–'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Your Stats Card */}
                            <Card className="shadow-md border-gray-200 bg-white flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Your Stats</CardTitle>
                                    <CardDescription>Epoch #{currentEpoch.id}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-8">
                                    <div className="mb-4 inline-flex p-4 rounded-full bg-purple-50 text-purple-600">
                                        <Coins className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{isConnected ? '17,500' : '–'}</h3>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">IDRX Tipped</p>
                                    <p className="text-xs text-green-600 mt-2 font-medium">{isConnected ? '~14% chance to win' : 'Connect wallet'}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl" disabled={!isConnected}>
                                        <Gift className="w-4 h-4 mr-2" /> Tip Sekarang
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Distribution */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle>Distribusi Tip</CardTitle>
                                <CardDescription>Bagaimana tip kamu didistribusikan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex-1 h-4 bg-green-500 rounded-l-full"></div>
                                    <div className="w-[10%] h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-full"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold text-green-800">90%</span>
                                        </div>
                                        <p className="text-sm text-green-700">Langsung ke Penyiar/Contributor</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Trophy className="w-5 h-5 text-purple-600" />
                                            <span className="font-semibold text-purple-800">10%</span>
                                        </div>
                                        <p className="text-sm text-purple-700">Prize Pool (Undian 15 hari)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Previous Winners */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle>Pemenang Terakhir</CardTitle>
                                <CardDescription>Winners dari epoch sebelumnya</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {previousWinners.map((winner, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                    index === 1 ? 'bg-gray-100 text-gray-600' :
                                                        'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-mono text-sm font-medium text-gray-900">{winner.address}</p>
                                                    <p className="text-xs text-gray-500">Epoch #{winner.epoch}</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-100 text-green-700 font-mono">
                                                +{winner.prize.toLocaleString()} IDRX
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* How It Works Tab */}
                    <TabsContent value="how-it-works" className="space-y-6">
                        {/* Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="shadow-sm border-gray-200 text-center">
                                <CardContent className="pt-8 pb-6 space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                                        <Coins className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Step 1</div>
                                    <h3 className="font-semibold text-lg text-gray-900">Tip Penyiar</h3>
                                    <p className="text-gray-500 text-sm">
                                        Kirim tip IDRX ke penyiar favorit. 90% langsung ke mereka, 10% masuk Prize Pool.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-gray-200 text-center">
                                <CardContent className="pt-8 pb-6 space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-sm">
                                        <Timer className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Step 2</div>
                                    <h3 className="font-semibold text-lg text-gray-900">Tunggu 15 Hari</h3>
                                    <p className="text-gray-500 text-sm">
                                        Setiap epoch berlangsung 15 hari. Prize Pool terus bertambah dari setiap tip.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-gray-200 text-center">
                                <CardContent className="pt-8 pb-6 space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm">
                                        <Trophy className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Step 3</div>
                                    <h3 className="font-semibold text-lg text-gray-900">Undian & Menang!</h3>
                                    <p className="text-gray-500 text-sm">
                                        Pemenang dipilih acak & transparan dengan Pyth Entropy. Hadiah auto-transfer!
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Key Features */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle>Keunggulan PLY</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="p-2 rounded-lg bg-green-100">
                                            <Shield className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Tidak Rugi Modal</h4>
                                            <p className="text-sm text-gray-500">Tip tetap mendukung penyiar, bukan taruhan</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="p-2 rounded-lg bg-blue-100">
                                            <Shuffle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Fair & Trustless</h4>
                                            <p className="text-sm text-gray-500">Pyth Entropy untuk randomness on-chain</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="p-2 rounded-lg bg-purple-100">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Engagement Naik</h4>
                                            <p className="text-sm text-gray-500">15-hari epoch = momen undian spesial</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="p-2 rounded-lg bg-orange-100">
                                            <Zap className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">On-Chain Transparan</h4>
                                            <p className="text-sm text-gray-500">Semua transaksi auditable di blockchain</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Epoch Flow Timeline */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle>Alur Mekanisme Epoch</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { phase: 'Hari 1-15', title: 'Fase Tip', icon: Clock, color: 'blue', desc: 'Listener tip penyiar, smart contract mencatat semua transaksi' },
                                    { phase: 'Hari ke-15', title: 'Penutupan Epoch', icon: CheckCircle, color: 'purple', desc: 'Epoch ditutup, Prize Pool (10%) dan Contributor Pool (90%) dihitung' },
                                    { phase: 'Undian', title: 'Pyth Entropy Randomness', icon: Shuffle, color: 'pink', desc: 'Angka acak terverifikasi on-chain menentukan pemenang' },
                                    { phase: 'Claim', title: 'Distribusi Reward', icon: Trophy, color: 'orange', desc: 'Penyiar dan pemenang menerima reward secara transparan' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center`}>
                                            <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs">{item.phase}</Badge>
                                                <span className="font-semibold text-gray-900">{item.title}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Smart Contracts */}
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle>Smart Contracts</CardTitle>
                                <CardDescription>Arsitektur modular untuk transparansi penuh</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { name: 'TipRouter', desc: 'Menerima tip IDRX', color: 'purple' },
                                        { name: 'EpochManager', desc: 'Kelola epoch 15 hari', color: 'blue' },
                                        { name: 'PLYLottery', desc: 'Integrasi Pyth Entropy', color: 'pink' },
                                        { name: 'ContributorVault', desc: 'Simpan reward penyiar', color: 'orange' },
                                    ].map((contract, index) => (
                                        <div key={index} className={`p-4 rounded-xl bg-${contract.color}-50 border border-${contract.color}-100 text-center`}>
                                            <code className={`text-sm font-mono font-bold text-${contract.color}-700`}>{contract.name}</code>
                                            <p className="text-xs text-gray-500 mt-1">{contract.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle>Riwayat Tip Kamu</CardTitle>
                                <CardDescription>Semua tip yang sudah kamu berikan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isConnected ? (
                                    <div className="space-y-3">
                                        {myTips.map((tip, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                        <Gift className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Tip to Epoch #{tip.epochId}</p>
                                                        <p className="text-xs text-gray-500">{tip.date}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-purple-100 text-purple-700 font-mono">
                                                    {tip.amount.toLocaleString()} IDRX
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>Connect wallet untuk melihat riwayat tip</p>
                                        <Button onClick={() => open()} variant="outline" className="mt-4 rounded-xl">
                                            <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200">
                            <CardHeader>
                                <CardTitle>Riwayat Epoch</CardTitle>
                                <CardDescription>Semua epoch yang sudah selesai</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[6, 5, 4].map((epochId) => (
                                        <div key={epochId} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Epoch #{epochId}</p>
                                                    <p className="text-xs text-gray-500">Completed</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{(Math.random() * 10000 + 5000).toFixed(0)} IDRX</p>
                                                <p className="text-xs text-gray-500">Prize Pool</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PLY;
