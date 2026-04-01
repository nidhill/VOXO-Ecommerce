import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy handles this in dev
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
