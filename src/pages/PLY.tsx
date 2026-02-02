
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
    Shuffle
} from 'lucide-react';

const PLY = () => {
    // Mock data for demonstration
    const currentEpoch = {
        id: 7,
        daysRemaining: 8,
        totalTips: 125000,
        prizePool: 12500,
        participants: 342,
        progress: 47
    };

    const previousWinners = [
        { address: '0x1234...5678', prize: 8500, epoch: 6 },
        { address: '0xabcd...efgh', prize: 6200, epoch: 5 },
        { address: '0x9876...4321', prize: 9800, epoch: 4 },
    ];

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <main className="container mx-auto px-4 py-8 space-y-12">
                {/* Hero Section */}
                <section className="text-center space-y-6 py-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Prize-Linked Yield
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                        PLY: Tip & Win
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Setiap tip yang kamu berikan ikut membangun ekosistem dan bisa kembali ke kamu sebagai hadiah setiap 15 hari!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button className="btn-apple-primary gap-2">
                            <Gift className="w-4 h-4" />
                            Mulai Tip Sekarang
                        </Button>
                        <Button variant="outline" className="gap-2">
                            Pelajari Lebih Lanjut
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </section>

                {/* Current Epoch Status */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Epoch Saat Ini</h2>
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <CardContent className="p-6 md:p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">#{currentEpoch.id}</div>
                                    <div className="text-sm text-muted-foreground">Epoch ID</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-pink-600">{currentEpoch.daysRemaining}</div>
                                    <div className="text-sm text-muted-foreground">Hari Tersisa</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600">{currentEpoch.prizePool.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Prize Pool (IDRX)</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{currentEpoch.participants}</div>
                                    <div className="text-sm text-muted-foreground">Peserta</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress Epoch</span>
                                    <span>{currentEpoch.progress}%</span>
                                </div>
                                <Progress value={currentEpoch.progress} className="h-3" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* How It Works */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-bold text-center">Bagaimana PLY Bekerja?</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    <Coins className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-lg">1. Tip Penyiar</h3>
                                <p className="text-muted-foreground text-sm">
                                    Kirim tip IDRX ke penyiar favorit kamu. 90% langsung ke penyiar, 10% masuk Prize Pool.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                    <Timer className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-lg">2. Tunggu 15 Hari</h3>
                                <p className="text-muted-foreground text-sm">
                                    Setiap epoch berlangsung 15 hari. Prize Pool terus bertambah dari setiap tip.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                    <Trophy className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-lg">3. Undian & Menang!</h3>
                                <p className="text-muted-foreground text-sm">
                                    Pemenang dipilih secara acak & transparan dengan Pyth Entropy. Hadiah auto-transfer!
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Distribution */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Distribusi Tip</h2>
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-l-full" style={{ width: '90%' }}></div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-r-full w-16"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-4 rounded-xl bg-green-50">
                                        <div className="text-2xl font-bold text-green-600">90%</div>
                                        <div className="text-sm text-muted-foreground">Langsung ke Penyiar</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-purple-50">
                                        <div className="text-2xl font-bold text-purple-600">10%</div>
                                        <div className="text-sm text-muted-foreground">Prize Pool (Undian)</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Key Features */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Keunggulan PLY</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-green-100">
                                    <Shield className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Tidak Rugi Modal</h4>
                                    <p className="text-sm text-muted-foreground">Tip tetap mendukung penyiar, bukan taruhan</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <Shuffle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Fair & Trustless</h4>
                                    <p className="text-sm text-muted-foreground">Pyth Entropy untuk randomness on-chain</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Engagement Naik</h4>
                                    <p className="text-sm text-muted-foreground">15-hari epoch = momen undian spesial</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-orange-100">
                                    <Zap className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">On-Chain Transparan</h4>
                                    <p className="text-sm text-muted-foreground">Semua transaksi auditable di blockchain</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Epoch Flow */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Alur Mekanisme Epoch</h2>
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-orange-400 hidden md:block"></div>

                            <div className="space-y-8">
                                {/* Phase A */}
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center z-10">
                                        <Clock className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <Card className="flex-1">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">Hari 1-15</span>
                                                Fase Tip
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground space-y-2">
                                            <p>• Listener membuka Web3Radio dan mengklik Tip</p>
                                            <p>• Pilih nominal IDRX → kirim ke smart contract TipRouter</p>
                                            <p>• Smart contract mencatat: sender, amount, epochId</p>
                                            <p>• Frontend menampilkan progress bar epoch & Prize Pool</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Phase B */}
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center z-10">
                                        <CheckCircle className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <Card className="flex-1">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs">Hari ke-15</span>
                                                Penutupan Epoch
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground space-y-2">
                                            <p>• Epoch ditutup otomatis oleh EpochManager</p>
                                            <p>• Total tip (T) dihitung: PrizePool = 10% × T</p>
                                            <p>• ContributorPool = 90% × T untuk penyiar</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Phase C */}
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center z-10">
                                        <Shuffle className="w-8 h-8 text-pink-600" />
                                    </div>
                                    <Card className="flex-1">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <span className="px-2 py-1 rounded bg-pink-100 text-pink-700 text-xs">Undian</span>
                                                Pyth Entropy Randomness
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground space-y-2">
                                            <p>• Smart contract request angka acak dari Pyth Entropy</p>
                                            <p>• Pyth mengembalikan angka + proof yang terverifikasi</p>
                                            <p>• Pemenang dipilih (weighted by tip atau egaliter)</p>
                                            <p>• Hadiah otomatis ditransfer ke pemenang</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Phase D */}
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center z-10">
                                        <Trophy className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <Card className="flex-1">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs">Claim</span>
                                                Distribusi Reward
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground space-y-2">
                                            <p>• Penyiar claim reward dari Contributor Pool</p>
                                            <p>• Pemenang undian menerima Prize Pool</p>
                                            <p>• Semua transaksi on-chain → transparan & auditable</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Previous Winners */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Pemenang Sebelumnya</h2>
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {previousWinners.map((winner, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                    index === 1 ? 'bg-gray-100 text-gray-600' :
                                                        'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-mono text-sm">{winner.address}</div>
                                                    <div className="text-xs text-muted-foreground">Epoch #{winner.epoch}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-green-600">+{winner.prize.toLocaleString()} IDRX</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Smart Contracts Info */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Smart Contract Modular</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <code className="text-sm font-mono text-purple-600">TipRouter</code>
                                <p className="text-xs text-muted-foreground mt-2">Menerima tip IDRX, catat epoch</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <code className="text-sm font-mono text-blue-600">EpochManager</code>
                                <p className="text-xs text-muted-foreground mt-2">Buka/tutup epoch 15 hari</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <code className="text-sm font-mono text-pink-600">PLYLottery</code>
                                <p className="text-xs text-muted-foreground mt-2">Integrasi Pyth Entropy</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <code className="text-sm font-mono text-orange-600">ContributorVault</code>
                                <p className="text-xs text-muted-foreground mt-2">Simpan reward penyiar</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-12 space-y-6">
                    <h2 className="text-3xl font-bold">Siap Berpartisipasi?</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Dukung penyiar favoritmu dan dapatkan kesempatan memenangkan hadiah setiap 15 hari!
                    </p>
                    <Button size="lg" className="btn-apple-primary gap-2">
                        <Gift className="w-5 h-5" />
                        Mulai Tip Sekarang
                    </Button>
                </section>
            </main>
            {/* Simple Footer */}
            <footer className="border-t border-border/50 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2026 Web3Radio. Powered by IDRX & Pyth Entropy.</p>
                </div>
            </footer>
        </div>
    );
};

export default PLY;
