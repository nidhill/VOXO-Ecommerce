import axios from './axios';

export const getWhatsappOrderMessage = async (productId, quantity = 1) => {
    try {
        const response = await axios.post('/whatsapp/generate-order-message', {
            productId,
            quantity
        });
        return response.data;
    } catch (error) {
        console.error('Error generating WhatsApp message:', error);
        throw error;
    }
};

export const getProductForWhatsapp = async (productId) => {
    try {
        const response = await axios.get(`/whatsapp/product/${productId}`);
        return response.data.product;
    } catch (error) {
        console.error('Error fetching product for WhatsApp:', error);
        throw error;
    }
};

export const createOrderSummary = async (orderData) => {
    try {
        const response = await axios.post('/whatsapp/create-order-summary', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order summary:', error);
        throw error;
    }
};

export const generateWhatsappShareLink = (productId, productName) => {
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://wavway.vercel.app';
    const productLink = `${frontendUrl}/product/${productId}`;
    return `https://wa.me/?text=${encodeURIComponent(
        `🛍️ Check out this amazing product on WAVWAY: ${productLink}\n\n${productName}`
    )}`;
};
