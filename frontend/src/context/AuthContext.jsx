import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authModal, setAuthModal] = useState({ open: false, redirectAfter: null });

    useEffect(() => {
        const token = localStorage.getItem('wavway_token');
        const guest = localStorage.getItem('wavway_guest');
        if (guest === 'true') {
            setIsGuest(true);
            setLoading(false);
            return;
        }
        if (token) {
            api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setUser(res.data))
                .catch(() => localStorage.removeItem('wavway_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('wavway_token', data.token);
        localStorage.removeItem('wavway_guest');
        setUser(data.user);
        setIsGuest(false);
        setAuthModal({ open: false, redirectAfter: null });
    };

    const register = async (name, email, password, phone) => {
        const { data } = await api.post('/auth/register', { name, email, password, phone });
        localStorage.setItem('wavway_token', data.token);
        localStorage.removeItem('wavway_guest');
        setUser(data.user);
        setIsGuest(false);
        setAuthModal({ open: false, redirectAfter: null });
    };

    const googleLogin = async (credential) => {
        const { data } = await api.post('/auth/google', { credential });
        localStorage.setItem('wavway_token', data.token);
        localStorage.removeItem('wavway_guest');
        setUser(data.user);
        setIsGuest(false);
        setAuthModal({ open: false, redirectAfter: null });
    };

    const continueAsGuest = () => {
        localStorage.setItem('wavway_guest', 'true');
        localStorage.removeItem('wavway_token');
        setIsGuest(true);
        setUser(null);
        setAuthModal({ open: false, redirectAfter: null });
    };

    const logout = () => {
        localStorage.removeItem('wavway_token');
        localStorage.removeItem('wavway_guest');
        setUser(null);
        setIsGuest(false);
    };

    // Call this to open the auth modal (e.g. when adding to cart)
    const requireAuth = (callback) => {
        if (user || isGuest) {
            callback && callback();
            return true;
        }
        setAuthModal({ open: true, onSuccess: callback || null });
        return false;
    };

    const openAuthModal = () => setAuthModal({ open: true, onSuccess: null });
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
