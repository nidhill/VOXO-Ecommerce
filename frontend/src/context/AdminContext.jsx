import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        // Check for persisted session
        const storedAuth = localStorage.getItem('admin_auth');
        if (storedAuth) {
            setAdminUser(JSON.parse(storedAuth));
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (email, password) => {
        // Hardcoded credentials
        if (email === 'admin@wavway.com' && password === 'admin123') {
            const userData = { email, name: 'Admin', role: 'admin' };
            localStorage.setItem('admin_auth', JSON.stringify(userData));
            setAdminUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_auth');
        setAdminUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, adminUser, login, logout, isLoading }}>
            {children}
        </AdminContext.Provider>
    );
};
