const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminAuth');
const User = require('../models/User');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// GET all registered users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({}, '-password -resetPasswordToken -resetPasswordExpire').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET newsletter subscribers
router.get('/subscribers', adminAuth, async (req, res) => {
    try {
        const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE subscriber
router.delete('/subscribers/:id', adminAuth, async (req, res) => {
    try {
        await NewsletterSubscriber.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
