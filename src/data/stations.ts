
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
    {
        id: 'web3',
        name: 'Web3 Radio',
        streamUrl: 'http://100.67.23.46:8000/stream',
        genre: 'community',
        description: 'Community-Powered Web3 Broadcasting',
        mockMetadata: {
            title: "Decentralized Beats",
            artist: "Miner 49er",
            artwork: "https://webthreeradio.xyz/assets/web3radio-logo.png"
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
    }
];

export const getStationById = (id: string) => STATIONS.find(s => s.id === id);
