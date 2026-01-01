const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP allowed.'));
        }
    }
});

// Upload single file
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size
            },
            error: null
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all uploaded files
router.get('/', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir);
        const fileList = files.map(filename => ({
            filename,
            url: `/uploads/${filename}`,
            uploadedAt: fs.statSync(path.join(uploadsDir, filename)).mtime
        }));
        res.json({ data: fileList, error: null });
    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({ data: [], error: error.message });
    }
});

// Delete file
router.delete('/:filename', (req, res) => {
    try {
        const filePath = path.join(uploadsDir, req.params.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ error: null });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
