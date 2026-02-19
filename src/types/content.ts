export interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
    image_url?: string;
    slug?: string;
    category?: 'news' | 'job' | 'event';
    created_at?: string;
}

export interface Station {
    id: number;
    name: string;
    genre: string;
    description: string;
    streaming: boolean;
    image_url?: string;
    shortName?: string; // Optional for UI display
    slug?: string;
}
