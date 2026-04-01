import api from './axios';

export const getCoupons = async () => {
    const response = await api.get('/coupons');
    return response.data;
};

export const createCoupon = async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response.data;
};

export const updateCoupon = async (id, data) => {
    const response = await api.put(`/coupons/${id}`, data);
    return response.data;
};

export const deleteCoupon = async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
};
