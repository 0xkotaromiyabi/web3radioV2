
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchNews, subscribeToTable } from '@/lib/supabase';
import { Loader } from 'lucide-react';

type NewsItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  image_url?: string;
};

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
    const subscription = subscribeToTable('news', (payload) => {
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-green-400 text-center lg:text-left">Latest News</h1>
        
        {news.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {news.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-green-500 overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                {item.image_url && (
                  <div className="w-full h-40 sm:h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-green-400 text-base sm:text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-xs sm:text-sm">{new Date(item.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="text-white p-4 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base line-clamp-3">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <p className="text-gray-400 text-lg sm:text-xl">No news articles available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
