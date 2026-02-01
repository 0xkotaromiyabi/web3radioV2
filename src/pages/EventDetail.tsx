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
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-24 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <NavBar />
                <div className="container py-24 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
                    <Link to="/events">
                        <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-900">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
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
                <Link to="/events" className="mb-8 inline-block">
                    <Button variant="ghost" className="text-gray-400 hover:text-green-400 pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                    </Button>
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 shadow-xl mb-8">
                            {event.image_url && (
                                <div className="w-full h-64 md:h-80 relative">
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                                    {event.title}
                                </h1>

                                <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                    {event.description.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-24">
                            <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Date</p>
                                        <p className="text-white font-medium">
                                            {new Date(event.date).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Location</p>
                                        <p className="text-white font-medium">{event.location}</p>
                                        <Badge variant={event.location.toLowerCase().includes('online') ? "outline" : "default"} className="mt-1">
                                            {event.location.toLowerCase().includes('online') ? 'Online' : 'In Person'}
                                        </Badge>
                                    </div>
                                </div>

                                <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold mt-4">
                                    <Share2 className="mr-2 h-4 w-4" /> Share Event
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
