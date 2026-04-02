const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');

const DEFAULT_BANNERS = {
    men: '/images/banners/men-featured.png',
    women: '/images/banners/women-featured.png',
};

async function getOrCreateSettings() {
    let settings = await SiteSettings.findOne({ key: 'global' });
    if (!settings) {
        settings = await SiteSettings.create({ key: 'global', homepageBanners: DEFAULT_BANNERS });
    }
    return settings;
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
        const { men, women } = req.body;
        const settings = await getOrCreateSettings();

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
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
