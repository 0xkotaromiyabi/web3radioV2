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
        metadataUrl: 'https://api.zeno.fm/mounts/metadata/subscribe/3wiuocujuobtv',
    },
    'iradio': {
        type: 'radiojar',
        metadataUrl: 'https://api.radiojar.com/api/stations/4ywdgup3bnzuv/now_playing/',
    },
    'female': {
        type: 'shoutcast',
        metadataUrl: 'https://s1.cloudmu.id/listen/female_radio/currentsong?sid=1',
    },
    'delta': {
        type: 'shoutcast',
        metadataUrl: 'https://s1.cloudmu.id/listen/delta_fm/currentsong?sid=1',
    },
    'prambors': {
        type: 'shoutcast',
        metadataUrl: 'https://s2.cloudmu.id/listen/prambors/currentsong?sid=1',
    }
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
function parseShoutcastCurrentsong(text: string): Metadata | null {
    try {
        if (text && typeof text === 'string') {
            const parts = text.trim().split(' - ');
            if (parts.length >= 2) {
                return {
                    title: parts.slice(1).join(' - '),
                    artist: parts[0],
                    album: 'Top 40',
                    source: 'shoutcast'
                };
            } else {
                return {
                    title: text.trim(),
                    artist: 'Live Radio',
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
async function fetchAlbumArt(artist: string, title: string): Promise<string | null> {
    try {
        const searchQuery = encodeURIComponent(`${artist} ${title}`);
        const response = await fetch(
            `https://itunes.apple.com/search?term=${searchQuery}&media=music&limit=1`
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
    } catch (e) {
        console.error('Error fetching album art:', e);
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
        console.log(`Fetching metadata for station: ${stationId}`);

        const response = await fetch(stationConfig.metadataUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Web3Radio/1.0'
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
                metadata = parseShoutcastCurrentsong(data.raw || JSON.stringify(data));
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
                    artist: stationId,
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
