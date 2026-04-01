import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Tag, Settings, LogOut } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAdmin();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
        { path: '/admin/coupons', icon: Tag, label: 'Coupons' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-zinc-900 shadow-xl flex flex-col fixed inset-y-0 z-50 border-r border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                <div className="flex items-center justify-center h-20 border-b border-gray-100 dark:border-zinc-800">
                    <h1 className="text-2xl font-extrabold tracking-tighter text-black dark:text-white">VOXO<span className="text-gray-400 font-light text-base ml-1">ADMIN</span></h1>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3.5 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/10'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive(item.path) ? 'text-white dark:text-black' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                }`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-6 py-3.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                    <div className="mt-4 px-6 text-xs text-gray-400 text-center">
                        v1.0.0
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 overflow-y-auto w-full">
                <div className="flex justify-end mb-6">
                    <ThemeToggle />
                </div>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
