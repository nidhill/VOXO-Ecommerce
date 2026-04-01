const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
<<<<<<< HEAD

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
=======
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const r2 = require('../config/r2');

// use memory storage to keep file in buffer
const storage = multer.memoryStorage();
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)

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
<<<<<<< HEAD
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

=======
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

<<<<<<< HEAD
router.post('/', (req, res) => {
    upload(req, res, (err) => {
=======
// POST /api/upload - Upload image to R2
router.post('/', (req, res) => {
    upload(req, res, async (err) => {
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
        if (err) {
            res.status(400).json({ msg: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ msg: 'No file selected!' });
            } else {
<<<<<<< HEAD
                // Construct the full URL
                const protocol = req.protocol;
                const host = req.get('host');
                const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

                res.json({
                    msg: 'File Uploaded!',
                    url: fileUrl
                });
=======
                try {
                    const fileName = 'products/' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.file.originalname);

                    const command = new PutObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME,
                        Key: fileName,
                        Body: req.file.buffer,
                        ContentType: req.file.mimetype,
                    });

                    await r2.send(command);

                    // Check if we have a valid public URL configured
                    const publicDomain = process.env.R2_PUBLIC_URL;
                    let fileUrl;

                    if (publicDomain && !publicDomain.includes('xxxxx')) {
                        // Use R2 public URL if properly configured
                        const baseUrl = publicDomain.endsWith('/') ? publicDomain.slice(0, -1) : publicDomain;
                        fileUrl = `${baseUrl}/${fileName}`;
                    } else {
                        // Fallback: serve through our own backend proxy
                        fileUrl = `/api/upload/file/${fileName}`;
                    }

                    res.json({
                        msg: 'File Uploaded to R2!',
                        url: fileUrl
                    });
                } catch (error) {
                    console.error("R2 Upload Error:", error);
                    res.status(500).json({ msg: 'Error uploading to storage', error: error.message });
                }
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
            }
        }
    });
});

<<<<<<< HEAD
=======
// GET /api/upload/file/:folder/:filename - Serve image from R2 via proxy
router.get('/file/:folder/:filename', async (req, res) => {
    try {
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

>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
module.exports = router;
