import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { getNewsBySlug } from '@/lib/supabase';
import { NewsItem } from '@/types/content';
import { useToast } from '@/components/ui/use-toast';

const NewsDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchNewsItem = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const { data, error } = await getNewsBySlug(slug);

                if (error) {
                    throw error;
                }

                if (data) {
                    setNewsItem(data);
                } else {
                    toast({
                        title: "News not found",
                        description: "The requested news item could not be found.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error('Error loading news:', error);
                toast({
                    title: "Error",
                    description: "Failed to load news details.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchNewsItem();
    }, [slug, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-24 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                </div>
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-24 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">News Item Not Found</h1>
                    <Link to="/news">
                        <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-900">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <NavBar />
            <div className="container py-12 max-w-4xl">
                <Link to="/news" className="mb-8 inline-block">
                    <Button variant="ghost" className="text-gray-400 hover:text-green-400 pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market Intelligence
                    </Button>
                </Link>

                <article className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
                    {newsItem.image_url && (
                        <div className="w-full h-64 md:h-96 relative">
                            <img
                                src={newsItem.image_url}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex items-center gap-2 mb-4 text-sm text-green-400">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(newsItem.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                            {newsItem.title}
                        </h1>

                        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                            {newsItem.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default NewsDetail;
