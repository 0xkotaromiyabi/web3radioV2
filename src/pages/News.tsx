import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, ArrowRight, Loader2, Newspaper } from 'lucide-react';
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
      <div className="min-h-screen bg-[#fef29c] flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#515044]/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
        body { font-family: 'Raleway', sans-serif; }
      `}</style>
      <NavBar />
      <div className="w-[90%] md:w-[70%] mt-24 md:mt-28 mb-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#515044]/80">MARKET INTELLIGENCE</h1>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold opacity-30 mt-2">
            News updates, analysis, and insights
          </p>
        </div>

        {news.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <div key={item.id} className="bg-white/90 backdrop-blur border border-[#515044]/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all group flex flex-col">
                {item.image_url && (
                  <div className="w-full h-48 overflow-hidden relative">
                    <Link to={`/news/${item.slug || item.id}`}>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#515044]/90 mb-3 leading-snug group-hover:text-black transition-colors">
                    <Link to={`/news/${item.slug || item.id}`}>
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-[#515044]/70 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {item.content.substring(0, 150)}...
                  </p>
                  <div className="mt-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 opacity-40">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/news/${item.slug || item.id}`}
                      className="flex items-center gap-2 text-[#515044] opacity-60 hover:opacity-100 group-hover:translate-x-1 transition-all"
                    >
                      Read Study <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur rounded-3xl border border-dashed border-[#515044]/20 shadow-inner">
            <Newspaper className="h-12 w-12 text-[#515044]/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#515044]/60 mb-2 uppercase tracking-widest">No News Yet</h3>
            <p className="text-[#515044]/40 text-sm max-w-xs mx-auto">
              Check back soon for the latest market updates and announcements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
