import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsItem {
  id: number;
  title: string;
  url: string;
  published_at: string;
  currencies: Array<{ code: string; title: string }>;
}

interface NewsResponse {
  results: NewsItem[];
}

const CryptoPanicNews = () => {
  const [filter, setFilter] = useState('hot');
  const API_BASE_URL = 'https://cryptopanic.com/api/v1/posts/';
  const AUTH_TOKEN = localStorage.getItem('CRYPTOPANIC_API_KEY') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptopanic', filter],
    queryFn: async () => {
      if (!AUTH_TOKEN) {
        throw new Error('Please set your CryptoPanic API key');
      }
      const response = await fetch(
        `${API_BASE_URL}?auth_token=${AUTH_TOKEN}&filter=${filter}&regions=en&kind=news`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return response.json() as Promise<NewsResponse>;
    },
    refetchInterval: 3600000, // Refetch every hour
  });

  if (!AUTH_TOKEN) {
    return (
      <div className="p-4 text-center">
        <input
          type="text"
          placeholder="Enter your CryptoPanic API key"
          className="px-4 py-2 border rounded"
          onChange={(e) => {
            localStorage.setItem('CRYPTOPANIC_API_KEY', e.target.value);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#00ff00]">CryptoPanic News</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="rising">Rising</SelectItem>
            <SelectItem value="bullish">Bullish</SelectItem>
            <SelectItem value="bearish">Bearish</SelectItem>
            <SelectItem value="important">Important</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-500 p-4 text-center">
          {error instanceof Error ? error.message : 'Failed to load news'}
        </div>
      )}

      <div className="space-y-4">
        {data?.results.map((item) => (
          <Card key={item.id} className="bg-[#1a1a1a] border-[#333]">
            <CardContent className="p-4">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ff00] hover:text-[#00cc00] transition-colors"
              >
                <h3 className="font-medium">{item.title}</h3>
              </a>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-400">
                <div className="flex gap-2">
                  {item.currencies?.map((currency) => (
                    <span key={currency.code} className="bg-[#333] px-2 py-1 rounded">
                      {currency.code}
                    </span>
                  ))}
                </div>
                <time>{new Date(item.published_at).toLocaleDateString()}</time>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CryptoPanicNews;