require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const stationsRoutes = require('./routes/stations');
const rentalRoutes = require('./routes/rentals'); // Added rentalRoutes import
const uploadRoutes = require('./routes/upload');
const streamMetadataRoutes = require('./routes/stream-metadata');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'http://localhost:8084', 'http://localhost:8085', 'http://localhost:8086', 'http://localhost:8087'],
    credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/stations', stationsRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stream-metadata', streamMetadataRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// --- WebSocket & Audio Relay ---
const WebSocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');

const server = app.listen(PORT, () => {
    console.log(`Web3Radio API server running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected to Audio Relay');

    let ffmpegProcess = null;

    ws.on('message', (message) => {
        try {
            // Check if binary (audio data) or JSON (config)
            if (Buffer.isBuffer(message)) {
                if (ffmpegProcess && ffmpegProcess.stdin.writable) {
                    ffmpegProcess.stdin.write(message);
                }
            } else {
                const data = JSON.parse(message);

                if (data.type === 'connect') {
                    const { host, port, password, mountpoint } = data.config;
                    console.log(`Starting broadcast to ${host}:${port}${mountpoint}`);

                    // Spawn FFmpeg to transcode Raw PCM -> MP3 -> Shoutcast
                    ffmpegProcess = ffmpeg()
                        .input('pipe:0')
                        .inputFormat('f32le') // Input from browser is Float32 PCM
                        .inputOptions([
                            '-ac 2',        // Stereo
                            '-ar 44100'     // 44.1kHz
                        ])
                        .audioCodec('libmp3lame')
                        .audioBitrate('128k')
                        .outputFormat('mp3')
                        .output(`icecast://${host}:${port}${mountpoint}`) // Shoutcast v2 supports ICY/Icecast protocol usually
                        .outputOptions([
                            `-ice_name "Web3Radio Live"`,
                            `-ice_description "Live from Dashboard"`,
                            `-ice_genre "Variety"`,
                            `-content_type audio/mpeg`,
                            // Shoutcast auth usually: source:password or admin:password
                            // For standard Shoutcast v1/v2 legacy source: just password
                            // We might need to construct URL carefully: tcp://source:password@host:port
                        ])
                        // For basic Shoutcast Source Protocol (v1), ffmpeg uses:
                        // output: 'tcp://hostname:port'
                        // and option: '-password', 'yourpassword'
                        // Let's try standard legacy protocol first which is most common for simple tools
                        .output(`tcp://${host}:${port}`)
                        .outputOptions([
                            '-content_type', 'audio/mpeg',
                            '-password', password,
                            '-icy_name', 'Web3Radio Live',
                            '-icy_genre', 'Variety'
                        ])

                        .on('start', (cmd) => {
                            console.log('FFmpeg started:', cmd);
                        })
                        .on('error', (err) => {
                            console.error('FFmpeg error:', err.message);
                            ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        })
                        .on('end', () => {
                            console.log('FFmpeg finished');
                        });

                    ffmpegProcess.run();
                }
            }
        } catch (e) {
            console.error('Error processing message:', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        if (ffmpegProcess) {
            ffmpegProcess.kill();
        }
    });
});

