const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../services/emailService');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const order = await newOrder.save();
        // Send order confirmation email (non-blocking)
        if (order.email) sendOrderConfirmation(order).catch(console.error);
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: err.message });
    }
});

// GET /api/orders - Get all orders (admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/orders/count - Get total order count
router.get('/count', async (req, res) => {
    try {
        const count = await Order.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/orders/:id - Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT /api/orders/:id - Update order (admin status change triggers email)
router.put('/:id', async (req, res) => {
    try {
        const prevOrder = await Order.findById(req.params.id);
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Send status update email if status changed
        if (req.body.status && prevOrder?.status !== req.body.status && order.email) {
            sendOrderStatusUpdate(order).catch(console.error);
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json({ msg: 'Order deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
