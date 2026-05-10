const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminAuth');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');

// ── Categories ─────────────────────────────────────────────────────────────────

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create category
router.post('/', adminAuth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ message: 'Category name is required' });
        const existing = await Category.findOne({ name: name.trim() });
        if (existing) return res.status(409).json({ message: 'Category already exists' });
        const category = await Category.create({ name: name.trim() });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT edit category
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ message: 'Category name is required' });
        
        const existing = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
        if (existing) return res.status(409).json({ message: 'Category already exists' });
        
        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            { name: name.trim() },
            { new: true }
        );
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE category
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── Database Stats ─────────────────────────────────────────────────────────────

router.get('/db-stats', adminAuth, async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const adminDb = db.admin();
        const serverStatus = await adminDb.serverStatus();

        const [
            productCount,
            orderCount,
            userCount,
            categoryCount,
        ] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments(),
            Category.countDocuments(),
        ]);

        // Collection stats
        const collections = await db.listCollections().toArray();
        const collectionStats = await Promise.all(
            collections.map(async (col) => {
                try {
                    const stats = await db.command({ collStats: col.name });
                    return {
                        name: col.name,
                        count: stats.count || 0,
                        size: stats.size || 0,
                        avgObjSize: stats.avgObjSize || 0,
                        storageSize: stats.storageSize || 0,
                    };
                } catch {
                    return { name: col.name, count: 0, size: 0, avgObjSize: 0, storageSize: 0 };
                }
            })
        );

        res.json({
            connection: {
                status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
                host: mongoose.connection.host,
                dbName: mongoose.connection.name,
            },
            counts: {
                products: productCount,
                orders: orderCount,
                users: userCount,
                categories: categoryCount,
            },
            collections: collectionStats,
            uptime: serverStatus.uptime,
        });
    } catch (err) {
        // Fallback if serverStatus fails (e.g. Atlas free tier)
        try {
            const [productCount, orderCount, userCount, categoryCount] = await Promise.all([
                Product.countDocuments(),
                Order.countDocuments(),
                User.countDocuments(),
                Category.countDocuments(),
            ]);
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();
            const collectionStats = await Promise.all(
                collections.map(async (col) => {
                    try {
                        const stats = await db.command({ collStats: col.name });
                        return { name: col.name, count: stats.count || 0, size: stats.size || 0, storageSize: stats.storageSize || 0 };
                    } catch {
                        return { name: col.name, count: 0, size: 0, storageSize: 0 };
                    }
                })
            );
            res.json({
                connection: {
                    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
                    host: mongoose.connection.host,
                    dbName: mongoose.connection.name,
                },
                counts: { products: productCount, orders: orderCount, users: userCount, categories: categoryCount },
                collections: collectionStats,
                uptime: null,
            });
        } catch (fallbackErr) {
            res.status(500).json({ message: fallbackErr.message });
        }
    }
});

module.exports = router;
