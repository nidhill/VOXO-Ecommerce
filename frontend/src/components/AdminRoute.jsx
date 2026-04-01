import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAdmin();

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminRoute;
