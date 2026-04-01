import api from './axios';

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const updateOrder = async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
};

export const deleteOrder = async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
};
