import api from './axios';

export const getHomepageBanners = async () => {
    const response = await api.get('/settings/homepage-banners');
    return response.data;
};

export const updateHomepageBanners = async (payload) => {
    const response = await api.put('/settings/homepage-banners', payload);
    return response.data;
};
