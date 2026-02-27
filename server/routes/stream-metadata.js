const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Station metadata sources configuration with static fallback info
const STATION_METADATA = {
    'web3': {
        type: 'xspf',
        metadataUrl: 'https://shoutcast.webthreeradio.xyz/radio.xspf',
        name: 'Web3 Radio',
        defaultArtist: 'Web3 Radio',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Web3 Radio Network',
        defaultArtwork: 'https://i.imgur.com/RbUjvJM.png',
        genre: 'community'
    },
    'ozradio': {
        type: 'icecast',
        metadataUrl: 'https://streaming.ozradiojakarta.com:8443/status-json.xsl',
        mount: '/ozjakarta',
        name: 'Oz Radio Jakarta',
        defaultArtist: 'Oz Radio Jakarta',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Top 40 Hits',
        defaultArtwork: 'https://upload.wikimedia.org/wikipedia/id/1/13/OZ_Radio_logo.png',
        genre: 'Top 40 / Pop'
    },
    'iradio': {
        type: 'radiojar',
        metadataUrl: 'https://api.radiojar.com/api/stations/4ywdgup3bnzuv/now_playing/',
        name: 'i-Radio',
        defaultArtist: 'i-Radio Indonesia',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Top 40 Hits',
        defaultArtwork: 'https://pbs.twimg.com/profile_images/1478253252506554368/KY8bV8Xq_400x400.jpg',
        genre: 'Pop / CHR'
    },
    'female': {
        type: 'shoutcast',
        metadataUrl: 'https://s1.cloudmu.id/listen/female_radio/currentsong?sid=1',
        name: 'Female Radio',
        defaultArtist: 'Female Radio',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Urban Contemporary',
        defaultArtwork: 'https://pbs.twimg.com/profile_images/910697330/LogoFR_400x400.jpg',
        genre: 'Urban / Pop'
    },
    'delta': {
        type: 'shoutcast',
        metadataUrl: 'https://s1.cloudmu.id/listen/delta_fm/currentsong?sid=1',
        name: 'Delta FM',
        defaultArtist: 'Delta FM',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Easy Listening',
        defaultArtwork: 'https://pbs.twimg.com/profile_images/1397855976538632195/cNdKclCQ_400x400.jpg',
        genre: 'Adult Contemporary'
    },
    'prambors': {
        type: 'shoutcast',
        metadataUrl: 'https://s2.cloudmu.id/listen/prambors/currentsong?sid=1',
        name: 'Prambors FM',
        defaultArtist: 'Prambors FM',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Top 40 Indonesia',
        defaultArtwork: 'https://pbs.twimg.com/profile_images/1587680139067346944/gqtFkz6a_400x400.jpg',
        genre: 'Top 40 / Pop'
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

// Parse XSPF metadata
function parseXspfMetadata(data) {
    try {
        if (data && typeof data === 'string') {
            const trackBlockMatch = data.match(/<track>([\s\S]*?)<\/track>/i);

            if (trackBlockMatch && trackBlockMatch[1]) {
                const trackContent = trackBlockMatch[1];
                const trackCreatorMatch = trackContent.match(/<creator>(.*?)<\/creator>/i);
                const trackTitleMatch = trackContent.match(/<title>(.*?)<\/title>/i);

                return {
                    title: trackTitleMatch ? trackTitleMatch[1] : 'Live Broadcast',
                    artist: trackCreatorMatch ? trackCreatorMatch[1] : 'Web3 Radio',
                    album: 'Web3 Radio',
                    source: 'xspf'
                };
            }
        }
    } catch (e) {
        console.error('Error parsing XSPF metadata:', e);
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

    // Disable caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    // Helper function to return default/static metadata
    const getDefaultMetadata = () => ({
        title: stationConfig.defaultTitle || 'Live Broadcast',
        artist: stationConfig.defaultArtist || stationConfig.name || stationId,
        album: stationConfig.defaultAlbum || 'Live Stream',
        artwork: stationConfig.defaultArtwork || null,
        genre: stationConfig.genre || 'Radio',
        source: 'static'
    });

    // For static stations (no live metadata), return default immediately
    if (stationConfig.type === 'static' || !stationConfig.metadataUrl) {
        return res.json({
            station: stationId,
            stationName: stationConfig.name,
            nowPlaying: getDefaultMetadata(),
            timestamp: new Date().toISOString()
        });
    }

    try {
        console.log(`Fetching metadata for station: ${stationId}`);

        // Add cache-busting timestamp
        const separator = stationConfig.metadataUrl.includes('?') ? '&' : '?';
        const urlWithTimestamp = `${stationConfig.metadataUrl}${separator}_t=${Date.now()}`;

        const response = await fetch(urlWithTimestamp, {
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Web3Radio/1.0',
                'Cache-Control': 'no-cache'
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
            case 'xspf':
                metadata = parseXspfMetadata(data.raw || JSON.stringify(data));
                break;
            default:
                metadata = { raw: data };
        }

        if (metadata) {
            // Use default artwork if none found from live metadata
            if (!metadata.artwork) {
                // Try to fetch album art from iTunes
                if (metadata.artist && metadata.title) {
                    const artwork = await fetchAlbumArt(metadata.artist, metadata.title);
                    metadata.artwork = artwork || stationConfig.defaultArtwork;
                } else {
                    metadata.artwork = stationConfig.defaultArtwork;
                }
            }

            res.json({
                station: stationId,
                stationName: stationConfig.name,
                nowPlaying: metadata,
                timestamp: new Date().toISOString()
            });
        } else {
            // Fallback to static default metadata
            res.json({
                station: stationId,
                stationName: stationConfig.name,
                nowPlaying: getDefaultMetadata(),
                timestamp: new Date().toISOString()
            });
        }

    } catch (error) {
        console.error(`Error fetching metadata for ${stationId}:`, error.message);
        // Return default static metadata on error instead of 500
        res.json({
            station: stationId,
            stationName: stationConfig.name,
            nowPlaying: getDefaultMetadata(),
            timestamp: new Date().toISOString(),
            fallback: true
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
