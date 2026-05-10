const express = require('express');
const router = express.Router();
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Valid email required' });
        }
        const existing = await NewsletterSubscriber.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Already subscribed' });
        await NewsletterSubscriber.create({ email });
        res.json({ message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
