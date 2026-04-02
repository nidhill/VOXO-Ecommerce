const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    items: [{
        productId: String,
        name: String,
        quantity: Number,
        price: Number,
        originalPrice: Number,
        discount: Number,
        image: String,
        productUrl: String
    }],
    totalAmount: { type: Number, required: true },
    couponCode: String,
    discount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Incomplete', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Incomplete'
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
