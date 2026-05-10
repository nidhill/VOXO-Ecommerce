import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

const resolveBase = () => {
    if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL}/api`;
    if (import.meta.env.DEV) return 'http://localhost:5001/api';
    return '/api';
};
const API = resolveBase();

// Axios instance with credentials (cookies)
const adminApi = axios.create({ baseURL: API, withCredentials: true });

export const AdminAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount: verify cookie-based JWT
    useEffect(() => {
        adminApi.post('/admin-auth/verify-token')
            .then(res => {
                if (res.data.valid) {
                    setIsAuthenticated(true);
                    const stored = localStorage.getItem('adminUser');
                    if (stored) setAdminUser(JSON.parse(stored));
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const res = await adminApi.post('/admin-auth/login', { email, password });
        if (res.data.success) {
            setIsAuthenticated(true);
            setAdminUser(res.data.admin);
            localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
            localStorage.setItem('adminEmail', email);
            return { success: true };
        }
        return { success: false, message: res.data.message };
    };

    const logout = async () => {
        try { await adminApi.post('/admin-auth/logout'); } catch {}
        setIsAuthenticated(false);
        setAdminUser(null);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('isAdminAuthenticated');
    };

    // ── Forgot password (outside) ─────────────────────────────────────
    const sendForgotOtp = async (email) => {
        const res = await adminApi.post('/admin-auth/send-otp', { email });
        return res.data;
    };

    const resetForgotPassword = async (email, otp, newPassword) => {
        const res = await adminApi.post('/admin-auth/reset-password', { email, otp, newPassword });
        return res.data;
    };

    // ── Change password (inside dashboard) ───────────────────────────
    const sendChangeOtp = async () => {
        const res = await adminApi.post('/admin-auth/send-change-otp');
        return res.data;
    };

    const changePassword = async (currentPassword, otp, newPassword) => {
        const res = await adminApi.post('/admin-auth/change-password', { currentPassword, otp, newPassword });
        return res.data;
    };

    return (
        <AdminAuthContext.Provider value={{
            isAuthenticated, adminUser, loading,
            login, logout,
            sendForgotOtp, resetForgotPassword,
            sendChangeOtp, changePassword,
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
