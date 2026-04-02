const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    homepageBanners: {
        men: { type: String, default: '/images/banners/men-featured.png' },
        women: { type: String, default: '/images/banners/women-featured.png' },
    },
    heroImages: [{
        type: String,
    }],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
