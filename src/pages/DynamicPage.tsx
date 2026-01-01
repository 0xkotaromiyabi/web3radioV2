import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { getPageBySlug } from '@/lib/supabase';
import { Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-12 flex justify-center items-center">
                    <Loader className="h-8 w-8 animate-spin text-green-500" />
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-12 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
                    <p className="text-gray-400">The page you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <NavBar />
            <div className="container py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-green-400">{page.title}</h1>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <ReactMarkdown>{page.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicPage;
