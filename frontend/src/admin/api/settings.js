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

export const getAnnouncementBar = async () => {
    const response = await api.get('/settings/announcement-bar');
    return response.data;
};

export const updateAnnouncementBar = async (payload) => {
    const response = await api.put('/settings/announcement-bar', payload);
    return response.data;
};

export const getAdminUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const getAdminSubscribers = async () => {
    const response = await api.get('/admin/subscribers');
    return response.data;
};

export const deleteSubscriber = async (id) => {
    const response = await api.delete(`/admin/subscribers/${id}`);
    return response.data;
};

export const getStoreAutomation = async () => {
    const response = await api.get('/settings/store-automation');
    return response.data;
};

export const updateStoreAutomation = async (data) => {
    const response = await api.put('/settings/store-automation', data);
    return response.data;
};
