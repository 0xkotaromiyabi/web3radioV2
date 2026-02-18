
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { getPageBySlug } from '@/lib/supabase';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from "@/components/ui/badge";

type Page = {
    id: number;
    slug: string;
    title: string;
    content: string;
    is_published: boolean;
    created_at?: string;
};

const DynamicPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadPage = async () => {
            if (!slug) return;

            try {
                const { data, error } = await getPageBySlug(slug);

                if (error || !data) {
                    setError(true);
                } else {
                    setPage(data);
                }
            } catch (err) {
                console.error('Error loading page:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
                <style>{`
                    @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
                    body { font-family: 'Raleway', sans-serif; }
                `}</style>
                <NavBar />
                <div className="container py-24 flex flex-col justify-center items-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#515044]/20" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30">Fetching Data</p>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen w-full bg-[#fef29c] relative overflow-y-auto font-['Raleway',_sans-serif] text-[#515044] flex flex-col items-center">
                <style>{`
                    @import url('https://fonts.googleapis.com/css?family=Raleway:400,300,700');
                    body { font-family: 'Raleway', sans-serif; }
                `}</style>
                <NavBar />
                <div className="container py-24 md:py-32 px-6 max-w-lg mx-auto text-center flex flex-col items-center">
                    <div className="bg-white/90 backdrop-blur-2xl rounded-[48px] p-12 shadow-2xl border border-[#515044]/5 w-full flex flex-col items-center space-y-8">
                        <div className="w-20 h-20 rounded-3xl bg-red-500/5 flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-[#515044]">Page Not Found</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30">The requested content doesn't exist</p>
                        </div>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-[#515044] hover:bg-black text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-[#515044]/10 uppercase text-[10px] tracking-widest"
                        >
                            Go Back
                        </button>
                    </div>
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

            <div className="container py-12 md:py-24 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-6">
                    <Badge className="bg-[#515044]/5 text-[#515044] hover:bg-[#515044]/10 border-none px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
                        Published Content
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#515044]">{page.title}</h1>
                    <div className="h-1 w-20 bg-[#515044]/10 mx-auto rounded-full" />
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-[48px] p-8 md:p-16 border border-[#515044]/5 shadow-xl">
                    <div className="prose prose-[#515044] prose-headings:font-bold prose-p:font-light prose-p:leading-relaxed prose-a:text-[#515044] prose-a:font-bold max-w-none">
                        <ReactMarkdown>{page.content}</ReactMarkdown>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] font-bold uppercase tracking-widest text-[#515044]/20 flex items-center justify-center gap-2">
                    <FileText className="w-3 h-3" />
                    Last updated {page.created_at ? new Date(page.created_at).toLocaleDateString() : 'recently'}
                </div>
            </div>
        </div>
    );
};

export default DynamicPage;
