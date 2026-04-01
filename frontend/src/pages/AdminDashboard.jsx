import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { getOrderCount } from '../api/orders';
import { ShoppingBag, MousePointerClick, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
                {subtext && <p className={`text-xs font-medium mt-2 ${colorClass}`}>{subtext}</p>}
            </div>
            <div className={`p-3 rounded-xl ${bgClass}`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts()
    });

    const { data: orderStats } = useQuery({
        queryKey: ['orderCount'],
        queryFn: getOrderCount
    });

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h2>
                <p className="text-gray-500 mt-1">Overview of your store's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={products?.length || 0}
                    subtext="+2 Added this month"
                    icon={ShoppingBag}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                    delay={1}
                />

                <StatCard
                    title="Buy Clicks"
                    value={orderStats?.count || 0}
                    subtext="Potential Orders"
                    icon={MousePointerClick}
                    colorClass="text-green-600"
                    bgClass="bg-green-50"
                    delay={2}
                />

                <StatCard
                    title="Conversion Rate"
                    value="4.2%"
                    subtext="+0.4% from last week"
                    icon={TrendingUp}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50"
                    delay={3}
                />

                <StatCard
                    title="Active Users"
                    value="1.2k"
                    subtext="+12% New Users"
                    icon={Users}
                    colorClass="text-orange-600"
                    bgClass="bg-orange-50"
                    delay={4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Placeholder for future charts */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-80 flex items-center justify-center text-gray-400 text-sm font-medium border-dashed border-2"
                >
                    Sales Analytics Chart (Coming Soon)
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-80 flex items-center justify-center text-gray-400 text-sm font-medium border-dashed border-2"
                >
                    Traffic Sources (Coming Soon)
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
