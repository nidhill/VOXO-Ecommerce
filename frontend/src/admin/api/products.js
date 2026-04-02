import api from './axios';

export const getProducts = async () => {
    const response = await api.get('/products');
    return Array.isArray(response.data) ? response.data : [];
};

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
};
