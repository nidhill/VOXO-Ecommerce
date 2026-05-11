const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SiteSettings = require('../models/SiteSettings');
const { adminAuth } = require('../middleware/adminAuth');

const DEFAULT_BANNERS = {
    men: '',
    women: '',
    lookbook: '',
};

const DEFAULT_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&h=1200&q=85',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&h=1200&q=85',
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&h=1200&q=85',
    'https://images.unsplash.com/photo-1550998358-08b4f83dc345?auto=format&fit=crop&w=1200&h=1200&q=85',
];

async function getOrCreateSettings() {
    if (mongoose.connection.readyState !== 1) {
        return {
            homepageBanners: DEFAULT_BANNERS,
            heroImages: DEFAULT_HERO_IMAGES,
            updatedAt: null,
        };
    }

    try {
        let settings = await SiteSettings.findOne({ key: 'global' }).maxTimeMS(5000);
        if (!settings) {
            settings = await SiteSettings.create({
                key: 'global',
                homepageBanners: DEFAULT_BANNERS,
                heroImages: DEFAULT_HERO_IMAGES,
                storeAutomation: { autoHideDays: 60 },
            });
        }
        return settings;
    } catch (error) {
        console.error("DB Settings fetch failed:", error.message);
        return {
            homepageBanners: DEFAULT_BANNERS,
            heroImages: DEFAULT_HERO_IMAGES,
            updatedAt: null,
        };
    }
}

router.get('/homepage-banners', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.json({
            men: settings.homepageBanners?.men || DEFAULT_BANNERS.men,
            women: settings.homepageBanners?.women || DEFAULT_BANNERS.women,
            lookbook: settings.homepageBanners?.lookbook || DEFAULT_BANNERS.lookbook,
            updatedAt: settings.updatedAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/homepage-banners', adminAuth, async (req, res) => {
    try {
        if (require('mongoose').connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected. Please try again shortly.' });
        }

        const { men, women, lookbook } = req.body;
        const settings = await getOrCreateSettings();

        if (typeof settings.save !== 'function') {
            return res.status(503).json({ message: 'Database unavailable. Please try again.' });
        }

        settings.homepageBanners = {
            men: typeof men === 'string' && men.trim() ? men.trim() : (settings.homepageBanners?.men || DEFAULT_BANNERS.men),
            women: typeof women === 'string' && women.trim() ? women.trim() : (settings.homepageBanners?.women || DEFAULT_BANNERS.women),
            lookbook: typeof lookbook === 'string' && lookbook.trim() ? lookbook.trim() : (settings.homepageBanners?.lookbook || DEFAULT_BANNERS.lookbook),
        };
        settings.updatedAt = new Date();

        await settings.save();

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.json({
            men: settings.homepageBanners.men,
            women: settings.homepageBanners.women,
            lookbook: settings.homepageBanners.lookbook,
            updatedAt: settings.updatedAt,
        });
    } catch (err) {
        console.error('PUT homepage-banners error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.get('/hero-images', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        const images = Array.isArray(settings.heroImages) ? settings.heroImages : [];

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.json({
            images,
            updatedAt: settings.updatedAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/hero-images', adminAuth, async (req, res) => {
    try {
        if (require('mongoose').connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected. Please try again shortly.' });
        }

        const { images } = req.body;
        const settings = await getOrCreateSettings();

        if (typeof settings.save !== 'function') {
            return res.status(503).json({ message: 'Database unavailable. Please try again.' });
        }

        const sanitized = Array.isArray(images)
            ? images.filter((url) => typeof url === 'string' && url.trim()).map((url) => url.trim())
            : [];

        settings.heroImages = sanitized;
        settings.updatedAt = new Date();
        await settings.save();

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.json({
            images: settings.heroImages,
            updatedAt: settings.updatedAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/announcement-bar', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.set('Cache-Control', 'no-store');
        res.json({
            text: settings.announcementBar?.text || 'FREE SHIPPING ALL OVER INDIA ON ORDERS OVER ₹3000',
            enabled: settings.announcementBar?.enabled !== false,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/announcement-bar', adminAuth, async (req, res) => {
    try {
        if (require('mongoose').connection.readyState !== 1)
            return res.status(503).json({ message: 'Database not connected.' });
        const { text, enabled } = req.body;
        const settings = await getOrCreateSettings();
        if (typeof settings.save !== 'function')
            return res.status(503).json({ message: 'Database unavailable.' });
        settings.announcementBar = {
            text: typeof text === 'string' && text.trim() ? text.trim() : (settings.announcementBar?.text || ''),
            enabled: enabled !== false,
        };
        settings.updatedAt = new Date();
        await settings.save();
        res.set('Cache-Control', 'no-store');
        res.json({ text: settings.announcementBar.text, enabled: settings.announcementBar.enabled });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/store-automation', async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        res.json(settings.storeAutomation || { autoHideDays: 60 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/store-automation', adminAuth, async (req, res) => {
    try {
        const { autoHideDays } = req.body;
        const settings = await getOrCreateSettings();
        settings.storeAutomation = { autoHideDays: Number(autoHideDays) || 0 };
        await settings.save();
        res.json(settings.storeAutomation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
