import api from './axios';

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const createCategory = async (name) => {
    const response = await api.post('/categories', { name });
    return response.data;
};

export const editCategory = async (id, name) => {
    const response = await api.put(`/categories/${id}`, { name });
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
