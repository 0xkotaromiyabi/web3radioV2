import type { VercelRequest, VercelResponse } from '@vercel/node';

// Station metadata sources configuration
const STATION_METADATA: Record<string, { type: string; metadataUrl?: string; mount?: string; streamUrl?: string }> = {
    'web3': {
        type: 'icecast',
        metadataUrl: 'https://shoutcast.webthreeradio.xyz/status-json.xsl',
        mount: '/listen'
    },
    'ozradio': {
        type: 'icecast',
        metadataUrl: 'http://streaming.ozradio.id:8443/status-json.xsl',
        mount: '/ozbandung'
    },
    'iradio': {
        type: 'radiojar',
        metadataUrl: 'https://api.radiojar.com/api/stations/4ywdgup3bnzuv/now_playing/',
    },
    'female': {
        type: 'icy',
        streamUrl: 'https://stream.rcs.revma.com/9thenqqd2ncwv',
    },
    'delta': {
        type: 'shoutcast',
        metadataUrl: 'https://s1.cloudmu.id/listen/delta_fm/currentsong?sid=1',
    },
    'prambors': {
        type: 'icy',
        streamUrl: 'https://stream.rcs.revma.com/h77wwp48kxcwv',
    },
    'ebsfm': {
        type: 'icecast',
        metadataUrl: 'https://b.alhastream.com:5108/status-json.xsl',
        mount: '/radio',
    }
};

// Pretty names for fallback
const STATION_NAMES: Record<string, string> = {
    'web3': 'Web3 Radio',
    'ozradio': 'Oz Radio Bandung',
    'iradio': 'i-Radio',
    'female': 'Female Radio',
    'delta': 'Delta FM',
    'prambors': 'Prambors FM',
    'ebsfm': 'EBS FM'
};

// Default artwork per station
const STATION_ARTWORK: Record<string, string> = {
    'web3': 'https://i.imgur.com/RbUjvJM.png',
    'ozradio': 'https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/8f0d3c7d79eee4cbc80351517c75d938.png',
    'iradio': 'https://pbs.twimg.com/profile_images/1478253252506554368/KY8bV8Xq_400x400.jpg',
    'female': 'https://femalecircle.id/img/coverArt.png',
    'delta': 'https://pbs.twimg.com/profile_images/1397855976538632195/cNdKclCQ_400x400.jpg',
    'prambors': 'https://pbs.twimg.com/profile_images/1587680139067346944/gqtFkz6a_400x400.jpg',
    'ebsfm': 'https://www.ebsfmunhas.com/wp-content/uploads/2018/04/1.-EBS-LOGO-MUBES-PNG-WEB-300x255.png'
};

interface Metadata {
    title: string;
    artist: string;
    album: string;
    artwork?: string;
    listeners?: number;
    source: string;
}

// Parse Icecast JSON response
function parseIcecastMetadata(data: any, mount: string): Metadata | null {
    try {
        const icestats = data.icestats;
        if (!icestats || !icestats.source) return null;

        let source = icestats.source;
        if (Array.isArray(source)) {
            source = source.find((s: any) => s.listenurl?.includes(mount)) || source[0];
        }

        if (source) {
            let artist = source.artist;
            let title = source.title;

            if (!artist && !title && source.yp_currently_playing) {
                const parts = source.yp_currently_playing.split(' - ');
                artist = parts.length > 1 ? parts[0] : 'Unknown Artist';
                title = parts.length > 1 ? parts.slice(1).join(' - ') : source.yp_currently_playing;
            } else if (!artist && title && title.includes(' - ')) {
                const parts = title.split(' - ');
                artist = parts[0];
                title = parts.slice(1).join(' - ');
            }

            return {
                title: title || 'Unknown Title',
                artist: artist || 'Unknown Artist',
                album: source.genre || 'Live Stream',
                listeners: source.listeners,
                source: 'icecast'
            };
        }
    } catch (e) {
        console.error('Error parsing Icecast metadata:', e);
    }
    return null;
}

// Parse Zeno FM metadata
function parseZenoMetadata(data: any): Metadata | null {
    try {
        if (data && (data.title || data.artist)) {
            return {
                title: data.title || 'Unknown Title',
                artist: data.artist || 'Unknown Artist',
                album: data.album || 'Live Stream',
                artwork: data.artwork,
                source: 'zeno'
            };
        }
    } catch (e) {
        console.error('Error parsing Zeno metadata:', e);
    }
    return null;
}

// Parse RadioJar metadata
function parseRadioJarMetadata(data: any): Metadata | null {
    try {
        if (data) {
            return {
                title: data.title || data.name || 'Unknown Title',
                artist: data.artist || 'Unknown Artist',
                album: data.album || 'Live Stream',
                artwork: data.image_url || data.artwork,
                source: 'radiojar'
            };
        }
    } catch (e) {
        console.error('Error parsing RadioJar metadata:', e);
    }
    return null;
}

// Parse Shoutcast currentsong (plain text format: "ARTIST - TITLE")
function parseShoutcastCurrentsong(text: string, defaultArtist: string = 'Unknown Station'): Metadata | null {
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

// Fetch ICY in-stream metadata (for Revma and other Icecast-compatible streams)
function fetchIcyMetadata(streamUrl: string): Promise<{ artist: string; title: string; source: string } | null> {
    return new Promise((resolve) => {
        try {
            const http = streamUrl.startsWith('https') ? require('https') : require('http');
            const urlObj = new URL(streamUrl);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (streamUrl.startsWith('https') ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: { 'Icy-MetaData': '1', 'User-Agent': 'Web3Radio/1.0', 'Connection': 'close' },
                timeout: 8000
            };
            const req = http.request(options, (res: any) => {
                const metaInterval = parseInt(res.headers['icy-metaint'] || '0', 10);
                if (!metaInterval) { req.destroy(); return resolve(null); }
                let bytesRead = 0;
                let metaFound = false;
                const chunks: Buffer[] = [];
                res.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                    bytesRead += chunk.length;
                    if (!metaFound && bytesRead >= metaInterval) {
                        try {
                            const buffer = Buffer.concat(chunks);
                            if (buffer.length > metaInterval) {
                                const metaLenByte = buffer[metaInterval];
                                const metaLen = metaLenByte * 16;
                                if (metaLen > 0 && buffer.length >= metaInterval + 1 + metaLen) {
                                    const metaStr = buffer.slice(metaInterval + 1, metaInterval + 1 + metaLen).toString('utf8');
                                    const match = metaStr.match(/StreamTitle='([^']*)'/);
                                    if (match && match[1]) {
                                        metaFound = true;
                                        req.destroy();
                                        const parts = match[1].split(' - ');
                                        const artist = parts.length > 1 ? parts[0].trim() : 'Unknown Artist';
                                        const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : match[1].trim();
                                        return resolve({ artist, title, source: 'icy' });
                                    }
                                }
                            }
                        } catch (_) { }
                    }
                    if (bytesRead > 256 * 1024) { req.destroy(); resolve(null); }
                });
                res.on('end', () => { if (!metaFound) resolve(null); });
                res.on('error', () => resolve(null));
            });
            req.on('error', () => resolve(null));
            req.on('timeout', () => { req.destroy(); resolve(null); });
            req.end();
        } catch (e) {
            resolve(null);
        }
    });
}

// Fetch album artwork from iTunes Search API
async function fetchAlbumArt(artist: string, title: string): Promise<string | null> {
    try {
        const searchQuery = encodeURIComponent(`${artist} ${title}`);

        const response = await fetch(
            `https://itunes.apple.com/search?term=${searchQuery}&media=music&limit=1`,
            {
                // Add simple timeout signal if environment supports it, but standard fetch in Node might vary
            }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const artwork = data.results[0].artworkUrl100;
                if (artwork) {
                    return artwork.replace('100x100bb', '600x600bb');
                }
            }
        }
    } catch (e: any) {
        console.error(`Error fetching album art for ${artist}:`, e.message);
    }
    return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Disable Vercel Edge caching
    res.setHeader('Cache-Control', 's-maxage=0, no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { station } = req.query;
    const stationId = Array.isArray(station) ? station[0] : station;

    if (!stationId) {
        return res.status(400).json({
            error: 'Station ID required',
            availableStations: Object.keys(STATION_METADATA)
        });
    }

    const stationConfig = STATION_METADATA[stationId];

    if (!stationConfig) {
        return res.status(404).json({
            error: 'Unknown station',
            availableStations: Object.keys(STATION_METADATA)
        });
    }

    const defaultArtwork = STATION_ARTWORK[stationId] || null;

    // Handle ICY stations (Revma, etc.)
    if (stationConfig.type === 'icy') {
        if (!stationConfig.streamUrl) {
            return res.status(200).json({ station: stationId, nowPlaying: { title: 'Live Broadcast', artist: STATION_NAMES[stationId] || stationId, album: 'Live Stream', artwork: defaultArtwork, source: 'fallback' }, timestamp: new Date().toISOString() });
        }
        try {
            const icyMeta = await fetchIcyMetadata(stationConfig.streamUrl);
            if (icyMeta && icyMeta.title) {
                const artwork = await fetchAlbumArt(icyMeta.artist, icyMeta.title);
                return res.status(200).json({
                    station: stationId,
                    nowPlaying: { title: icyMeta.title, artist: icyMeta.artist, album: 'Live Stream', artwork: artwork || defaultArtwork, source: 'icy' },
                    timestamp: new Date().toISOString()
                });
            }
        } catch (e: any) {
            console.error(`ICY fetch failed for ${stationId}:`, e.message);
        }
        return res.status(200).json({ station: stationId, nowPlaying: { title: 'Live Broadcast', artist: STATION_NAMES[stationId] || stationId, album: 'Live Stream', artwork: defaultArtwork, source: 'fallback' }, timestamp: new Date().toISOString() });
    }

    if (!stationConfig.metadataUrl) {
        return res.status(200).json({ station: stationId, nowPlaying: { title: 'Live Broadcast', artist: STATION_NAMES[stationId] || stationId, album: 'Live Stream', artwork: defaultArtwork, source: 'fallback' }, timestamp: new Date().toISOString() });
    }

    try {
        console.log(`Fetching metadata for station: ${stationId}`);

        // Add cache-busting timestamp
        const separator = stationConfig.metadataUrl.includes('?') ? '&' : '?';
        const urlWithTimestamp = `${stationConfig.metadataUrl}${separator}_t=${Date.now()}`;

        const response = await fetch(urlWithTimestamp, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Web3Radio/1.0',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let data: any;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch {
                data = { raw: text };
            }
        }

        let metadata: Metadata | null = null;

        switch (stationConfig.type) {
            case 'icecast':
                metadata = parseIcecastMetadata(data, stationConfig.mount || '/');
                break;
            case 'zeno':
                metadata = parseZenoMetadata(data);
                break;
            case 'radiojar':
                metadata = parseRadioJarMetadata(data);
                break;
            case 'shoutcast':
                const defaultName = STATION_NAMES[stationId] || 'Radio Station';
                metadata = parseShoutcastCurrentsong(data.raw || JSON.stringify(data), defaultName);
                break;
            case 'cloudmu':
                // Keeping cloudmu mapping to icecast just in case, though user removed it in their snippet for stations but kept it in switch?
                // Actually user's snippet uses 'shoutcast' type for female/delta.
                // But the switch case 'cloudmu' is present in their snippet.
                metadata = parseIcecastMetadata(data, '/');
                break;
            default:
                metadata = { raw: data } as any; // fallback
        }

        if (metadata) {
            // Fetch album art if not present
            if (!metadata.artwork && metadata.artist && metadata.title) {
                const artwork = await fetchAlbumArt(metadata.artist, metadata.title);
                if (artwork) {
                    metadata.artwork = artwork;
                }
            }

            return res.status(200).json({
                station: stationId,
                nowPlaying: metadata,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(200).json({
                station: stationId,
                nowPlaying: {
                    title: 'Live Broadcast',
                    artist: STATION_NAMES[stationId] || stationId,
                    album: 'Live Stream',
                    source: 'fallback'
                },
                timestamp: new Date().toISOString()
            });
        }

    } catch (error: any) {
        console.error(`Error fetching metadata for ${stationId}:`, error);
        return res.status(500).json({
            error: error.message,
            station: stationId
        });
    }
}
