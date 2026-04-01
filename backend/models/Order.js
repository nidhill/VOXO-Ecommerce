const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
<<<<<<< HEAD
=======
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
    items: [{
        productId: String,
        name: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    couponCode: String,
<<<<<<< HEAD
    status: { type: String, default: 'Incomplete' }, // Incomplete (clicked Buy)
    createdAt: { type: Date, default: Date.now }
});
=======
    discount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Incomplete', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Incomplete'
    },
}, { timestamps: true });
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)

module.exports = mongoose.model('Order', OrderSchema);
