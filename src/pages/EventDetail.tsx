import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Loader2, Share2 } from 'lucide-react';
import { getEventBySlug } from '@/lib/supabase';
import { Event } from '@/types/content';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const EventDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const { data, error } = await getEventBySlug(slug);

                if (error) throw error;

                if (data) {
                    setEvent(data);
                } else {
                    toast({
                        title: "Event not found",
                        description: "The requested event could not be found.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error('Error loading event:', error);
                toast({
                    title: "Error",
                    description: "Failed to load event details.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [slug, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fef29c] flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#515044]/50" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#fef29c] flex flex-col items-center">
                <NavBar />
                <div className="container mt-32 text-center">
                    <h1 className="text-2xl font-bold text-[#515044] mb-4 uppercase tracking-widest opacity-50">Event Not Found</h1>
                    <Link to="/events">
                        <Button variant="outline" className="border-[#515044]/20 text-[#515044] hover:bg-white rounded-2xl">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
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
            <div className="w-[92%] md:w-[70%] mt-24 md:mt-28 mb-32">
                <Link to="/events" className="mb-8 inline-block">
                    <Button variant="ghost" className="text-[#515044]/50 hover:text-[#515044] hover:bg-transparent pl-0 uppercase text-[10px] font-bold tracking-[0.2em]">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                    </Button>
                </Link>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="md:col-span-2">
                        <article className="bg-white/95 backdrop-blur rounded-[40px] overflow-hidden shadow-2xl border border-[#515044]/5 mb-8">
                            {event.image_url && (
                                <div className="w-full h-64 md:h-[400px] relative">
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-8 md:p-12">
                                <h1 className="text-3xl md:text-5xl font-bold text-[#515044] mb-10 leading-[1.1] tracking-tight">
                                    {event.title}
                                </h1>

                                <div className="prose prose-lg max-w-none text-[#515044]/80 leading-relaxed font-light">
                                    {event.description.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-6">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white/90 backdrop-blur rounded-[32px] p-8 shadow-xl border border-[#515044]/5 sticky top-28">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#515044]/40 mb-8">Event Brief</h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <Calendar className="h-5 w-5 text-[#515044]/30 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mb-1">Date</p>
                                        <p className="text-[#515044] font-bold text-sm">
                                            {new Date(event.date).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin className="h-5 w-5 text-[#515044]/30 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#515044]/30 mb-1">Location</p>
                                        <p className="text-[#515044] font-bold text-sm mb-2">{event.location}</p>
                                        <div className="bg-[#515044]/5 text-[#515044]/60 text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-lg inline-block">
                                            {event.location.toLowerCase().includes('online') ? 'Remote Access' : 'In Location'}
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-[#515044] hover:bg-black text-white rounded-2xl py-6 font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#515044]/20 transition-all hover:scale-[1.02]">
                                    <Share2 className="mr-2 h-4 w-4 opacity-50" /> Share Event
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
