import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { getOrders } from '../api/orders';
import { getCoupons } from '../api/coupons';
import { getStorageStats } from '../api/storage';
import { ShoppingBag, ShoppingCart, Tag, DollarSign, AlertTriangle, Package, Database, Cloud, HardDrive, Folder, FileText, Layers, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const COLORS = ['#6366f1', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171', '#22d3ee', '#fb923c'];

// Free tier limits
const MONGO_LIMIT = 512 * 1024 * 1024; // 512 MB (Atlas M0 free tier)
const R2_LIMIT = 10 * 1024 * 1024 * 1024; // 10 GB (R2 free tier)

const AdminDashboard = () => {
    const { data: products = [] } = useQuery({ queryKey: ['products', 'admin'], queryFn: () => getProducts({ admin: true }), retry: 1 });
    const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: getOrders, retry: 1 });
    const { data: coupons = [] } = useQuery({ queryKey: ['coupons'], queryFn: getCoupons, retry: 1 });
    const { data: storage, isLoading: storageLoading } = useQuery({ queryKey: ['storage'], queryFn: getStorageStats, retry: 1, refetchInterval: 60000 });

    const dbDisconnected = storage && !storageLoading && storage?.mongodb?.connected === false;
    const totalRevenue = orders
        .filter(o => o.status === 'Delivered')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeCoupons = coupons.filter(c => c.isActive && new Date(c.expiryDate) > new Date()).length;

    const categoryCount = {};
    products.forEach(p => { categoryCount[p.category] = (categoryCount[p.category] || 0) + 1; });
    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

    const genderCount = {};
    products.forEach(p => { genderCount[p.gender] = (genderCount[p.gender] || 0) + 1; });
    const genderData = Object.entries(genderCount).map(([name, value]) => ({ name, value }));

    const recentProducts = products.slice(0, 5);
    const recentOrders = orders.slice(0, 5);

    const stats = [
        { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'Lifetime sales', icon: <DollarSign size={20} />, bg: 'rgba(52,211,153,0.15)', iconColor: '#34d399' },
        { title: 'Total Orders', value: orders.length, sub: 'All time', icon: <ShoppingCart size={20} />, bg: 'rgba(99,102,241,0.15)', iconColor: '#818cf8' },
        { title: 'Total Products', value: products.length, sub: `${products.filter(p => !p.isHidden).length} visible on site`, icon: <ShoppingBag size={20} />, bg: 'rgba(244,114,182,0.15)', iconColor: '#f472b6' },
        { title: 'Active Coupons', value: activeCoupons, sub: `${coupons.length} total generated`, icon: <Tag size={20} />, bg: 'rgba(251,191,36,0.15)', iconColor: '#fbbf24' },
    ];

    // Storage data for pie charts
    const mongoCollections = storage?.mongodb?.collectionDetails || [];
    const r2Folders = storage?.cloudflare?.folders || {};
    const r2ChartData = Object.entries(r2Folders).map(([name, data]) => ({ name, value: data.size, count: data.count }));

    return (
        <div style={styles.page} className="dash-page">
            <style>{`
                .dash-page { 
                    height: 100%; overflow-y: auto; padding: 32px 40px; 
                    background: transparent; color: #f4f4f5; 
                }
                .dash-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
                .dash-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
                
                .stat-card {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px; padding: 24px; transition: all 0.2s ease;
                    display: flex; flex-direction: column; position: relative; overflow: hidden;
                }
                .stat-card:hover {
                    background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1);
                    transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                
                .recharts-tooltip-wrapper { outline: none !important; }
                .recharts-cartesian-grid-horizontal line { stroke: rgba(255,255,255,0.05); }
                
                .list-item {
                    display: flex; align-items: center; gap: 14px; padding: 12px 16px; 
                    border-radius: 12px; transition: background 0.15s;
                }
                .list-item:hover { background: rgba(255,255,255,0.03); }
                
                @media (max-width: 1024px) {
                    .dash-page { padding: 24px; }
                    .dash-grid4 { grid-template-columns: 1fr 1fr; }
                    .dash-grid2 { grid-template-columns: 1fr; }
                }
                @media (max-width: 640px) {
                    .dash-page { padding: 16px; }
                    .dash-grid4 { grid-template-columns: 1fr; }
                }
            `}</style>
            
            <div style={styles.header}>
                <div>
                    <h1 style={styles.h1}>Dashboard</h1>
                    <p style={styles.sub}>Overview of your store performance</p>
                </div>
            </div>

            {dbDisconnected && (
                <div style={styles.alert}>
                    <div style={styles.alertIcon}><AlertTriangle size={18} color="#f87171" /></div>
                    <div>
                        <h3 style={styles.alertTitle}>Database Not Connected</h3>
                        <p style={styles.alertText}>MongoDB Atlas may be blocking your IP. Go to MongoDB Atlas → Network Access → Add IP → Allow from Anywhere, then restart the backend.</p>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="dash-grid4">
                {stats.map(st => (
                    <div key={st.title} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ ...styles.iconBox, background: st.bg, color: st.iconColor }}>
                                {st.icon}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {st.title}
                            </span>
                        </div>
                        <h3 style={styles.cardValue}>{st.value}</h3>
                        <p style={styles.cardSub}>{st.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="dash-grid2">
                {/* Sales Chart (Categories as proxy for now) */}
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={styles.chartH}>Product Distribution</h3>
                        <p style={styles.chartSub}>Inventory split by category</p>
                    </div>
                    {categoryData.length > 0 ? (
                        <div style={styles.chartBox}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} barSize={24} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                        contentStyle={{ backgroundColor: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f4f4f5', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} 
                                        itemStyle={{ color: '#818cf8', fontWeight: 600 }}
                                    />
                                    <Bar dataKey="value" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : <div style={styles.empty}>No products available</div>}
                </div>

                {/* Gender Split */}
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={styles.chartH}>Audience Split</h3>
                        <p style={styles.chartSub}>Products by gender category</p>
                    </div>
                    {genderData.length > 0 ? (
                        <div style={{ ...styles.chartBox, display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '60%', height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                                            {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f4f4f5', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} 
                                            itemStyle={{ fontWeight: 600 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {genderData.map((item, i) => (
                                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: COLORS[i % COLORS.length] }} />
                                        <span style={{ fontSize: '13px', color: '#a1a1aa', flex: 1 }}>{item.name}</span>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <div style={styles.empty}>No data available</div>}
                </div>
            </div>

            {/* Recent Orders & Products */}
            <div className="dash-grid2">
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={styles.sectionH}>Recent Orders</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {recentOrders.length > 0 ? recentOrders.map(o => (
                            <div key={o._id} className="list-item">
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#a1a1aa' }}>
                                    <Package size={20} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5', margin: '0 0 2px 0' }}>{o.customerName}</p>
                                    <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>{o.items?.length || 0} items · {new Date(o.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5', margin: '0 0 4px 0' }}>₹{o.totalAmount?.toLocaleString()}</p>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                                        background: o.status === 'Delivered' ? 'rgba(52,211,153,0.1)' : o.status === 'Cancelled' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                                        color: o.status === 'Delivered' ? '#34d399' : o.status === 'Cancelled' ? '#f87171' : '#fbbf24'
                                    }}>{o.status}</span>
                                </div>
                            </div>
                        )) : (
                            <div style={styles.empty}>
                                <Package size={28} color="#3f3f46" style={{ marginBottom: '12px' }} />
                                <span>No recent orders</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={styles.sectionH}>Recently Added Products</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {recentProducts.length > 0 ? recentProducts.map(p => (
                            <div key={p._id} className="list-item">
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShoppingBag size={18} color="#71717a" />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                                    <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>{p.category} · {p.gender}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5', margin: '0' }}>₹{p.price?.toLocaleString()}</p>
                                    {p.isHidden && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', marginTop: '4px', display: 'inline-block' }}>Hidden</span>}
                                </div>
                            </div>
                        )) : <div style={styles.empty}>No products available</div>}
                    </div>
                </div>
            </div>

            {/* Storage Mini-Meters */}
            {storage?.mongodb?.connected && storage?.cloudflare?.connected && (
                <div className="dash-grid2" style={{ marginBottom: 0 }}>
                    <div className="stat-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Database size={16} color="#34d399" />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#e4e4e7' }}>MongoDB Storage</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#71717a' }}>{formatBytes(storage.mongodb.storageSize || 0)} / {formatBytes(MONGO_LIMIT)}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(((storage.mongodb.storageSize || 0) / MONGO_LIMIT) * 100, 100)}%`, background: '#34d399', borderRadius: '3px' }} />
                        </div>
                    </div>
                    <div className="stat-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Cloud size={16} color="#fb923c" />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#e4e4e7' }}>R2 Media Storage</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#71717a' }}>{formatBytes(storage.cloudflare.totalSize || 0)} / {formatBytes(R2_LIMIT)}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(((storage.cloudflare.totalSize || 0) / R2_LIMIT) * 100, 100)}%`, background: '#fb923c', borderRadius: '3px' }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    header: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    h1: { fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 6px 0', letterSpacing: '-0.02em' },
    sub: { fontSize: '14px', color: '#a1a1aa', margin: 0 },
    cardValue: { fontSize: '32px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 8px 0', letterSpacing: '-0.02em' },
    cardSub: { fontSize: '13px', color: '#71717a', margin: 0, fontWeight: 500 },
    chartH: { fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: '0 0 4px 0' },
    chartSub: { fontSize: '13px', color: '#71717a', margin: 0 },
    chartBox: { height: '260px' },
    sectionH: { fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 },
    empty: { fontSize: '14px', color: '#71717a', textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    alert: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' },
    alertIcon: { padding: '10px', background: 'rgba(239,68,68,0.15)', borderRadius: '12px', flexShrink: 0 },
    alertTitle: { fontSize: '15px', fontWeight: 700, color: '#fca5a5', margin: '0 0 4px 0' },
    alertText: { fontSize: '13px', color: '#f87171', margin: 0, lineHeight: 1.5 },
    iconBox: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};

export default AdminDashboard;
