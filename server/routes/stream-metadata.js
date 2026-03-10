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
        metadataUrl: 'http://streaming.ozradio.id:8443/status-json.xsl',
        mount: '/ozbandung',
        streamUrl: 'https://streaming.ozradio.id:8443/ozbandung',
        name: 'Oz Radio Bandung',
        defaultArtist: 'Oz Radio Bandung',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Pop Hits',
        defaultArtwork: 'https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/8f0d3c7d79eee4cbc80351517c75d938.png',
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
        type: 'icy',
        streamUrl: 'https://stream.rcs.revma.com/9thenqqd2ncwv',
        name: 'Female Radio',
        defaultArtist: 'Female Radio',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Urban Contemporary',
        defaultArtwork: 'https://femalecircle.id/img/coverArt.png',
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
        type: 'icy',
        streamUrl: 'https://stream.rcs.revma.com/h77wwp48kxcwv',
        name: 'Prambors FM',
        defaultArtist: 'Prambors FM',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Top 40 Indonesia',
        defaultArtwork: 'https://pbs.twimg.com/profile_images/1587680139067346944/gqtFkz6a_400x400.jpg',
        genre: 'Top 40 / Pop'
    },
    'ebsfm': {
        type: 'icecast',
        metadataUrl: 'https://b.alhastream.com:5108/status-json.xsl',
        mount: '/radio',
        name: 'EBS FM',
        defaultArtist: 'EBS FM',
        defaultTitle: 'Live Broadcast',
        defaultAlbum: 'Pop Music',
        defaultArtwork: 'https://www.ebsfmunhas.com/wp-content/uploads/2018/04/1.-EBS-LOGO-MUBES-PNG-WEB-300x255.png',
        genre: 'Pop'
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

// Fetch ICY / in-stream metadata (works with Icecast, Shoutcast, Revma, etc.)
async function fetchIcyMetadata(streamUrl) {
    return new Promise((resolve) => {
        try {
            const http = streamUrl.startsWith('https') ? require('https') : require('http');
            const urlObj = new URL(streamUrl);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (streamUrl.startsWith('https') ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'Icy-MetaData': '1',
                    'User-Agent': 'Web3Radio/1.0',
                    'Connection': 'close'
                },
                timeout: 8000
            };

            const req = http.request(options, (res) => {
                const metaInterval = parseInt(res.headers['icy-metaint'] || '0', 10);
                if (!metaInterval) {
                    req.destroy();
                    return resolve(null);
                }

                let bytesRead = 0;
                let metaFound = false;
                const chunks = [];

                res.on('data', (chunk) => {
                    chunks.push(chunk);
                    bytesRead += chunk.length;

                    if (!metaFound && bytesRead >= metaInterval) {
                        try {
                            const buffer = Buffer.concat(chunks);
                            // After metaInterval audio bytes comes 1 byte length indicator
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
                        } catch (e) {
                            // ignore parse errors, keep reading
                        }
                    }

                    // Safety: don't read more than 256KB
                    if (bytesRead > 256 * 1024) {
                        req.destroy();
                        resolve(null);
                    }
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

// Fetch album art from iTunes Search API
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

    // For ICY stations (Revma etc.) – use streamUrl, not metadataUrl
    if (stationConfig.type === 'icy') {
        if (!stationConfig.streamUrl) {
            return res.json({ station: stationId, stationName: stationConfig.name, nowPlaying: getDefaultMetadata(), timestamp: new Date().toISOString() });
        }
        try {
            const icyMeta = await fetchIcyMetadata(stationConfig.streamUrl);
            if (icyMeta && icyMeta.title && icyMeta.title !== 'Unknown Title') {
                const artwork = await fetchAlbumArt(icyMeta.artist, icyMeta.title);
                return res.json({
                    station: stationId,
                    stationName: stationConfig.name,
                    nowPlaying: {
                        title: icyMeta.title,
                        artist: icyMeta.artist,
                        album: stationConfig.defaultAlbum || 'Live Stream',
                        artwork: artwork || stationConfig.defaultArtwork,
                        source: 'icy'
                    },
                    timestamp: new Date().toISOString()
                });
            }
        } catch (e) {
            console.error(`ICY fetch failed for ${stationId}:`, e.message);
        }
        return res.json({ station: stationId, stationName: stationConfig.name, nowPlaying: getDefaultMetadata(), timestamp: new Date().toISOString(), fallback: true });
    }

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
