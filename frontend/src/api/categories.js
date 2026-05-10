import api from './axios';

export const getCategories = async () => {
    const response = await api.get('/categories', { skipErrorToast: true });
    return response.data;
};
