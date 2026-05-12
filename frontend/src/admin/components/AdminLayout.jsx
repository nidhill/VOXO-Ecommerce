import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, ShoppingCart, Tag, Image,
    LogOut, Menu, X, Users, Mail, Megaphone, Database, KeyRound, CheckCircle2
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV_GROUPS = [
    {
        label: 'Store',
        items: [
            { to: '/admin', end: true, icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
            { to: '/admin/products', icon: <ShoppingBag size={18} />, label: 'Products' },
            { to: '/admin/orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
            { to: '/admin/customers', icon: <Users size={18} />, label: 'Customers' },
            { to: '/admin/categories', icon: <Tag size={18} />, label: 'Categories' },
        ],
    },
    {
        label: 'Marketing',
        items: [
            { to: '/admin/coupons', icon: <Tag size={18} />, label: 'Coupons' },
            { to: '/admin/subscribers', icon: <Mail size={18} />, label: 'Subscribers' },
        ],
    },
    {
        label: 'Content',
        items: [
            { to: '/admin/banners', icon: <Image size={18} />, label: 'Banners & Media' },
        ],
    },
    {
        label: 'System',
        items: [
            { to: '/admin/database', icon: <Database size={18} />, label: 'Database' },
            { to: '/admin/change-password', icon: <KeyRound size={18} />, label: 'Change Password' },
        ],
    },
];

const AdminLayout = () => {
    const { logout } = useAdminAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/admin/login'); };
    const closeSidebar = () => setSidebarOpen(false);

    React.useEffect(() => {
        if (sidebarOpen && window.innerWidth <= 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    return (
        <div className="a-shell">
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                
                /* Globals */
                .a-shell {
                    display: flex; height: 100vh;
                    width: 100%;
                    background: #0a0a0f;
                    font-family: 'Inter', system-ui, sans-serif;
                    color: #f4f4f5;
                    position: relative;
                    overflow: hidden;
                }
                
                /* Scrollbar */
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

                /* ── Sidebar ── */
                .a-sidebar {
                    width: 260px; min-width: 260px;
                    background: rgba(255,255,255,0.02);
                    border-right: 1px solid rgba(255,255,255,0.06);
                    display: flex; flex-direction: column;
                    height: 100%; z-index: 100;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s;
                    visibility: visible;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                .a-sidebar-header {
                    height: 72px;
                    display: flex; align-items: center;
                    padding: 0 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    flex-shrink: 0; gap: 12px;
                }
                .a-logo-box {
                    width: 34px; height: 34px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 16px; color: #fff;
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
                }
                .a-brand { 
                    font-weight: 700; font-size: 16px; letter-spacing: 0.05em; 
                    color: #f4f4f5; 
                }
                .a-sidebar-close {
                    display: none; margin-left: auto;
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer; color: #a1a1aa; padding: 6px; border-radius: 8px;
                    align-items: center; justify-content: center;
                }
                
                /* ── Nav ── */
                .a-nav { flex: 1; padding: 24px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 28px; }
                .a-nav-group-label {
                    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
                    text-transform: uppercase; color: #52525b;
                    padding: 0 12px; margin-bottom: 8px;
                }
                .a-nav-group-items { display: flex; flex-direction: column; gap: 4px; }
                .a-nav-link {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 12px; border-radius: 10px;
                    text-decoration: none; color: #a1a1aa;
                    font-size: 14px; font-weight: 500;
                    transition: all 0.2s ease; position: relative;
                }
                .a-nav-link:hover { 
                    background: rgba(255,255,255,0.04); 
                    color: #f4f4f5; 
                }
                .a-nav-link.active { 
                    background: rgba(99,102,241,0.1); 
                    color: #818cf8; 
                    font-weight: 600; 
                }
                .a-nav-link.active::before {
                    content: '';
                    position: absolute; left: 0; top: 50%; transform: translateY(-50%);
                    height: 16px; width: 3px; border-radius: 0 4px 4px 0;
                    background: #818cf8;
                }
                .a-nav-link svg { flex-shrink: 0; color: #71717a; transition: color 0.2s; }
                .a-nav-link:hover svg { color: #a1a1aa; }
                .a-nav-link.active svg { color: #818cf8; }
                
                /* ── Footer ── */
                .a-sidebar-footer {
                    padding: 20px 16px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
                }
                .a-logout-btn {
                    display: flex; align-items: center; gap: 12px;
                    width: 100%; padding: 10px 12px;
                    color: #a1a1aa; background: none; border: none;
                    border-radius: 10px; cursor: pointer;
                    font-family: inherit; font-size: 14px; font-weight: 500;
                    transition: all 0.2s;
                }
                .a-logout-btn:hover { 
                    background: rgba(239,68,68,0.1); 
                    color: #f87171; 
                }
                .a-logout-btn:hover svg { color: #f87171; }
                
                /* ── Main ── */
                .a-main { flex: 1; height: 100%; overflow: hidden; background: #0a0a0f; position: relative; }
                .a-main::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 300px;
                    background: linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%);
                    pointer-events: none; z-index: 0;
                }
                .a-main-content {
                    flex: 1; overflow-y: auto; position: relative; z-index: 1;
                    height: 100%;
                    -webkit-overflow-scrolling: touch;
                    will-change: transform;
                }
                @media (max-width: 768px) {
                    .a-main-content { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
                }
                
                /* ── Mobile header ── */
                .a-mobile-header {
                    display: none; height: 60px;
                    background: rgba(10,10,15,0.8); border-bottom: 1px solid rgba(255,255,255,0.06);
                    align-items: center; padding: 0 16px; gap: 14px; flex-shrink: 0;
                    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                    position: sticky; top: 0; z-index: 90;
                }
                .a-mobile-menu-btn {
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer; color: #f4f4f5; padding: 8px; border-radius: 10px;
                    display: flex; transition: background 0.2s;
                }
                .a-mobile-menu-btn:hover { background: rgba(255,255,255,0.1); }
                .a-overlay {
                    display: none; position: fixed; inset: 0;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 99;
                    opacity: 0; transition: opacity 0.3s;
                }
                
                @media (max-width: 1024px) {
                    .a-shell { 
                        flex-direction: column; 
                        min-height: 100vh;
                        height: auto;
                        position: relative;
                        width: 100%;
                    }
                    .a-sidebar {
                        position: fixed; left: 0; top: 0;
                        height: 100vh; z-index: 100;
                        transform: translateX(-100%);
                        background: #0f0f13; /* Solid for mobile */
                        visibility: hidden;
                    }
                    .a-sidebar.open { transform: translateX(0); visibility: visible; }
                    .a-sidebar-close { display: flex; }
                    .a-overlay.visible { display: block; opacity: 1; }
                    .a-mobile-header { display: flex; }
                    .a-main { height: auto; min-height: calc(100vh - 60px); overflow: visible; }
                    .a-main-content { height: auto; overflow: visible; }
                }

                @media (max-width: 640px) {
                    /* Fixes for pages with padding on root (Dashboard, Banners, Password) */
                    .a-main-content > div[style*="padding"] { padding: 16px !important; }
                    
                    /* Universal fix for any inner body wrappers with inline padding */
                    .a-main-content > div > div[style*="padding"] { padding: 16px !important; }
                    
                    /* Fixes for typical list pages (Products, Orders, Customers, etc) */
                    .admin-header {
                        padding: 16px !important;
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px !important;
                        height: auto !important;
                    }
                    .admin-header > div:last-child {
                        width: 100% !important;
                        flex-wrap: wrap !important;
                    }
                    .admin-header input[type="text"] { width: 100% !important; }
                    
                    /* Expand search wrappers */
                    .admin-header > div > div {
                        flex: 1 !important;
                        min-width: 150px !important;
                        width: 100% !important;
                    }
                    .admin-body { padding: 16px !important; }
                }
                
                /* Global Animations */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Mobile Top Bar */}
            <div className="a-mobile-header">
                <button className="a-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                    <Menu size={20} />
                </button>
                <div className="a-logo-box" style={{ width: 30, height: 30, fontSize: 14 }}>W</div>
                <span className="a-brand">Wavway Admin</span>
            </div>

            <div className={`a-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />

            <aside className={`a-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="a-sidebar-header">
                    <div className="a-logo-box">W</div>
                    <span className="a-brand">Wavway Admin</span>
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
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="a-main">
                <div className="a-main-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
