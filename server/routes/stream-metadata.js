const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Station metadata sources configuration
const STATION_METADATA = {
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

// Parse Icecast JSON response
function parseIcecastMetadata(data, mount) {
    try {
        const icestats = data.icestats;
        if (!icestats || !icestats.source) return null;

        let source = icestats.source;
        if (Array.isArray(source)) {
            source = source.find(s => s.listenurl?.includes(mount)) || source[0];
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
function parseZenoMetadata(data) {
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
function parseRadioJarMetadata(data) {
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
function parseShoutcastCurrentsong(text) {
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
                    artist: 'Prambors FM',
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
async function fetchAlbumArt(artist, title) {
    try {
        const searchQuery = encodeURIComponent(`${artist} ${title}`);
        const response = await fetch(
            `https://itunes.apple.com/search?term=${searchQuery}&media=music&limit=1`,
            { timeout: 3000 }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                // Get high resolution artwork (replace 100x100 with 600x600)
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

// GET /api/stream-metadata/:station
router.get('/:station', async (req, res) => {
    const stationId = req.params.station;
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
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Web3Radio/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let data;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            // Try to parse as JSON anyway
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch {
                data = { raw: text };
            }
        }

        let metadata = null;

        switch (stationConfig.type) {
            case 'icecast':
                metadata = parseIcecastMetadata(data, stationConfig.mount);
                break;
            case 'zeno':
                metadata = parseZenoMetadata(data);
                break;
            case 'radiojar':
                metadata = parseRadioJarMetadata(data);
                break;
            case 'cloudmu':
                // CloudMu uses similar format to Icecast
                metadata = parseIcecastMetadata(data, '/');
                break;
            case 'shoutcast':
                // Shoutcast currentsong returns plain text
                metadata = parseShoutcastCurrentsong(data.raw || JSON.stringify(data));
                break;
            default:
                metadata = { raw: data };
        }

        if (metadata) {
            // Try to fetch album art if not already present
            if (!metadata.artwork && metadata.artist && metadata.title) {
                const artwork = await fetchAlbumArt(metadata.artist, metadata.title);
                if (artwork) {
                    metadata.artwork = artwork;
                }
            }

            res.json({
                station: stationId,
                nowPlaying: metadata,
                timestamp: new Date().toISOString()
            });
        } else {
            res.json({
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

    } catch (error) {
        console.error(`Error fetching metadata for ${stationId}:`, error);
        res.status(500).json({
            error: error.message,
            station: stationId
        });
    }
});

// GET /api/stream-metadata - List all stations
router.get('/', (req, res) => {
    res.json({
        stations: Object.keys(STATION_METADATA),
        description: 'Fetch now playing metadata from radio stations'
    });
});

module.exports = router;
