import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, ShoppingCart, Tag, Image,
    LogOut, Menu, X, Users, Mail, Megaphone, ChevronRight
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV_GROUPS = [
    {
        label: 'Store',
        items: [
            { to: '/admin', end: true, icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
            { to: '/admin/products', icon: <ShoppingBag size={17} />, label: 'Products' },
            { to: '/admin/orders', icon: <ShoppingCart size={17} />, label: 'Orders' },
            { to: '/admin/customers', icon: <Users size={17} />, label: 'Customers' },
        ],
    },
    {
        label: 'Marketing',
        items: [
            { to: '/admin/coupons', icon: <Tag size={17} />, label: 'Coupons' },
            { to: '/admin/announcement', icon: <Megaphone size={17} />, label: 'Announcement' },
            { to: '/admin/subscribers', icon: <Mail size={17} />, label: 'Subscribers' },
        ],
    },
    {
        label: 'Content',
        items: [
            { to: '/admin/banners', icon: <Image size={17} />, label: 'Banners & Media' },
        ],
    },
];

const AdminLayout = () => {
    const { logout } = useAdminAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/admin/login'); };
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="a-shell">
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .a-shell {
                    display: flex; height: 100vh;
                    background: #f5f6fa;
                    font-family: 'Inter', system-ui, sans-serif;
                    overflow: hidden;
                    color: #111827;
                }
                /* ── Sidebar ── */
                .a-sidebar {
                    width: 240px; min-width: 240px;
                    background: #ffffff;
                    border-right: 1px solid #e8eaed;
                    display: flex; flex-direction: column;
                    height: 100%; z-index: 10;
                    transition: transform 0.25s ease;
                }
                .a-sidebar-header {
                    height: 64px;
                    display: flex; align-items: center;
                    padding: 0 20px;
                    border-bottom: 1px solid #e8eaed;
                    flex-shrink: 0; gap: 10px;
                }
                .a-logo-box {
                    width: 32px; height: 32px;
                    background: #111827;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 14px; color: #fff;
                    flex-shrink: 0; letter-spacing: 0.05em;
                }
                .a-brand { font-weight: 800; font-size: 16px; letter-spacing: 0.08em; color: #111827; text-transform: uppercase; }
                .a-sidebar-close {
                    display: none; margin-left: auto;
                    background: none; border: none; cursor: pointer;
                    color: #9ca3af; padding: 6px; border-radius: 6px;
                    align-items: center; justify-content: center;
                }
                .a-sidebar-close:hover { color: #111827; }
                /* ── Nav ── */
                .a-nav { flex: 1; padding: 16px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
                .a-nav-group-label {
                    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
                    text-transform: uppercase; color: #9ca3af;
                    padding: 0 8px; margin-bottom: 4px;
                }
                .a-nav-group-items { display: flex; flex-direction: column; gap: 1px; }
                .a-nav-link {
                    display: flex; align-items: center; gap: 10px;
                    padding: 9px 10px; border-radius: 8px;
                    text-decoration: none; color: #6b7280;
                    font-size: 13.5px; font-weight: 500;
                    transition: all 0.12s ease; position: relative;
                    border: none; background: none; cursor: pointer; width: 100%;
                }
                .a-nav-link:hover { background: #f3f4f6; color: #111827; }
                .a-nav-link.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }
                .a-nav-link.active svg { color: #4f46e5; }
                .a-nav-link svg { flex-shrink: 0; color: #9ca3af; transition: color 0.12s; }
                .a-nav-link:hover svg { color: #374151; }
                /* ── Footer ── */
                .a-sidebar-footer {
                    padding: 12px; border-top: 1px solid #e8eaed; flex-shrink: 0;
                }
                .a-logout-btn {
                    display: flex; align-items: center; gap: 10px;
                    width: 100%; padding: 9px 10px;
                    color: #9ca3af; background: none; border: none;
                    border-radius: 8px; cursor: pointer;
                    font-family: inherit; font-size: 13.5px; font-weight: 500;
                    transition: all 0.12s;
                }
                .a-logout-btn:hover { background: #fef2f2; color: #ef4444; }
                .a-logout-btn:hover svg { color: #ef4444; }
                /* ── Main ── */
                .a-main { flex: 1; height: 100%; overflow: hidden; background: #f5f6fa; }
                /* ── Mobile header ── */
                .a-mobile-header {
                    display: none; height: 56px;
                    background: #ffffff; border-bottom: 1px solid #e8eaed;
                    align-items: center; padding: 0 16px; gap: 12px; flex-shrink: 0;
                }
                .a-mobile-menu-btn {
                    background: none; border: none; cursor: pointer;
                    color: #6b7280; padding: 8px; border-radius: 8px;
                    display: flex; transition: color 0.15s;
                }
                .a-mobile-menu-btn:hover { color: #111827; }
                .a-overlay {
                    display: none; position: fixed; inset: 0;
                    background: rgba(0,0,0,0.4); z-index: 99;
                }
                @media (max-width: 768px) {
                    .a-shell { flex-direction: column; }
                    .a-sidebar {
                        position: fixed; left: 0; top: 0;
                        height: 100vh; z-index: 100;
                        transform: translateX(-100%);
                        box-shadow: 4px 0 24px rgba(0,0,0,0.08);
                    }
                    .a-sidebar.open { transform: translateX(0); }
                    .a-sidebar-close { display: flex; }
                    .a-overlay.visible { display: block; }
                    .a-mobile-header { display: flex; }
                    .a-main { height: calc(100vh - 56px); }
                }
            `}</style>

            {/* Mobile Top Bar */}
            <div className="a-mobile-header">
                <button className="a-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                    <Menu size={20} />
                </button>
                <div className="a-logo-box">W</div>
                <span className="a-brand">Wavway</span>
            </div>

            <div className={`a-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />

            <aside className={`a-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="a-sidebar-header">
                    <div className="a-logo-box">W</div>
                    <span className="a-brand">Wavway</span>
                    <button className="a-sidebar-close" onClick={closeSidebar}><X size={18} /></button>
                </div>

                <nav className="a-nav">
                    {NAV_GROUPS.map((group) => (
                        <div key={group.label}>
                            <div className="a-nav-group-label">{group.label}</div>
                            <div className="a-nav-group-items">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) => `a-nav-link ${isActive ? 'active' : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="a-sidebar-footer">
                    <button className="a-logout-btn" onClick={handleLogout}>
                        <LogOut size={17} />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="a-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
