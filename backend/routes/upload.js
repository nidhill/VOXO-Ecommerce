const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

let r2Dependencies;
function getR2Dependencies() {
    if (!r2Dependencies) {
        const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
        const r2 = require('../config/r2');
        r2Dependencies = { PutObjectCommand, GetObjectCommand, r2 };
    }

    return r2Dependencies;
}

// use memory storage to keep file in buffer
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// POST /api/upload - Upload image to R2
router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).json({ msg: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ msg: 'No file selected!' });
            } else {
                try {
                    const { PutObjectCommand, r2 } = getR2Dependencies();
                    const fileName = 'products/' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.file.originalname);

                    const command = new PutObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME,
                        Key: fileName,
                        Body: req.file.buffer,
                        ContentType: req.file.mimetype,
                    });

                    await r2.send(command);

                    // Accept either R2_PUBLIC_URL or RX_PUBLIC_URL (legacy typo) from env
                    const publicDomain = process.env.R2_PUBLIC_URL || process.env.RX_PUBLIC_URL;
                    let fileUrl;

                    if (publicDomain && !publicDomain.includes('xxxxx')) {
                        // Use R2 public URL if properly configured
                        const baseUrl = publicDomain.endsWith('/') ? publicDomain.slice(0, -1) : publicDomain;
                        fileUrl = `${baseUrl}/${fileName}`;
                    } else {
                        // Fallback: serve through backend proxy with absolute URL
                        const backendBase = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
                        fileUrl = `${backendBase}/api/upload/file/${fileName}`;
                    }

                    res.json({
                        msg: 'File Uploaded to R2!',
                        url: fileUrl
                    });
                } catch (error) {
                    console.error("R2 Upload Error:", error);
                    res.status(500).json({ msg: 'Error uploading to storage', error: error.message });
                }
            }
        }
    });
});

// GET /api/upload/file/:folder/:filename - Serve image from R2 via proxy
router.get('/file/:folder/:filename', async (req, res) => {
    try {
        const { GetObjectCommand, r2 } = getR2Dependencies();
        const key = `${req.params.folder}/${req.params.filename}`;
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        });

        const response = await r2.send(command);

        // Set content type
        res.set('Content-Type', response.ContentType || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

        // Stream the response body
        response.Body.pipe(res);
    } catch (error) {
        console.error('R2 fetch error:', error.message);
        res.status(404).json({ msg: 'Image not found' });
    }
});

module.exports = router;
