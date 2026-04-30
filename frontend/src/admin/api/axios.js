import axios from 'axios';

const resolveApiBase = () => {
    if (import.meta.env.VITE_API_URL) {
        return `${import.meta.env.VITE_API_URL}/api`;
    }

    if (import.meta.env.DEV) {
        return 'http://localhost:5001/api';
    }

    return '/api';
};

const API_BASE = resolveApiBase();

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

export default api;
