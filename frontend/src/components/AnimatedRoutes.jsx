import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Checkout from '../components/Checkout';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Orders from '../pages/Orders';
import OrderTracking from '../pages/OrderTracking';

// Admin imports
import { AdminAuthProvider, useAdminAuth } from '../admin/context/AdminAuthContext';
import AdminLayout from '../admin/components/AdminLayout';
import AdminLogin from '../admin/pages/AdminLogin';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminProducts from '../admin/pages/AdminProducts';
import AdminOrders from '../admin/pages/AdminOrders';
import AdminCoupons from '../admin/pages/AdminCoupons';
import AdminBanners from '../admin/pages/AdminBanners';

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAdminAuth();

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                background: '#0E0E0E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5b50e6'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid rgba(91, 80, 230, 0.2)',
                    borderTopColor: '#5b50e6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <ErrorBoundary>
                <Routes location={location} key={location.pathname}>
                    {/* Store Routes */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/collections" element={<Shop />} />
                    <Route path="/collections/:category" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order-tracking/:id" element={<OrderTracking />} />

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={
                        <AdminAuthProvider>
                            <AdminRoutes />
                        </AdminAuthProvider>
                    } />
                </Routes>
            </ErrorBoundary>
        </AnimatePresence>
    );
};

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/" element={
                <AdminProtectedRoute>
                    <AdminLayout />
                </AdminProtectedRoute>
            }>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="coupons" element={<AdminCoupons />} />
            </Route>
        </Routes>
    );
};

export default AnimatedRoutes;
