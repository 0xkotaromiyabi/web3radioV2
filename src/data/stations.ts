
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
        id: 'female',
        name: 'Female Radio',
        streamUrl: 'https://stream.rcs.revma.com/9thenqqd2ncwv',
        genre: 'pop',
        description: 'Music & Lifestyle for Modern Women',
        image_url: "https://femalecircle.id/img/coverArt.png"
    },
    {
        id: 'ozradio',
        name: 'Oz Radio Jakarta',
        streamUrl: 'https://streaming.ozradiojakarta.com:8443/ozjakarta',
        genre: 'news',
        description: 'News, Talk & Information',
        image_url: "https://images.noiceid.cc/catalog/content-1631518434114.png"
    },
    {
        id: 'web3',
        name: 'Web3 Radio',
        streamUrl: 'https://shoutcast.webthreeradio.xyz/radio.mp3',
        genre: 'community',
        description: 'Community-Powered Web3 Broadcasting',
        image_url: "https://i.imgur.com/RbUjvJM.png"
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
        streamUrl: 'https://stream.rcs.revma.com/h77wwp48kxcwv',
        genre: 'pop',
        description: "Jakarta's #1 Hit Music Station",
        image_url: "https://www.pramborsfm.com/img/coverArt.jpg"
    },
    {
        id: 'ebsfm',
        name: 'EBS FM',
        streamUrl: 'https://b.alhastream.com:5108/radio',
        genre: 'pop',
        description: 'EBS FM Unhas Makassar',
        image_url: "https://www.ebsfmunhas.com/wp-content/uploads/2018/04/1.-EBS-LOGO-MUBES-PNG-WEB-300x255.png"
    }
];

export const getStationById = (id: string) => STATIONS.find(s => s.id === id);
