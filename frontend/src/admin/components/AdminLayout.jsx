import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Tag, Image, LogOut, Menu, X } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLayout = () => {
    const { logout } = useAdminAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-shell">
            <style>{`
                .admin-shell {
                    display: flex;
                    height: 100vh;
                    background: #0a0a0a;
                    color: #e5e5e5;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    overflow: hidden;
                }
                .admin-shell *, .admin-shell *::before, .admin-shell *::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                .admin-sidebar {
                    width: 260px;
                    min-width: 260px;
                    background: #0f0f0f;
                    border-right: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    z-index: 10;
                    transition: transform 0.25s ease;
                }
                .admin-sidebar-header {
                    height: 68px;
                    display: flex;
                    align-items: center;
                    padding: 0 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                }
                .admin-sidebar-close {
                    display: none;
                    margin-left: auto;
                    padding: 6px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #71717a;
                    border-radius: 6px;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.15s;
                }
                .admin-sidebar-close:hover { color: #fafafa; }
                .admin-sidebar-logo {
                    width: 34px;
                    height: 34px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    border-radius: 10px;
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 15px;
                    color: white;
                    flex-shrink: 0;
                }
                .admin-sidebar-brand {
                    font-weight: 700;
                    font-size: 18px;
                    letter-spacing: 0.5px;
                    color: white;
                }
                .admin-nav {
                    flex: 1;
                    padding: 16px 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    overflow-y: auto;
                }
                .admin-nav-link {
                    display: flex;
                    align-items: center;
                    padding: 11px 14px;
                    border-radius: 10px;
                    text-decoration: none;
                    transition: all 0.15s ease;
                    position: relative;
                    color: #71717a;
                    font-size: 14px;
                    font-weight: 500;
                    border: none;
                    background: none;
                }
                .admin-nav-link:hover {
                    background: rgba(255,255,255,0.04);
                    color: #a1a1aa;
                }
                .admin-nav-link.active {
                    background: #18181b;
                    color: white;
                }
                .admin-nav-link-icon {
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                }
                .admin-nav-link.active .admin-nav-link-icon {
                    color: #6366f1;
                }
                .admin-nav-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 22px;
                    width: 3px;
                    border-radius: 0 3px 3px 0;
                    background: #6366f1;
                }
                .admin-sidebar-footer {
                    padding: 16px 12px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0;
                }
                .admin-logout-btn {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 11px 14px;
                    color: #71717a;
                    background: none;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.15s ease;
                }
                .admin-logout-btn:hover {
                    background: rgba(255,255,255,0.04);
                    color: #ef4444;
                }
                .admin-status {
                    display: flex;
                    align-items: center;
                    padding: 8px 14px;
                    margin-top: 8px;
                }
                .admin-status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #22c55e;
                    margin-right: 8px;
                    box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
                    flex-shrink: 0;
                }
                .admin-status-text {
                    font-size: 10px;
                    color: #52525b;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 700;
                }
                .admin-main {
                    flex: 1;
                    height: 100%;
                    overflow: hidden;
                    background: #0a0a0a;
                }
                /* Mobile */
                .admin-mobile-header {
                    display: none;
                    height: 56px;
                    background: #0f0f0f;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    align-items: center;
                    padding: 0 16px;
                    gap: 12px;
                    flex-shrink: 0;
                }
                .admin-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.65);
                    z-index: 99;
                    backdrop-filter: blur(2px);
                }
                @media (max-width: 768px) {
                    .admin-shell {
                        flex-direction: column;
                    }
                    .admin-sidebar {
                        position: fixed;
                        left: 0;
                        top: 0;
                        height: 100vh;
                        z-index: 100;
                        transform: translateX(-100%);
                        box-shadow: 4px 0 24px rgba(0,0,0,0.4);
                    }
                    .admin-sidebar.sidebar-open {
                        transform: translateX(0);
                    }
                    .admin-sidebar-close {
                        display: flex;
                    }
                    .admin-overlay.overlay-visible {
                        display: block;
                    }
                    .admin-mobile-header {
                        display: flex;
                    }
                    .admin-main {
                        height: calc(100vh - 56px);
                    }
                }
            `}</style>

            {/* Mobile Top Bar */}
            <div className="admin-mobile-header">
                <button
                    onClick={() => setSidebarOpen(true)}
                    style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', borderRadius: '8px', transition: 'color 0.15s' }}
                >
                    <Menu size={20} />
                </button>
                <div className="admin-sidebar-logo" style={{ margin: 0 }}>W</div>
                <span className="admin-sidebar-brand">WAVWAY</span>
            </div>

            {/* Overlay */}
            <div className={`admin-overlay ${sidebarOpen ? 'overlay-visible' : ''}`} onClick={closeSidebar} />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">W</div>
                    <span className="admin-sidebar-brand">WAVWAY</span>
                    <button className="admin-sidebar-close" onClick={closeSidebar}>
                        <X size={18} />
                    </button>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="admin-nav-link-icon"><LayoutDashboard size={19} /></span>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="admin-nav-link-icon"><ShoppingBag size={19} /></span>
                        Products
                    </NavLink>
                    <NavLink to="/admin/banners" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="admin-nav-link-icon"><Image size={19} /></span>
                        Banners
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="admin-nav-link-icon"><ShoppingCart size={19} /></span>
                        Orders
                    </NavLink>
                    <NavLink to="/admin/coupons" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                        <span className="admin-nav-link-icon"><Tag size={19} /></span>
                        Coupons
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <span className="admin-nav-link-icon"><LogOut size={19} /></span>
                        Logout
                    </button>
                    <div className="admin-status">
                        <span className="admin-status-dot" />
                        <span className="admin-status-text">System Operational</span>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
