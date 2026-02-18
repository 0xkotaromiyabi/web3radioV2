
export interface Station {
    id: string;
    name: string;
    streamUrl: string;
    genre: string;
    description: string;
    image_url?: string;
}

export const STATIONS: Station[] = [
    {
        id: 'web3',
        name: 'Web3 Radio',
        streamUrl: 'https://shoutcast.webthreeradio.xyz/stream',
        genre: 'community',
        description: 'Community-Powered Web3 Broadcasting',
        image_url: "https://storage.googleapis.com/papyrus_images/727fda00ec477888d92a63593993f66a.jpg"
    },
    {
        id: 'ozradio',
        name: 'Oz Radio Jakarta',
        streamUrl: 'https://streaming.ozradiojakarta.com:8443/ozjakarta',
        genre: 'news',
        description: 'News, Talk & Information',
        image_url: "https://p.kindpng.com/picc/s/376-3768602_oz-radio-logo-clipart-png-download-oz-radio.png"
    },
    {
        id: 'female',
        name: 'Female Radio',
        streamUrl: 'https://s1.cloudmu.id/listen/female_radio/radio.mp3',
        genre: 'pop',
        description: 'Music & Lifestyle for Modern Women',
        image_url: "https://femalecircle.id/img/coverArt.png"
    },
    {
        id: 'delta',
        name: 'Delta FM',
        streamUrl: 'https://s1.cloudmu.id/listen/delta_fm/radio.mp3',
        genre: 'rock',
        description: 'Rock & Alternative Music',
        image_url: "https://deltafm.net/img/coverArt.png"
    },
    {
        id: 'prambors',
        name: 'Prambors FM',
        streamUrl: 'https://s2.cloudmu.id/listen/prambors/stream',
        genre: 'pop',
        description: "Jakarta's #1 Hit Music Station",
        image_url: "https://www.pramborsfm.com/img/coverArt.jpg"
    }
];

export const getStationById = (id: string) => STATIONS.find(s => s.id === id);
