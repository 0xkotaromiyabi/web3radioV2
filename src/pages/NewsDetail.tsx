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
            <div className="min-h-screen bg-[#fef29c] flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#515044]/50" />
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className="min-h-screen bg-[#fef29c] flex flex-col items-center">
                <NavBar />
                <div className="container mt-32 text-center">
                    <h1 className="text-2xl font-bold text-[#515044] mb-4 uppercase tracking-widest opacity-50">News Item Not Found</h1>
                    <Link to="/news">
                        <Button variant="outline" className="border-[#515044]/20 text-[#515044] hover:bg-white rounded-2xl">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
                        </Button>
                    </Link>
                </div>
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
            <div className="w-[92%] md:w-[60%] mt-24 md:mt-28 mb-32">
                <Link to="/news" className="mb-8 inline-block">
                    <Button variant="ghost" className="text-[#515044]/50 hover:text-[#515044] hover:bg-transparent pl-0 uppercase text-[10px] font-bold tracking-[0.2em]">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Intelligence
                    </Button>
                </Link>

                <article className="bg-white/95 backdrop-blur rounded-[40px] overflow-hidden shadow-2xl border border-[#515044]/5">
                    {newsItem.image_url && (
                        <div className="w-full h-64 md:h-[450px] relative">
                            <img
                                src={newsItem.image_url}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-14">
                        <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-[#515044]/40">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(newsItem.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-[#515044] mb-10 leading-[1.1] tracking-tight">
                            {newsItem.title}
                        </h1>

                        <div className="prose prose-lg max-w-none text-[#515044]/80 leading-relaxed font-light">
                            {newsItem.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-6">
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
