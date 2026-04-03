import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_BASE ? `${API_BASE}/api` : '/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // send HttpOnly cookies on every request
});

// ── Response: surface API errors + silent token refresh ──────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status  = error.response?.status;
        const message = error.response?.data?.message;

        // Token expired → try a silent refresh, then replay the original request
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch {
                // Refresh failed — let the UI handle the logged-out state
                return Promise.reject(error);
            }
        }

        if (status === 429) {
            toast.error('Too many attempts. Please wait a moment.');
        } else if (status >= 500) {
            toast.error('Something went wrong on our end. Please try again.');
        } else if (message && status !== 400 && status !== 401) {
            // 400 (validation) and 401 are handled inline in forms/auth
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
