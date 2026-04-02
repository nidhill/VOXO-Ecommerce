import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://wavway.onrender.com';

const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
