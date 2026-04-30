const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SiteSettings = require('../models/SiteSettings');

const DEFAULT_BANNERS = {
    men: '/images/banners/men-featured.png',
    women: '/images/banners/women-featured.png',
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
            updatedAt: settings.updatedAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/homepage-banners', async (req, res) => {
    try {
        if (require('mongoose').connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected. Please try again shortly.' });
        }

        const { men, women } = req.body;
        const settings = await getOrCreateSettings();

        if (typeof settings.save !== 'function') {
            return res.status(503).json({ message: 'Database unavailable. Please try again.' });
        }

        settings.homepageBanners = {
            men: typeof men === 'string' && men.trim() ? men.trim() : (settings.homepageBanners?.men || DEFAULT_BANNERS.men),
            women: typeof women === 'string' && women.trim() ? women.trim() : (settings.homepageBanners?.women || DEFAULT_BANNERS.women),
        };
        settings.updatedAt = new Date();

        await settings.save();

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.json({
            men: settings.homepageBanners.men,
            women: settings.homepageBanners.women,
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
        const images = Array.isArray(settings.heroImages) && settings.heroImages.length > 0
            ? settings.heroImages
            : DEFAULT_HERO_IMAGES;

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.json({
            images,
            updatedAt: settings.updatedAt,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/hero-images', async (req, res) => {
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

        settings.heroImages = sanitized.length > 0 ? sanitized : (settings.heroImages?.length ? settings.heroImages : DEFAULT_HERO_IMAGES);
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

module.exports = router;
