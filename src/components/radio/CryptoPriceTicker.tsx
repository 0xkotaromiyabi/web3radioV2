
import React, { useState, useEffect } from 'react';

interface CryptoPriceTickerProps {
  isMobile: boolean;
}

const CryptoPriceTicker = ({ isMobile }: CryptoPriceTickerProps) => {
  const [cryptoPrices, setCryptoPrices] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,cardano,polkadot&vs_currencies=usd"
        );
        const data = await response.json();
        const prices = [
          `BTC $${data.bitcoin.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `ETH $${data.ethereum.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `SOL $${data.solana.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,  
          `BNB $${data.binancecoin.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `ADA $${data.cardano.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          `DOT $${data.polkadot.usd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
        ];
        setCryptoPrices(prices);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${isMobile ? 'h-10 sm:h-12' : 'h-6 sm:h-8'} bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden relative`}>
      <div className="animate-marquee whitespace-nowrap flex items-center h-full">
        {cryptoPrices.map((price, index) => (
          <span key={index} className="text-[#00ff00] font-mono text-xs sm:text-sm mx-4 inline-flex items-center">
            💰 {price}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CryptoPriceTicker;
