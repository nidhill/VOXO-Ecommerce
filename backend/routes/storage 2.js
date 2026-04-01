const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const r2 = require('../config/r2');

// GET /api/storage - Get MongoDB Atlas + Cloudflare R2 storage stats
router.get('/', async (req, res) => {
    const result = {
        mongodb: { connected: false, dbName: '', dataSize: 0, storageSize: 0, collections: 0, documents: 0, indexes: 0 },
        cloudflare: { connected: false, bucket: '', totalObjects: 0, totalSize: 0, folders: {} }
    };

    // --- MongoDB Atlas Stats ---
    try {
        if (mongoose.connection.readyState === 1) {
            const db = mongoose.connection.db;
            const stats = await db.stats();
            const collections = await db.listCollections().toArray();

            // Get document counts per collection
            const collectionDetails = [];
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                const colStats = await db.command({ collStats: col.name });
                collectionDetails.push({
                    name: col.name,
                    documents: count,
                    size: colStats.size || 0,
                    storageSize: colStats.storageSize || 0,
                    indexes: colStats.nindexes || 0
                });
            }

            result.mongodb = {
                connected: true,
                dbName: db.databaseName,
                dataSize: stats.dataSize || 0,
                storageSize: stats.storageSize || 0,
                collections: collections.length,
                documents: collectionDetails.reduce((sum, c) => sum + c.documents, 0),
                indexes: stats.indexes || 0,
                collectionDetails
            };
        }
    } catch (err) {
        console.error('MongoDB stats error:', err.message);
        result.mongodb.error = err.message;
    }

    // --- Cloudflare R2 Stats ---
    try {
        const bucketName = process.env.R2_BUCKET_NAME;
        if (bucketName) {
            let totalObjects = 0;
            let totalSize = 0;
            const folders = {};
            let continuationToken = undefined;

            // Paginate through all objects
            do {
                const command = new ListObjectsV2Command({
                    Bucket: bucketName,
                    ContinuationToken: continuationToken,
                });
                const response = await r2.send(command);

                if (response.Contents) {
                    for (const obj of response.Contents) {
                        totalObjects++;
                        totalSize += obj.Size || 0;

                        // Group by folder
                        const folder = obj.Key.includes('/') ? obj.Key.split('/')[0] : 'root';
                        if (!folders[folder]) folders[folder] = { count: 0, size: 0 };
                        folders[folder].count++;
                        folders[folder].size += obj.Size || 0;
                    }
                }

                continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
            } while (continuationToken);

            result.cloudflare = {
                connected: true,
                bucket: bucketName,
                totalObjects,
                totalSize,
                folders
            };
        }
    } catch (err) {
        console.error('R2 stats error:', err.message);
        result.cloudflare.error = err.message;
    }

    res.json(result);
});

module.exports = router;
