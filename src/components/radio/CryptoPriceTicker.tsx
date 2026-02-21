
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CryptoPriceTickerProps {
  isMobile: boolean;
}

interface CryptoPrice {
  symbol: string;
  price: number;
  change?: number;
}

const CryptoPriceTicker = ({ isMobile }: CryptoPriceTickerProps) => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.freecryptoapi.com/v1/getData?symbol=BTC+ETH+SOL+BNB+ADA+DOT",
          {
            headers: {
              "Authorization": "Bearer qfb2dddbggnatwgo72bd"
            }
          }
        );
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (data.status === "success" && data.symbols) {
          const prices: CryptoPrice[] = data.symbols.map((item: any) => ({
            symbol: item.symbol,
            price: parseFloat(item.last) || 0,
            change: parseFloat(item.daily_change_percentage) || 0
          }));
          setCryptoPrices(prices);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        // CORS or network error - use fallback static data
        console.warn("freecryptoapi.com API unavailable, using fallback data", error);
        setCryptoPrices([
          { symbol: 'BTC', price: 95000 },
          { symbol: 'ETH', price: 3200 },
          { symbol: 'SOL', price: 180 },
          { symbol: 'BNB', price: 580 },
          { symbol: 'ADA', price: 0.85 },
          { symbol: 'DOT', price: 7.5 },
        ]);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Reduce frequency to avoid rate limits

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else if (price >= 1) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    }
  };

  if (cryptoPrices.length === 0) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-100 animate-pulse w-24 h-10" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {cryptoPrices.map((crypto) => (
        <div
          key={crypto.symbol}
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] border border-gray-100 flex items-center gap-2"
        >
          <span className="text-sm font-medium text-foreground">{crypto.symbol}</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            ${formatPrice(crypto.price)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CryptoPriceTicker;
