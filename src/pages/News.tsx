import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, ArrowRight, Loader, Newspaper } from 'lucide-react';
import { fetchNews, subscribeToTable } from '@/lib/supabase';
import { NewsItem } from '@/types/content';

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const { data, error } = await fetchNews();
        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();

    // Set up real-time subscription
    const subscription = subscribeToTable('news', () => {
      loadNews();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavBar />
        <div className="container py-12 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 tracking-tight">Market Intelligence</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Latest updates, analysis, and insights from the Web3 Radio team.
          </p>
        </div>

        {news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-green-500/50 hover:border-green-400 transition-colors overflow-hidden flex flex-col group">
                {item.image_url && (
                  <div className="w-full h-48 overflow-hidden relative">
                    <Link to={`/news/${item.slug || item.id}`}>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-green-400 line-clamp-2">
                    <Link to={`/news/${item.slug || item.id}`} className="hover:text-green-300 transition-colors">
                      {item.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-300 line-clamp-3 mb-4">
                    {item.content.substring(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t border-gray-700/50 pt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500/70" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/news/${item.slug || item.id}`}
                    className="flex items-center gap-1 text-green-400 hover:text-green-300 group-hover:translate-x-1 transition-transform"
                  >
                    Read More <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
            <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No News Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back soon for the latest market updates and announcements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
