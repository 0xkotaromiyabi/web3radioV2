require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const stationsRoutes = require('./routes/stations');
const uploadRoutes = require('./routes/upload');

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
app.use('/api/upload', uploadRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Web3Radio API server running on port ${PORT}`);
});

