import api from './axios';

export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const getOrderCount = async () => {
    const response = await api.get('/orders/count');
    return response.data;
};
