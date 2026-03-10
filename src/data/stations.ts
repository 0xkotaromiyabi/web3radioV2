
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
        name: 'Oz Radio Bandung',
        streamUrl: 'https://streaming.ozradio.id:8443/ozbandung',
        genre: 'pop',
        description: 'YOUR FRIENDLY STATION',
        image_url: "https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/8f0d3c7d79eee4cbc80351517c75d938.png"
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
        genre: 'pop',
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
