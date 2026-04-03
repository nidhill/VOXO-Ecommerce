import api from './axios';

export const getHomepageBanners = async () => {
    const response = await api.get('/settings/homepage-banners');
    return response.data;
};

export const updateHomepageBanners = async (payload) => {
    const response = await api.put('/settings/homepage-banners', payload);
    return response.data;
};

export const getHeroImages = async () => {
    const response = await api.get('/settings/hero-images');
    return response.data;
};

export const updateHeroImages = async (payload) => {
    const response = await api.put('/settings/hero-images', payload);
    return response.data;
};
