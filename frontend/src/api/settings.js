import api from './axios';

export const getHomepageBanners = async () => {
    const response = await api.get('/settings/homepage-banners');
    return response.data;
};
