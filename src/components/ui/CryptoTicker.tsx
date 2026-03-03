import React, { useState, useEffect } from 'react';

interface CoinData {
    id: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
}

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function CryptoTicker() {
    const [coins, setCoins] = useState<CoinData[]>([]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch(
                    'https://api.freecryptoapi.com/v1/getData?symbol=BTC+ETH+SOL+BNB+XRP+ADA+DOT+DOGE+LINK+TRX',
                    {
                        headers: {
                            'Authorization': 'Bearer qfb2dddbggnatwgo72bd'
                        }
                    }
                );

                if (!res.ok) {
                    setCoins(shuffle(fallbackData));
                    return;
                }

                const data = await res.json();

                if (data.status === "success" && data.symbols) {
                    const mappedData: CoinData[] = data.symbols.map((item: any) => ({
                        id: item.symbol.toLowerCase(),
                        symbol: item.symbol.toLowerCase(),
                        current_price: parseFloat(item.last) || 0,
                        price_change_percentage_24h: parseFloat(item.daily_change_percentage) || 0
                    }));
                    setCoins(shuffle(mappedData));
                } else {
                    setCoins(shuffle(fallbackData));
                }
            } catch (err) {
                // Catch CORS or Network errors silently and use fallback
                setCoins(shuffle(fallbackData));
            }
        };

        const fallbackData: CoinData[] = [
            { id: 'bitcoin', symbol: 'btc', current_price: 94500, price_change_percentage_24h: 1.2 },
            { id: 'ethereum', symbol: 'eth', current_price: 2550, price_change_percentage_24h: -0.5 },
            { id: 'solana', symbol: 'sol', current_price: 185, price_change_percentage_24h: 4.8 },
            { id: 'binancecoin', symbol: 'bnb', current_price: 610, price_change_percentage_24h: 0.2 },
            { id: 'ripple', symbol: 'xrp', current_price: 2.3, price_change_percentage_24h: 15.4 },
            { id: 'cardano', symbol: 'ada', current_price: 0.95, price_change_percentage_24h: -1.2 },
            { id: 'polkadot', symbol: 'dot', current_price: 7.2, price_change_percentage_24h: 2.1 },
            { id: 'dogecoin', symbol: 'doge', current_price: 0.38, price_change_percentage_24h: 5.6 },
            { id: 'chainlink', symbol: 'link', current_price: 22.5, price_change_percentage_24h: 0.8 },
            { id: 'tron', symbol: 'trx', current_price: 0.22, price_change_percentage_24h: 0.1 }
        ];
        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    if (coins.length === 0) return null;

    // Duplicate for seamless loop
    const tickerItems = [...coins, ...coins];

    return (
        <div className="w-[90%] md:w-[70%] overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .ticker-track {
                    display: flex;
                    gap: 24px;
                    animation: ticker 30s linear infinite;
                    width: max-content;
                }
                .ticker-track:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="ticker-track">
                {tickerItems.map((coin, i) => (
                    <div key={`${coin.id}-${i}`} className="flex items-center gap-1.5 whitespace-nowrap py-2">
                        <span className="text-[11px] font-bold text-white/70 uppercase">{coin.symbol}</span>
                        <span className="text-[11px] font-mono text-white">
                            ${coin.current_price >= 1 ? coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.current_price.toFixed(4)}
                        </span>
                        <span className={`text-[10px] font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
