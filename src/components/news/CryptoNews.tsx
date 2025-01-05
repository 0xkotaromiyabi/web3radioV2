import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: number;
  title: string;
  published_at: string;
  url: string;
  currencies: Array<{ code: string; title: string }>;
  kind: string;
  domain: string;
  votes: { positive: number; negative: number; important: number };
}

interface NewsResponse {
  results: NewsItem[];
}

const CryptoNews = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cryptoNews"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://cryptopanic.com/api/v1/posts/?auth_token=a9cc9331ec61b387eb8f535f71426215675b55ec&public=true"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json() as NewsResponse;
        return data;
      } catch (error) {
        console.error("Error fetching crypto news:", error);
        throw error;
      }
    },
    refetchInterval: 3600000, // Refetch every 1 hour (3600000 ms)
    staleTime: 3600000, // Consider data stale after 1 hour
    retry: 3, // Retry failed requests 3 times
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  if (isLoading) {
    return (
      <div className="mt-8 text-center text-gray-400">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-400">
        <p>Error loading news. Please try again later.</p>
        <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-[#9b87f5]">Latest Crypto News</h2>
      <div className="space-y-4">
        {data?.results.map((news) => (
          <Card key={news.id} className="bg-[#221F26] border-gray-700 hover:bg-gray-800 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9b87f5] hover:text-[#8B5CF6] font-medium"
                  >
                    {news.title}
                  </a>
                  <Badge variant="secondary" className="ml-2 bg-gray-700 text-gray-300">
                    {news.domain}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{new Date(news.published_at).toLocaleString()}</span>
                  {news.currencies && (
                    <div className="flex gap-1">
                      {news.currencies.map((currency) => (
                        <Badge key={currency.code} variant="outline" className="border-gray-600">
                          {currency.code}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-400">👍 {news.votes.positive}</span>
                  <span className="text-red-400">👎 {news.votes.negative}</span>
                  <span className="text-yellow-400">⭐ {news.votes.important}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CryptoNews;
