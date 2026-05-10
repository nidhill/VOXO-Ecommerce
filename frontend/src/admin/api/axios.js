import axios from 'axios';

const resolveApiBase = () => {
    // In dev mode, talk to the local backend directly
    if (import.meta.env.DEV) return 'http://localhost:5001/api';
    // In production, always use the Vercel proxy (/api → Render)
    // so cookies stay same-origin and are not blocked by the browser
    return '/api';
};

const API_BASE = resolveApiBase();

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'x-admin-key': import.meta.env.VITE_ADMIN_SECRET || '',
    },
    withCredentials: true,
});

export default api;
