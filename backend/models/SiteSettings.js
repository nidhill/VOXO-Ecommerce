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
    announcementBar: {
        text: { type: String, default: 'FREE SHIPPING ALL OVER INDIA ON ORDERS OVER ₹3000' },
        enabled: { type: Boolean, default: true },
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
