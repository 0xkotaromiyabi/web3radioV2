import type { VercelRequest, VercelResponse } from '@vercel/node';

// Station metadata sources configuration
const STATION_METADATA: Record<string, { type: string; metadataUrl: string; mount?: string }> = {
    'web3': {
        type: 'icecast',
        metadataUrl: 'https://web3radio.cloud/status-json.xsl',
        mount: '/stream'
    },
    'Venus': {
        type: 'zeno',
        metadataUrl: 'https://stream.zeno.fm/3wiuocujuobtv',
    },
    'iradio': {
        type: 'radiojar',
        metadataUrl: 'https://api.radiojar.com/api/stations/4ywdgup3bnzuv/now_playing/',
    },
    'female': {
        type: 'shoutcast-v2',
        metadataUrl: 'https://s1.cloudmu.id/listen/female_radio/stats?sid=1&json=1',
    },
    'delta': {
        type: 'shoutcast-v2',
        metadataUrl: 'https://s1.cloudmu.id/listen/delta_fm/stats?sid=1&json=1',
    },
    'prambors': {
        type: 'shoutcast-v2',
        metadataUrl: 'https://s2.cloudmu.id/listen/prambors/stats?sid=1&json=1',
    }
};

// Pretty names for fallback
const STATION_NAMES: Record<string, string> = {
    'web3': 'Web3 Radio',
    'Venus': 'Venus FM',
    'iradio': 'i-Radio',
    'female': 'Female Radio',
    'delta': 'Delta FM',
    'prambors': 'Prambors FM'
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
            const title = source.title || source.yp_currently_playing || '';
            const parts = title.split(' - ');
            return {
                title: parts.length > 1 ? parts[1] : title,
                artist: parts.length > 1 ? parts[0] : 'Unknown Artist',
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

// Parse Shoutcast V2 JSON stats
function parseShoutcastV2Metadata(data: any, defaultArtist: string = 'Unknown Station'): Metadata | null {
    try {
        if (data && data.songtitle) {
            const parts = data.songtitle.split(' - ');
            if (parts.length >= 2) {
                return {
                    title: parts.slice(1).join(' - ').trim(),
                    artist: parts[0].trim(),
                    album: 'Top 40',
                    listeners: data.currentlisteners,
                    source: 'shoutcast-v2'
                };
            } else {
                return {
                    title: data.songtitle.trim(),
                    artist: defaultArtist,
                    album: 'Top 40',
                    listeners: data.currentlisteners,
                    source: 'shoutcast-v2'
                };
            }
        }
    } catch (e) {
        console.error('Error parsing Shoutcast V2 metadata:', e);
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

// Fetch album artwork from iTunes Search API
// Fetch album artwork from iTunes Search API
async function fetchAlbumArt(artist: string, title: string): Promise<string | null> {
    try {
        // Clean artist name: remove "[+]" and everything after, and possibly "Feat."
        const cleanArtist = artist.split(/\[\+|feat\.|ft\./i)[0].trim();
        // Also remove generic radio formatting
        const cleanTitle = title.replace(/\(.*?\)/g, '').trim();

        const searchQuery = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    try {
        // console.log(`Fetching metadata for station: ${stationId}`);

        const response = await fetch(stationConfig.metadataUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
            case 'shoutcast-v2':
                metadata = parseShoutcastV2Metadata(data, STATION_NAMES[stationId]);
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
            default:
                metadata = { title: 'Live', artist: stationId, album: 'Stream', source: 'unknown' };
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
