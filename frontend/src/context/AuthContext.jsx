import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser]           = useState(null);
    const [isGuest, setIsGuest]     = useState(false);
    const [loading, setLoading]     = useState(true);
    const [authModal, setAuthModal] = useState({ open: false, redirectAfter: null });

    // On mount: restore session from HttpOnly cookie (cookie sent automatically)
    useEffect(() => {
        const guest = localStorage.getItem('wavway_guest');
        if (guest === 'true') {
            setIsGuest(true);
            setLoading(false);
            return;
        }

        api.get('/auth/me')
            .then(res => setUser(res.data))
            .catch(() => {/* no session — stay logged out */})
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.removeItem('wavway_guest');
        setUser(data.user);
        setIsGuest(false);
        setAuthModal({ open: false, redirectAfter: null });
        toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
    };

    const register = async (name, email, password, phone) => {
        const { data } = await api.post('/auth/register', { name, email, password, phone });
        localStorage.removeItem('wavway_guest');
        setUser(data.user);
        setIsGuest(false);
        setAuthModal({ open: false, redirectAfter: null });
        toast.success(`Welcome to WAVWAY, ${data.user.name.split(' ')[0]}!`);
    };

    const googleLogin = async (credential) => {
        const { data } = await api.post('/auth/google', { credential });
        localStorage.removeItem('wavway_guest');
        setUser(data.user);
        setIsGuest(false);
        setAuthModal({ open: false, redirectAfter: null });
        toast.success(`Welcome, ${data.user.name.split(' ')[0]}!`);
    };

    const continueAsGuest = () => {
        localStorage.setItem('wavway_guest', 'true');
        setIsGuest(true);
        setUser(null);
        setAuthModal({ open: false, redirectAfter: null });
    };

    const logout = async () => {
        try { await api.post('/auth/logout'); } catch { /* ignore */ }
        localStorage.removeItem('wavway_guest');
        setUser(null);
        setIsGuest(false);
        toast('Logged out successfully');
    };

    const requireAuth = (callback) => {
        if (user || isGuest) {
            callback && callback();
            return true;
        }
        setAuthModal({ open: true, onSuccess: callback || null });
        return false;
    };

    const openAuthModal  = () => setAuthModal({ open: true, onSuccess: null });
    const closeAuthModal = () => setAuthModal({ open: false, onSuccess: null });

    return (
        <AuthContext.Provider value={{
            user, isGuest, loading,
            authModal, openAuthModal, closeAuthModal,
            login, register, googleLogin, continueAsGuest, logout, requireAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
