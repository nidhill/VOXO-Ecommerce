import api from './axios';

import { products } from '../data/products';

export const getProducts = async (filters = {}) => {
    try {
        const { category, gender, search } = filters;
<<<<<<< HEAD
        const response = await api.get('/products', { params: { category, gender, search } });
=======
        // Only send params that have actual values — never send null/undefined
        const params = {};
        if (category) params.category = category;
        if (gender) params.gender = gender;
        if (search && search.trim()) params.search = search.trim();

        const response = await api.get('/products', { params });
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
        return response.data;
    } catch (error) {
        console.warn('Backend unavailable, using local data', error);
        let filtered = [...products];
        const { category, gender, search } = filters;

        if (gender) {
<<<<<<< HEAD
            filtered = filtered.filter(p => p.gender === gender);
        }
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }
        if (search) {
            const lowerSearch = search.toLowerCase();
=======
            filtered = filtered.filter(p =>
                p.gender === gender || p.gender === 'Unisex'
            );
        }
        if (category) {
            filtered = filtered.filter(p =>
                p.category?.toLowerCase() === category.toLowerCase()
            );
        }
        if (search && search.trim()) {
            const lowerSearch = search.trim().toLowerCase();
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerSearch) ||
                p.category.toLowerCase().includes(lowerSearch)
            );
        }
        return filtered;
    }
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
