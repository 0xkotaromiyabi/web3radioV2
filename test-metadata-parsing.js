
// Native fetch in Node 18+

async function fetchAlbumArt(artist, title) {
    try {
        const searchQuery = encodeURIComponent(`${artist} ${title}`);
        console.log(`Searching iTunes for: ${artist} ${title}`);
        const response = await fetch(
            `https://itunes.apple.com/search?term=${searchQuery}&media=music&limit=1`
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`iTunes results found: ${data.resultCount}`);
            if (data.results && data.results.length > 0) {
                const artwork = data.results[0].artworkUrl100;
                if (artwork) {
                    return artwork.replace('100x100bb', '600x600bb');
                }
            }
        } else {
            console.log(`iTunes response not ok: ${response.status}`);
        }
    } catch (e) {
        console.error('Error fetching album art:', e);
    }
    return null;
}

function parseShoutcastCurrentsong(text, defaultArtist = 'Unknown Station') {
    try {
        if (text && typeof text === 'string') {
            const parts = text.trim().split(' - ');
            if (parts.length >= 2) {
                return {
                    title: parts.slice(1).join(' - ').trim(),
                    artist: parts[0].trim(),
                    album: 'Top 40',
                    source: 'shoutcast'
                };
            } else {
                return {
                    title: text.trim(),
                    artist: defaultArtist,
                    album: 'Top 40',
                    source: 'shoutcast'
                };
            }
        }
    } catch (e) {
        console.error('Error parsing Shoutcast currentsong:', e);
    }
    return null;
}

async function runTest() {
    const url = 'https://s1.cloudmu.id/listen/female_radio/currentsong?sid=1';
    console.log(`Fetching from ${url}...`);
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const text = await res.text();
        console.log(`Raw text: "${text}"`);

        const metadata = parseShoutcastCurrentsong(text, 'Female Radio');
        console.log('Parsed Metadata:', metadata);

        if (metadata && metadata.artist && metadata.title) {
            const artwork = await fetchAlbumArt(metadata.artist, metadata.title);
            console.log('Artwork URL:', artwork);
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

runTest();
