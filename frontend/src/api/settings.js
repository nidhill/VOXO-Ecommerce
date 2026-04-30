import api from './axios';

const DEFAULT_BANNERS = {
    men: '/images/banners/men-featured.png',
    women: '/images/banners/women-featured.png',
    updatedAt: null,
};

const DEFAULT_HERO_IMAGES = {
    images: [],
    updatedAt: null,
};

export const getHomepageBanners = async () => {
    try {
        const response = await api.get('/settings/homepage-banners', {
            skipErrorToast: true,
        });
        return response.data;
    } catch {
        return DEFAULT_BANNERS;
    }
};

export const updateHomepageBanners = async (payload) => {
    const response = await api.put('/settings/homepage-banners', payload);
    return response.data;
};

export const getHeroImages = async () => {
    try {
        const response = await api.get('/settings/hero-images', {
            skipErrorToast: true,
        });
        return response.data;
    } catch {
        return DEFAULT_HERO_IMAGES;
    }
};

export const updateHeroImages = async (payload) => {
    const response = await api.put('/settings/hero-images', payload);
    return response.data;
};
