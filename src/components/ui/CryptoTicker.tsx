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
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
                );
                const data: CoinData[] = await res.json();
                setCoins(shuffle(data));
            } catch (err) {
                console.error('Failed to fetch crypto prices:', err);
            }
        };
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
                        <span className="text-[11px] font-bold text-[#515044]/70 uppercase">{coin.symbol}</span>
                        <span className="text-[11px] font-mono text-[#515044]">
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
