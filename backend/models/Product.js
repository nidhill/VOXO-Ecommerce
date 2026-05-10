const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex', 'Kids'],
        default: 'Unisex'
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String, // URLs from Cloudflare R2
        required: true
    }],
    isHidden: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
