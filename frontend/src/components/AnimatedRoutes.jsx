import React from 'react';
<<<<<<< HEAD
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
=======
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
import Checkout from '../components/Checkout';
import Shop from '../pages/Shop';
import ProductDetails from '../pages/ProductDetails';
import Orders from '../pages/Orders';
import OrderTracking from '../pages/OrderTracking';
<<<<<<< HEAD
import AdminLogin from '../pages/AdminLogin';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../pages/AdminDashboard';
import ManageProducts from '../admin/ManageProducts';
import AddProduct from '../admin/AddProduct';
import ManageCoupons from '../admin/ManageCoupons';
import AdminRoute from './AdminRoute';
=======

// Admin imports
import { AdminAuthProvider, useAdminAuth } from '../admin/context/AdminAuthContext';
import AdminLayout from '../admin/components/AdminLayout';
import AdminLogin from '../admin/pages/AdminLogin';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminProducts from '../admin/pages/AdminProducts';
import AdminOrders from '../admin/pages/AdminOrders';
import AdminCoupons from '../admin/pages/AdminCoupons';

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
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
<<<<<<< HEAD
=======
                {/* Store Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/collections" element={<Shop />} />
                <Route path="/collections/:category" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order-tracking/:id" element={<OrderTracking />} />
<<<<<<< HEAD
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="add-product" element={<AddProduct />} />
                    <Route path="coupons" element={<ManageCoupons />} />
                </Route>
=======

                {/* Admin Routes */}
                <Route path="/admin/*" element={
                    <AdminAuthProvider>
                        <AdminRoutes />
                    </AdminAuthProvider>
                } />
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
            </Routes>
        </AnimatePresence>
    );
};

<<<<<<< HEAD
=======
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
                <Route path="orders" element={<AdminOrders />} />
                <Route path="coupons" element={<AdminCoupons />} />
            </Route>
        </Routes>
    );
};

>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
export default AnimatedRoutes;
