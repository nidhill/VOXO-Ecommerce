import api from './axios';

export const getCategories = async (gender) => {
    const params = {};
    if (gender) params.gender = gender;
    const response = await api.get('/categories', { params });
    return response.data;
};

export const createCategory = async ({ name, gender }) => {
    const response = await api.post('/categories', { name, gender });
    return response.data;
};

export const editCategory = async (id, name, gender) => {
    const response = await api.put(`/categories/${id}`, { name, gender });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

export const getDbStats = async () => {
    const response = await api.get('/categories/db-stats');
    return response.data;
};
