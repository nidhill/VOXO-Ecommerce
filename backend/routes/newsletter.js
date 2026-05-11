const express = require('express');
const router = express.Router();
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendNewsletterSubscriptionEmail } = require('../services/emailService');

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Valid email required' });
        }
        const existing = await NewsletterSubscriber.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Already subscribed' });
        await NewsletterSubscriber.create({ email });

        // Send welcome email (non-blocking)
        sendNewsletterSubscriptionEmail(email.trim()).catch(err => 
            console.error('Newsletter email failed:', err.message)
        );

        res.json({ message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
