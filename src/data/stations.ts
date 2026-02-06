
export interface Station {
    id: string;
    name: string;
    streamUrl: string;
    genre: string;
    description: string;
    image_url?: string;
    mockMetadata?: {
        title: string;
        artist: string;
        artwork: string;
    };
}

export const STATIONS: Station[] = [
    // Pop / Top 40
    {
        id: 'prambors',
        name: 'Prambors FM',
        streamUrl: 'https://s2.cloudmu.id/listen/prambors/stream',
        genre: 'pop',
        description: "Jakarta's #1 Hit Music Station",
        mockMetadata: {
            title: "Cruel Summer",
            artist: "Taylor Swift",
            artwork: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647"
        }
    },
    {
        id: 'female',
        name: 'Female Radio',
        streamUrl: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
        genre: 'pop',
        description: 'Music & Lifestyle for Modern Women',
        mockMetadata: {
            title: "Flowers",
            artist: "Miley Cyrus",
            artwork: "https://i.scdn.co/image/ab67616d0000b273f429d0bc2080443ec9423602"
        }
    },
    {
        id: 'iradio',
        name: 'i-Radio',
        streamUrl: 'https://n04.radiojar.com/4ywdgup3bnzuv?1744076195=&rj-tok=AAABlhMxTIcARnjabAV4uyOIpA&rj-ttl=5',
        genre: 'pop',
        description: "Today's Best Music",
        mockMetadata: {
            title: "Sial",
            artist: "Mahalini",
            artwork: "https://i.scdn.co/image/ab67616d0000b27361e204369e713626245eb0d9"
        }
    },

    // Rock / Alternative
    {
        id: 'delta',
        name: 'Delta FM',
        streamUrl: 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3',
        genre: 'rock',
        description: 'Rock & Alternative Music',
        mockMetadata: {
            title: "Yellow",
            artist: "Coldplay",
            artwork: "https://i.scdn.co/image/ab67616d0000b273e6a9ee2b2b1d072f518e3290"
        }
    },
    {
        id: 'hardrock',
        name: 'Hard Rock FM',
        streamUrl: 'https://example.com/hardrock', // Placeholder
        genre: 'rock',
        description: 'Classic Rock Anthems 24/7',
        mockMetadata: {
            title: "Sweet Child O' Mine",
            artist: "Guns N' Roses",
            artwork: "https://i.scdn.co/image/ab67616d0000b273318443aab3731ea124637d49"
        }
    },
    {
        id: 'indie',
        name: 'Indie Nation',
        streamUrl: 'https://example.com/indie', // Placeholder
        genre: 'rock',
        description: 'Alternative & Indie Rock Hits',
        mockMetadata: {
            title: "Do I Wanna Know?",
            artist: "Arctic Monkeys",
            artwork: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163"
        }
    },

    // News
    {
        id: 'bbc',
        name: 'BBC World Service',
        streamUrl: 'https://example.com/bbc', // Placeholder
        genre: 'news',
        description: 'Global News & Current Affairs',
        mockMetadata: {
            title: "Global Warning",
            artist: "BBC News",
            artwork: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_World_Service_2022.svg/1200px-BBC_World_Service_2022.svg.png"
        }
    },
    {
        id: 'ozradio',
        name: 'Oz Radio Jakarta',
        streamUrl: 'https://streaming.ozradiojakarta.com:8443/ozjakarta',
        genre: 'news',
        description: 'News, Talk & Information',
        mockMetadata: {
            title: "Morning Show",
            artist: "Oz Radio Crew",
            artwork: "https://pbs.twimg.com/profile_images/1615234149959602177/X9q9p7G0_400x400.jpg"
        }
    },
    {
        id: 'metronews',
        name: 'Metro News FM',
        streamUrl: 'https://example.com/metronews', // Placeholder
        genre: 'news',
        description: 'Your Source for Local & National News',
        mockMetadata: {
            title: "Breaking News",
            artist: "Metro Team",
            artwork: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR61f0-zV9g50p4o5m2_6d8d6d6d8d6d8d6d8&s"
        }
    },

    // Community / Web3
    {
        id: 'web3',
        name: 'Web3 Radio',
        streamUrl: 'https://web3radio.cloud/stream',
        genre: 'community',
        description: 'Community-Powered Web3 Broadcasting',
        mockMetadata: {
            title: "Decentralized Beats",
            artist: "Miner 49er",
            artwork: "https://web3radio.app/assets/web3radio-logo.png"
        }
    },
    {
        id: 'localvoice',
        name: 'Local Voice',
        streamUrl: 'https://example.com/localvoice', // Placeholder
        genre: 'community',
        description: 'Your Community, Your Voice',
        mockMetadata: {
            title: "Community Talk",
            artist: "Local Hosts",
            artwork: "https://cdn-icons-png.flaticon.com/512/1256/1256650.png"
        }
    },
    {
        id: 'campus',
        name: 'Campus FM',
        streamUrl: 'https://example.com/campus', // Placeholder
        genre: 'community',
        description: 'Student-Run Campus Radio',
        mockMetadata: {
            title: "Campus Vibes",
            artist: "Student DJ",
            artwork: "https://cdn-icons-png.flaticon.com/512/2995/2995101.png"
        }
    },
];

export const getStationById = (id: string) => STATIONS.find(s => s.id === id);
