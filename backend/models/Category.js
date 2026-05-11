const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Both'],
        default: 'Both',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Unique per name+gender combo (same name allowed for Men vs Women)
CategorySchema.index({ name: 1, gender: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
