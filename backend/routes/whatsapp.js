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

/**
 * POST /api/whatsapp/create-order-summary
 * Create a comprehensive order summary with pricing and product URLs
 */
router.post('/create-order-summary', async (req, res) => {
    try {
        const { customerName, phone, address, city, zip, items } = req.body;

        if (!customerName || !phone || !address || !items || items.length === 0) {
            return res.status(400).json({ msg: 'Missing required order details' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'https://wavway.vercel.app';
        
        // Fetch full product details for each item
        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Product ${item.productId} not found`);
                
                const quantity = item.quantity || 1;
                const finalPrice = product.price * quantity;
                const discountAmount = product.discount ? (product.discount - product.price) * quantity : 0;
                const originalTotal = product.discount ? product.discount * quantity : product.price * quantity;

                return {
                    productId: product._id,
                    name: product.name,
                    quantity: quantity,
                    price: product.price,
                    originalPrice: product.discount || product.price,
                    discount: product.discount ? product.discount - product.price : 0,
                    discountPercentage: product.discount ? Math.round(((product.discount - product.price) / product.discount) * 100) : 0,
                    image: product.image,
                    productUrl: `${frontendUrl}/product/${product._id}`,
                    itemTotal: finalPrice,
                    itemOriginalTotal: originalTotal,
                    itemDiscountTotal: discountAmount
                };
            })
        );

        // Calculate totals
        const subtotal = enrichedItems.reduce((sum, item) => sum + item.itemTotal, 0);
        const originalPrice = enrichedItems.reduce((sum, item) => sum + item.itemOriginalTotal, 0);
        const totalDiscount = enrichedItems.reduce((sum, item) => sum + item.itemDiscountTotal, 0);

        // Build formatted message
        const itemsList = enrichedItems.map((item, idx) => {
            const discountLine = item.discount > 0 
                ? `\n   Original: ~~₹${item.originalPrice}~~ → ₹${item.price} (${item.discountPercentage}% off)`
                : '';
            return `${idx + 1}. ${item.name} × ${item.quantity}\n   Total: ₹${item.itemTotal}${discountLine}\n   🔗 Link: ${item.productUrl}`;
        }).join('\n\n');

        const message = `
*New Order from WAVWAY* 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━

*Customer:* ${customerName}
*Phone:* ${phone}
*Address:* ${address}${city ? ', ' + city : ''}${zip ? ' - ' + zip : ''}

*Items:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━

*Subtotal:* ₹${subtotal}
${totalDiscount > 0 ? `*Discount:* -₹${totalDiscount}` : ''}
*Final Total:* ₹${subtotal}

━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        res.json({
            success: true,
            message: message,
            orderSummary: {
                customerName,
                phone,
                address,
                city,
                zip,
                items: enrichedItems,
                subtotal,
                originalPrice,
                totalDiscount,
                finalTotal: subtotal
            }
        });
    } catch (error) {
        console.error('Error creating order summary:', error);
        res.status(500).json({ msg: 'Error creating order summary', error: error.message });
    }
});

module.exports = router;
