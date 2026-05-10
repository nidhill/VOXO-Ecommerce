import api from './axios';

export const getStorageStats = async () => {
    const { data } = await api.get('/storage');
    return data;
};
