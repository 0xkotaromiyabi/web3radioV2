import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

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
  // Force the query to fail
  const { data, isLoading, error } = useQuery<NewsResponse>({
    queryKey: ["cryptoNews"],
    queryFn: async () => {
      // Simulate a network failure
      throw new Error("Failed to fetch");
    },
    retry: false, // Don't retry the request
    refetchOnWindowFocus: false,
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
      <div className="mt-8 text-center">
        <Alert variant="destructive" className="border-red-600 bg-red-950/50">
          <XCircle className="h-5 w-5" />
          <AlertTitle className="text-red-400 font-bold">Error loading news. Please try again later.</AlertTitle>
          <AlertDescription className="text-red-300">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </AlertDescription>
        </Alert>
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
