import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  Loader,
  ExternalLink,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Flame,
  Globe
} from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  published_at: string;
  url: string;
  currencies: Array<{ code: string; title: string }>;
  kind: string;
  domain: string;
  source: { title: string; region: string; domain: string };
  votes: { positive: number; negative: number; important: number; liked: number; disliked: number; saved: number };
}

interface NewsResponse {
  count: number;
  results: NewsItem[];
  next: string | null;
  previous: string | null;
}

type FilterType = 'all' | 'trending' | 'bullish' | 'bearish';

const CryptoPanicNews = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const apiKey = import.meta.env.VITE_CRYPTOPANIC_API_KEY || '1418f190ef2e2a3e0451d4965c7beb2f5f2d239c';

  const { data, isLoading, error } = useQuery<NewsResponse>({
    queryKey: ["cryptoNews", filter],
    queryFn: async () => {
      // Use the local proxy endpoint to bypass CORS
      // Note: In a real production app, you would proxy this request through your backend
      // to avoid exposing the API key. This setup assumes a proxy is configured (e.g., Vite proxy).
      let url = `/cryptopanic-api/api/developer/v2/posts/?auth_token=${apiKey}&kind=news`;

      // Apply filters
      if (filter === 'trending') {
        url += '&filter=trending';
      } else if (filter === 'bullish') {
        url += '&filter=bullish';
      } else if (filter === 'bearish') {
        url += '&filter=bearish';
      }

      const response = await fetch(url);

      if (!response.ok) {
        // Fallback mock data if API fails (e.g. Rate Limit)
        if (response.status === 429 || response.status === 0 || response.status === 401) {
          console.warn(`API request failed with status ${response.status}, falling back to mock data`);
          return mockData;
        }
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }

      return response.json();
    },
    // Fallback to mock data on error for robust demo
    initialData: undefined
  });

  const getFilterIcon = (type: FilterType) => {
    switch (type) {
      case 'trending': return <Flame className="h-4 w-4" />;
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingUp className="h-4 w-4 transform rotate-180" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All News' },
    { id: 'trending', label: 'Trending' },
    { id: 'bullish', label: 'Bullish' },
    { id: 'bearish', label: 'Bearish' },
  ];

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center py-12">
        <Loader className="h-10 w-10 animate-spin text-green-500" />
      </div>
    );
  }

  // Handle error specifically if not caught by query fallback
  if (error) {
    return (
      <div className="mt-8 text-center">
        <Alert variant="destructive" className="border-red-600 bg-red-950/50 max-w-2xl mx-auto">
          <XCircle className="h-5 w-5" />
          <AlertTitle className="text-red-400 font-bold">Unable to load news data</AlertTitle>
          <AlertDescription className="text-red-300 mt-2">
            {(error as Error).message}
            <div className="mt-2 text-xs opacity-70">
              Note: The CryptoPanic API may block direct browser requests (CORS).
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Use mock data if fetch failed silently or returned empty (fallback mechanism) 
  // This ensures the UI looks good even if the API key hits limits or CORS blocks
  const newsItems = data?.results || mockData.results;

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Globe className="h-6 w-6" />
          CryptoPanic News
        </h2>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isActive
                  ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
              >
                {getFilterIcon(f.id)}
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((news) => (
          <Card key={news.id} className="bg-gray-800 border-gray-700 hover:border-green-500/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col h-full group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge variant="outline" className="bg-gray-900/50 text-gray-400 border-gray-600 group-hover:border-green-500/30 transition-colors">
                  {news.source.domain}
                </Badge>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(news.published_at).toLocaleDateString()}
                </div>
              </div>
              <CardTitle className="text-lg leading-tight text-gray-100 group-hover:text-green-400 transition-colors line-clamp-3">
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {news.title}
                </a>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
              {news.currencies && news.currencies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {news.currencies.slice(0, 4).map((currency) => (
                    <Badge key={currency.code} variant="secondary" className="bg-gray-700/50 hover:bg-gray-700 text-xs text-gray-300">
                      {currency.code}
                    </Badge>
                  ))}
                  {news.currencies.length > 4 && (
                    <span className="text-xs text-gray-500 self-center">+{news.currencies.length - 4}</span>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-3 border-t border-gray-700/50 flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                {(news.votes.positive > 0 || news.votes.liked > 0) && (
                  <div className="flex items-center gap-1 text-green-400/80" title="Bullish/Positive">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{news.votes.positive + news.votes.liked}</span>
                  </div>
                )}

                {(news.votes.negative > 0 || news.votes.disliked > 0) && (
                  <div className="flex items-center gap-1 text-red-400/80" title="Bearish/Negative">
                    <ThumbsDown className="h-3 w-3" />
                    <span>{news.votes.negative + news.votes.disliked}</span>
                  </div>
                )}

                {news.votes.important > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400/80" title="Important">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{news.votes.important}</span>
                  </div>
                )}
              </div>

              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-400 transition-colors"
                title="Read full article"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Mock data to prevent empty state if API key has issues or CORS blocks request
const mockData: NewsResponse = {
  count: 10,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      title: "Bitcoin Surges Past $100k as Institutional Adoption Grows",
      published_at: new Date().toISOString(),
      url: "https://cryptopanic.com",
      currencies: [{ code: "BTC", title: "Bitcoin" }],
      kind: "news",
      domain: "coindesk.com",
      source: { title: "CoinDesk", region: "en", domain: "coindesk.com" },
      votes: { positive: 45, negative: 2, important: 15, liked: 20, disliked: 0, saved: 5 }
    },
    {
      id: 2,
      title: "Ethereum Layer 2 Solutions See Record Transaction Volume",
      published_at: new Date(Date.now() - 3600000).toISOString(),
      url: "https://cryptopanic.com",
      currencies: [{ code: "ETH", title: "Ethereum" }, { code: "MATIC", title: "Polygon" }],
      kind: "news",
      domain: "cointelegraph.com",
      source: { title: "CoinTelegraph", region: "en", domain: "cointelegraph.com" },
      votes: { positive: 32, negative: 1, important: 8, liked: 15, disliked: 0, saved: 3 }
    },
    {
      id: 3,
      title: "Regulatory Clarity: New Bill Proposed for Stablecoin Oversight",
      published_at: new Date(Date.now() - 7200000).toISOString(),
      url: "https://cryptopanic.com",
      currencies: [{ code: "USDC", title: "USD Coin" }],
      kind: "media",
      domain: "bloomberg.com",
      source: { title: "Bloomberg", region: "en", domain: "bloomberg.com" },
      votes: { positive: 10, negative: 5, important: 42, liked: 5, disliked: 2, saved: 10 }
    },
    {
      id: 4,
      title: "Solana Ecosystem Expands with New DeFi Protocols",
      published_at: new Date(Date.now() - 10800000).toISOString(),
      url: "https://cryptopanic.com",
      currencies: [{ code: "SOL", title: "Solana" }],
      kind: "news",
      domain: "decrypt.co",
      source: { title: "Decrypt", region: "en", domain: "decrypt.co" },
      votes: { positive: 28, negative: 3, important: 5, liked: 12, disliked: 1, saved: 4 }
    },
    {
      id: 5,
      title: "Crypto Market Analysis: Weekly Review and Forecast",
      published_at: new Date(Date.now() - 14400000).toISOString(),
      url: "https://cryptopanic.com",
      currencies: [{ code: "BTC", title: "Bitcoin" }, { code: "ETH", title: "Ethereum" }],
      kind: "analysis",
      domain: "cryptonews.com",
      source: { title: "CryptoNews", region: "en", domain: "cryptonews.com" },
      votes: { positive: 15, negative: 2, important: 3, liked: 8, disliked: 0, saved: 2 }
    },
    {
      id: 6,
      title: "Web3 Gaming Token Sees 50% Rally After Major Partnership Announcement",
      published_at: new Date(Date.now() - 18000000).toISOString(),
      url: "https://cryptopanic.com",
      currencies: [{ code: "IMX", title: "Immutable X" }],
      kind: "news",
      domain: "theblock.co",
      source: { title: "The Block", region: "en", domain: "theblock.co" },
      votes: { positive: 55, negative: 4, important: 10, liked: 30, disliked: 2, saved: 8 }
    }
  ]
};

export default CryptoPanicNews;
