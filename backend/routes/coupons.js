const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// @route   GET api/coupons
// @desc    Get all coupons
// @access  Admin
router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ expiryDate: 1 });
        res.json(coupons);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/coupons
// @desc    Create a coupon
// @access  Admin
router.post('/', async (req, res) => {
    try {
        const { code, discountPercentage, expiryDate } = req.body;
        let coupon = await Coupon.findOne({ code });
        if (coupon) {
            return res.status(400).json({ msg: 'Coupon already exists' });
        }

        coupon = new Coupon({
            code,
            discountPercentage,
            expiryDate
        });

        await coupon.save();
        res.json(coupon);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/coupons/validate
// @desc    Validate coupon
// @access  Public
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ msg: 'Coupon not found' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ msg: 'Coupon expired' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ msg: 'Coupon inactive' });
        }

        res.json(coupon);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/coupons/:id
// @desc    Delete coupon
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Coupon removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
