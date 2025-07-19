
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
        <h1 className="text-3xl font-bold mb-8 text-green-400">Latest News</h1>
        
        {news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-green-500 overflow-hidden">
                {item.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-green-400">{item.title}</CardTitle>
                  <CardDescription className="text-gray-300">{new Date(item.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="text-white">
                  <p>{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No news articles available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
