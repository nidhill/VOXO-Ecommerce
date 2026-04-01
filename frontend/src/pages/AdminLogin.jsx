import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const AdminLogin = () => {
    const { login } = useAdmin();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            const result = login(formData.email, formData.password);

            if (result.success) {
                navigate('/admin/dashboard');
            } else {
                setError(result.message);
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 transition-colors duration-300"
            >
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Lock size={24} />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Sign in to manage your store
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-zinc-700 placeholder-gray-400 dark:placeholder-zinc-500 text-gray-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent sm:text-sm transition-all bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-900"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-zinc-700 placeholder-gray-400 dark:placeholder-zinc-500 text-gray-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent sm:text-sm transition-all bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-900 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>

            <div className="absolute bottom-4 text-center text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} VOXO Commerce. All rights reserved.
            </div>
        </div>
    );
};

export default AdminLogin;
