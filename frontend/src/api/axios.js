import axios from 'axios';
import { toast } from 'sonner';

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
        const url     = originalRequest?.url || '';
        const skipErrorToast = Boolean(originalRequest?.skipErrorToast);

        // Token expired mid-session → silent refresh, then replay.
        // Never retry for /auth/* endpoints:
        //   - /auth/me    401 = "not logged in" (normal on startup, no retry needed)
        //   - /auth/refresh 401 = refresh token missing/expired (would loop forever)
        const isAuthRoute = url.includes('/auth/');
        if (status === 401 && !originalRequest._retry && !isAuthRoute) {
            originalRequest._retry = true;
            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch {
                return Promise.reject(error);
            }
        }

        if (skipErrorToast) {
            return Promise.reject(error);
        }

        if (status === 429) {
            toast.error('Too many attempts. Please wait a moment.');
        } else if (status >= 500) {
            toast.error('Something went wrong on our end. Please try again.');
        } else if (message && status !== 400 && status !== 401) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
export { API_BASE };
