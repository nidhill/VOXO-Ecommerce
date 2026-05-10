const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let r2Dependencies;
function getR2Dependencies() {
    if (!r2Dependencies) {
        const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
        const r2 = require('../config/r2');
        r2Dependencies = { ListObjectsV2Command, r2 };
    }

    return r2Dependencies;
}

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
            const collections = await db.listCollections().toArray();
            const collectionDetails = [];

            result.mongodb.connected = true;
            result.mongodb.dbName = db.databaseName;

            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                let colStats = {};

                try {
                    colStats = await db.command({ collStats: col.name });
                } catch (err) {
                    colStats = {};
                }

                collectionDetails.push({
                    name: col.name,
                    documents: count,
                    size: colStats.size || 0,
                    storageSize: colStats.storageSize || 0,
                    indexes: colStats.nindexes || 0
                });
            }

            result.mongodb.collections = collections.length;
            result.mongodb.documents = collectionDetails.reduce((sum, c) => sum + c.documents, 0);
            result.mongodb.collectionDetails = collectionDetails;

            try {
                const stats = await db.stats();
                result.mongodb.dataSize = stats.dataSize || 0;
                result.mongodb.storageSize = stats.storageSize || 0;
                result.mongodb.indexes = stats.indexes || 0;
            } catch (err) {
                result.mongodb.warning = 'Connected, but database stats are unavailable for this MongoDB user.';
            }
        }
    } catch (err) {
        console.error('MongoDB stats error:', err.message);
        result.mongodb.error = err.message;
    }

    // --- Cloudflare R2 Stats ---
    try {
        const bucketName = process.env.R2_BUCKET_NAME;
        if (bucketName) {
            const { ListObjectsV2Command, r2 } = getR2Dependencies();
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
