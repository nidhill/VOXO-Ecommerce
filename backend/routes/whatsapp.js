const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * POST /api/whatsapp/generate-order-message
 * Generate a WhatsApp-friendly order message with clickable product link
 * @param {string} productId - Product ID
 * @returns {json} - WhatsApp message template with product link
 */
router.post('/generate-order-message', async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ msg: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'https://wavway.vercel.app';
        const productLink = `${frontendUrl}/product/${product._id}`;
        
        // Calculate discount percentage
        const discount = product.discount ? Math.round(((product.discount - product.price) / product.discount) * 100) : 0;

        // Build WhatsApp message
        const message = `
*Order Request — WAVWAY* 📦
━━━━━━━━━━━━━━━━━━━━━

*Product:* ${product.name}
*Gender:* ${product.gender || 'Unisex'}
*Category:* ${product.category || 'General'}

*Price:* ₹${product.price} ${product.discount ? `~~₹${product.discount}~~ _(${discount}% off)_` : ''}
*Quantity:* ${quantity}

*Description:* ${product.description || 'Master Piece With Original box (Made in Italy).'}

*Product Link:* ${productLink}
*Image URL:* ${product.image || 'Not available'}

━━━━━━━━━━━━━━━━━━━━━

Hi, I'd like to order this item. Please confirm availability.
        `.trim();

        res.json({
            success: true,
            message: message,
            productLink: productLink,
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                link: productLink
            }
        });
    } catch (error) {
        console.error('Error generating WhatsApp message:', error);
        res.status(500).json({ msg: 'Error generating message', error: error.message });
    }
});

/**
 * GET /api/whatsapp/product/:productId
 * Get product details for WhatsApp order sharing
 */
router.get('/product/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'https://wavway.vercel.app';
        const productLink = `${frontendUrl}/product/${product._id}`;
        const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
            `Check out this product on WAVWAY: ${productLink}`
        )}`;

        res.json({
            success: true,
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                discount: product.discount,
                image: product.image,
                category: product.category,
                description: product.description,
                stock: product.stock,
                link: productLink,
                whatsappShareUrl: whatsappShareUrl
            }
        });
    } catch (error) {
        console.error('Error fetching product for WhatsApp:', error);
        res.status(500).json({ msg: 'Error fetching product', error: error.message });
    }
});

module.exports = router;
