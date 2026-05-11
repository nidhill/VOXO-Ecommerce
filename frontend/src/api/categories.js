import api from './axios';

export const getCategories = async (gender) => {
    const params = {};
    if (gender) params.gender = gender;
    const response = await api.get('/categories', { params, skipErrorToast: true });
    return response.data;
};
