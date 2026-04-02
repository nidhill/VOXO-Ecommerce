import api from './axios';

export const getHomepageBanners = async () => {
    const response = await api.get('/settings/homepage-banners');
    return response.data;
};

export const getHeroImages = async () => {
    const response = await api.get('/settings/hero-images');
    return response.data;
};
