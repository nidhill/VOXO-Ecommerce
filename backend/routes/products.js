const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json([]);
        }

        const { category, gender, search } = req.query;
        let query = { isHidden: false };

        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (gender) {
            query.gender = (gender === 'Men' || gender === 'Women')
                ? { $in: [gender, 'Unisex'] }
                : gender;
        }

        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: 'i' };
        }

        const products = await Product.find(query).sort({ createdAt: -1 }).maxTimeMS(5000);
        res.json(products);
    } catch (err) {
        console.error("Products fetch failed:", err.message);
        res.json([]);
    }
});

// @route   GET api/products/search
// @desc    Search products by name
// @access  Public
router.get('/search', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json([]);
        }

        const { q } = req.query;
        if (!q) return res.json([]);

        const products = await Product.find({
            name: { $regex: q, $options: 'i' },
            isHidden: false
        })
            .select('name image price _id slug')
            .limit(5);

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/products
// @desc    Add new product
// @access  Admin (Public for now)
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/products/:id
// @desc    Update product
// @access  Admin
router.put('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete product
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/products/bulk-delete
// @desc    Bulk delete products
// @access  Admin
router.post('/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        await Product.deleteMany({ _id: { $in: ids } });
        res.json({ msg: 'Products removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
