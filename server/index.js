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

// --- WebSocket & Audio Relay for Shoutcast ---
const WebSocket = require('ws');
const { spawn } = require('child_process');

const server = app.listen(PORT, () => {
    console.log(`Web3Radio API server running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('🎙️ Client connected to Audio Relay');

    let ffmpegProcess = null;
    let isStreaming = false;

    ws.on('message', (message) => {
        try {
            // Check if binary (audio data) or JSON (config)
            if (Buffer.isBuffer(message)) {
                if (ffmpegProcess && ffmpegProcess.stdin && ffmpegProcess.stdin.writable) {
                    ffmpegProcess.stdin.write(message);
                }
            } else {
                const data = JSON.parse(message.toString());

                if (data.type === 'connect') {
                    const config = data.config || {};
                    const protocol = config.protocol || 'shoutcast1';
                    const host = config.host || 'localhost';
                    const port = config.port || 8000;
                    const password = config.password || 'Web3RadioXYZ';
                    const mountpoint = config.mountpoint || '/stream';
                    const user = config.user || 'admin';

                    console.log(`📡 Starting broadcast to ${host}:${port}${mountpoint} (${protocol})`);
                    console.log(`   User: ${user}, Password: ${password ? '****' : 'none'}`);

                    // Kill existing process if any
                    if (ffmpegProcess) {
                        ffmpegProcess.kill();
                        ffmpegProcess = null;
                    }

                    // Build FFmpeg command for Shoutcast
                    // Shoutcast v1 uses legacy source protocol on source port (usually 8001 or main port)
                    // Format: icy://source:password@host:port/mountpoint

                    let outputUrl;
                    if (protocol === 'shoutcast1') {
                        // Shoutcast v1 legacy protocol
                        outputUrl = `icy://${user}:${password}@${host}:${port}${mountpoint}`;
                    } else {
                        // Icecast or Shoutcast v2
                        outputUrl = `icecast://${user}:${password}@${host}:${port}${mountpoint}`;
                    }

                    // Spawn FFmpeg: PCM Float32 stereo -> MP3 -> Shoutcast
                    const ffmpegArgs = [
                        '-f', 'f32le',          // Input format: 32-bit float little-endian
                        '-ar', '44100',         // Sample rate: 44.1kHz
                        '-ac', '2',             // Channels: stereo
                        '-i', 'pipe:0',         // Input from stdin
                        '-acodec', 'libmp3lame',
                        '-ab', '128k',          // Bitrate: 128kbps
                        '-ar', '44100',
                        '-f', 'mp3',            // Output format
                        '-content_type', 'audio/mpeg',
                        '-ice_name', 'Web3Radio Live',
                        '-ice_description', 'Live broadcast from Web3Radio Dashboard',
                        '-ice_genre', 'Variety',
                        outputUrl
                    ];

                    console.log(`🔧 FFmpeg command: ffmpeg ${ffmpegArgs.join(' ')}`);

                    ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
                    isStreaming = true;

                    ffmpegProcess.stdout.on('data', (data) => {
                        console.log(`FFmpeg stdout: ${data}`);
                    });

                    ffmpegProcess.stderr.on('data', (data) => {
                        const msg = data.toString();
                        // Only log important messages, not the continuous progress
                        if (msg.includes('Error') || msg.includes('error') || msg.includes('Opening')) {
                            console.log(`FFmpeg: ${msg}`);
                        }
                    });

                    ffmpegProcess.on('close', (code) => {
                        console.log(`FFmpeg process exited with code ${code}`);
                        isStreaming = false;
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'disconnected', code }));
                        }
                    });

                    ffmpegProcess.on('error', (err) => {
                        console.error('FFmpeg spawn error:', err);
                        isStreaming = false;
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        }
                    });

                    // Notify client that connection is established
                    ws.send(JSON.stringify({ type: 'connected', protocol, host, port }));

                } else if (data.type === 'disconnect') {
                    console.log('🛑 Client requested disconnect');
                    if (ffmpegProcess) {
                        ffmpegProcess.stdin.end();
                        ffmpegProcess.kill();
                        ffmpegProcess = null;
                        isStreaming = false;
                    }
                    ws.send(JSON.stringify({ type: 'disconnected' }));
                }
            }
        } catch (e) {
            console.error('Error processing message:', e);
            ws.send(JSON.stringify({ type: 'error', message: e.message }));
        }
    });

    ws.on('close', () => {
        console.log('🔌 Client disconnected');
        if (ffmpegProcess) {
            ffmpegProcess.stdin.end();
            ffmpegProcess.kill();
            ffmpegProcess = null;
        }
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        if (ffmpegProcess) {
            ffmpegProcess.kill();
            ffmpegProcess = null;
        }
    });
});

console.log('🎧 Audio relay WebSocket ready on same port as HTTP');

