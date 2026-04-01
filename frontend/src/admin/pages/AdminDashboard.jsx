import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { getOrders } from '../api/orders';
import { getCoupons } from '../api/coupons';
import { getStorageStats } from '../api/storage';
import { ShoppingBag, ShoppingCart, Tag, DollarSign, AlertTriangle, Package, Database, Cloud, HardDrive, Folder, FileText, Layers } from 'lucide-react';
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

const Dashboard = () => {
    const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: getProducts, retry: 1 });
    const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: getOrders, retry: 1 });
    const { data: coupons = [] } = useQuery({ queryKey: ['coupons'], queryFn: getCoupons, retry: 1 });
    const { data: storage, isLoading: storageLoading } = useQuery({ queryKey: ['storage'], queryFn: getStorageStats, retry: 1, refetchInterval: 60000 });

    const dbDisconnected = storage && !storageLoading && storage?.mongodb?.connected === false;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
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
        { title: 'Total Products', value: products.length, sub: `${products.filter(p => !p.isHidden).length} visible`, icon: <ShoppingBag size={18} />, bg: 'rgba(99,102,241,0.1)', iconColor: '#818cf8' },
        { title: 'Total Orders', value: orders.length, sub: 'All time', icon: <ShoppingCart size={18} />, bg: 'rgba(34,197,94,0.1)', iconColor: '#4ade80' },
        { title: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'Total order value', icon: <DollarSign size={18} />, bg: 'rgba(250,204,21,0.1)', iconColor: '#facc15' },
        { title: 'Active Coupons', value: activeCoupons, sub: `${coupons.length} total`, icon: <Tag size={18} />, bg: 'rgba(168,85,247,0.1)', iconColor: '#c084fc' },
    ];

    // Storage data for pie charts
    const mongoCollections = storage?.mongodb?.collectionDetails || [];
    const mongoChartData = mongoCollections.map(c => ({ name: c.name, value: c.size }));
    const r2Folders = storage?.cloudflare?.folders || {};
    const r2ChartData = Object.entries(r2Folders).map(([name, data]) => ({ name, value: data.size, count: data.count }));

    return (
        <div style={styles.page} className="dash-page">
            <style>{`
                @media (max-width: 640px) {
                    .dash-page { padding: 16px !important; }
                    .dash-grid4 { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
                    .dash-grid2 { grid-template-columns: 1fr !important; }
                }
            `}</style>
            <div style={styles.header}>
                <h1 style={styles.h1}>Dashboard</h1>
                <p style={styles.sub}>Overview of your store</p>
            </div>

            {dbDisconnected && (
                <div style={styles.alert}>
                    <div style={styles.alertIcon}><AlertTriangle size={16} color="#f87171" /></div>
                    <div>
                        <h3 style={styles.alertTitle}>Database Not Connected</h3>
                        <p style={styles.alertText}>MongoDB Atlas may be blocking your IP. Go to <b>MongoDB Atlas → Network Access → Add IP → Allow from Anywhere</b>, then restart the backend.</p>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div style={styles.grid4} className="dash-grid4">
                {stats.map(st => (
                    <div key={st.title} style={styles.card}>
                        <div style={{ ...styles.iconBox, background: st.bg }}>
                            <span style={{ color: st.iconColor, display: 'flex' }}>{st.icon}</span>
                        </div>
                        <p style={styles.cardTitle}>{st.title}</p>
                        <h3 style={styles.cardValue}>{st.value}</h3>
                        <p style={styles.cardSub}>{st.sub}</p>
                    </div>
                ))}
            </div>

            {/* Storage Section */}
            <div style={styles.grid2} className="dash-grid2">
                {/* MongoDB Atlas */}
                <div style={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ ...styles.iconBox, background: 'rgba(34,197,94,0.1)', margin: 0 }}>
                                <Database size={18} color="#4ade80" />
                            </div>
                            <div>
                                <h3 style={styles.chartH}>MongoDB Atlas</h3>
                                <p style={{ ...styles.chartSub, margin: 0 }}>{storage?.mongodb?.dbName || 'Loading...'}</p>
                            </div>
                        </div>
                        <span style={{ ...styles.statusBadge, ...(storage?.mongodb?.connected ? styles.statusConnected : styles.statusDisconnected) }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: storage?.mongodb?.connected ? '#4ade80' : '#f87171', display: 'inline-block' }} />
                            {storage?.mongodb?.connected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    {storageLoading ? (
                        <div style={styles.empty}>Loading storage stats...</div>
                    ) : storage?.mongodb?.connected ? (
                        <>
                            {/* MongoDB Usage Bar */}
                            {(() => {
                                const used = storage.mongodb.storageSize || 0;
                                const pct = Math.min((used / MONGO_LIMIT) * 100, 100);
                                const remaining = Math.max(0, 100 - pct);
                                const barColor = pct > 80 ? '#f87171' : pct > 50 ? '#fbbf24' : '#4ade80';
                                return (
                                    <div style={{ marginBottom: '20px', padding: '16px', background: '#18181b', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa' }}>Storage Usage</span>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: barColor }}>{remaining.toFixed(1)}% remaining</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#27272a', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                                            <div style={{ height: '100%', width: `${Math.max(pct, 0.5)}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#52525b' }}>
                                            <span>{formatBytes(used)} used</span>
                                            <span>{formatBytes(MONGO_LIMIT)} total</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* MongoDB Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <div style={styles.miniStat}>
                                    <HardDrive size={14} color="#52525b" />
                                    <div>
                                        <p style={styles.miniLabel}>Data Size</p>
                                        <p style={styles.miniValue}>{formatBytes(storage.mongodb.dataSize)}</p>
                                    </div>
                                </div>
                                <div style={styles.miniStat}>
                                    <Layers size={14} color="#52525b" />
                                    <div>
                                        <p style={styles.miniLabel}>Collections</p>
                                        <p style={styles.miniValue}>{storage.mongodb.collections}</p>
                                    </div>
                                </div>
                                <div style={styles.miniStat}>
                                    <FileText size={14} color="#52525b" />
                                    <div>
                                        <p style={styles.miniLabel}>Documents</p>
                                        <p style={styles.miniValue}>{storage.mongodb.documents}</p>
                                    </div>
                                </div>
                            </div>

                            {/* MongoDB Collections List */}
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>Collections</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {mongoCollections.map((col, i) => (
                                    <div key={col.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#e5e5e5', flex: 1, textTransform: 'capitalize' }}>{col.name}</span>
                                        <span style={{ fontSize: '12px', color: '#71717a', marginRight: '8px' }}>{col.documents} docs</span>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa' }}>{formatBytes(col.size)}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={styles.empty}>
                            <Database size={24} color="#27272a" style={{ marginBottom: '8px' }} />
                            <span>Not connected</span>
                        </div>
                    )}
                </div>

                {/* Cloudflare R2 */}
                <div style={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ ...styles.iconBox, background: 'rgba(251,146,60,0.1)', margin: 0 }}>
                                <Cloud size={18} color="#fb923c" />
                            </div>
                            <div>
                                <h3 style={styles.chartH}>Cloudflare R2</h3>
                                <p style={{ ...styles.chartSub, margin: 0 }}>{storage?.cloudflare?.bucket || 'Loading...'}</p>
                            </div>
                        </div>
                        <span style={{ ...styles.statusBadge, ...(storage?.cloudflare?.connected ? styles.statusConnected : styles.statusDisconnected) }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: storage?.cloudflare?.connected ? '#4ade80' : '#f87171', display: 'inline-block' }} />
                            {storage?.cloudflare?.connected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    {storageLoading ? (
                        <div style={styles.empty}>Loading storage stats...</div>
                    ) : storage?.cloudflare?.connected ? (
                        <>
                            {/* R2 Usage Bar */}
                            {(() => {
                                const used = storage.cloudflare.totalSize || 0;
                                const pct = Math.min((used / R2_LIMIT) * 100, 100);
                                const remaining = Math.max(0, 100 - pct);
                                const barColor = pct > 80 ? '#f87171' : pct > 50 ? '#fbbf24' : '#fb923c';
                                return (
                                    <div style={{ marginBottom: '20px', padding: '16px', background: '#18181b', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa' }}>Storage Usage</span>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: pct < 50 ? '#4ade80' : barColor }}>{remaining.toFixed(4)}% remaining</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#27272a', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                                            <div style={{ height: '100%', width: `${Math.max(pct, 0.3)}%`, background: `linear-gradient(90deg, #fb923c, #f97316)`, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#52525b' }}>
                                            <span>{formatBytes(used)} used</span>
                                            <span>{formatBytes(R2_LIMIT)} total</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* R2 Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <div style={styles.miniStat}>
                                    <HardDrive size={14} color="#52525b" />
                                    <div>
                                        <p style={styles.miniLabel}>Total Size</p>
                                        <p style={styles.miniValue}>{formatBytes(storage.cloudflare.totalSize)}</p>
                                    </div>
                                </div>
                                <div style={styles.miniStat}>
                                    <FileText size={14} color="#52525b" />
                                    <div>
                                        <p style={styles.miniLabel}>Objects</p>
                                        <p style={styles.miniValue}>{storage.cloudflare.totalObjects}</p>
                                    </div>
                                </div>
                                <div style={styles.miniStat}>
                                    <Folder size={14} color="#52525b" />
                                    <div>
                                        <p style={styles.miniLabel}>Folders</p>
                                        <p style={styles.miniValue}>{Object.keys(r2Folders).length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* R2 Folders List */}
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>Folders</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {r2ChartData.map((folder, i) => {
                                    const pct = storage.cloudflare.totalSize > 0 ? Math.round((folder.value / storage.cloudflare.totalSize) * 100) : 0;
                                    return (
                                        <div key={folder.name} style={{ padding: '10px 12px', background: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                <Folder size={14} color={COLORS[i % COLORS.length]} />
                                                <span style={{ fontSize: '13px', fontWeight: 500, color: '#e5e5e5', flex: 1 }}>/{folder.name}</span>
                                                <span style={{ fontSize: '12px', color: '#71717a' }}>{folder.count} files</span>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa' }}>{formatBytes(folder.value)}</span>
                                            </div>
                                            {/* Progress bar */}
                                            <div style={{ height: '3px', background: '#1e1e20', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: '2px', transition: 'width 0.3s' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {r2ChartData.length === 0 && (
                                    <div style={{ ...styles.empty, padding: '20px 0' }}>
                                        <Cloud size={20} color="#27272a" style={{ marginBottom: '6px' }} />
                                        <span>No files uploaded yet</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={styles.empty}>
                            <Cloud size={24} color="#27272a" style={{ marginBottom: '8px' }} />
                            <span>{storage?.cloudflare?.error || 'Not connected'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts */}
            <div style={styles.grid2} className="dash-grid2">
                <div style={styles.card}>
                    <h3 style={styles.chartH}>Products by Category</h3>
                    <p style={styles.chartSub}>Distribution across categories</p>
                    {categoryData.length > 0 ? (
                        <div style={styles.chartBox}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} dy={8} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : <div style={styles.empty}>No products yet</div>}
                </div>

                <div style={styles.card}>
                    <h3 style={styles.chartH}>Products by Gender</h3>
                    <p style={styles.chartSub}>Gender-wise product split</p>
                    {genderData.length > 0 ? (
                        <div style={{ ...styles.chartBox, display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '55%', height: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                            {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '12px' }}>
                                {genderData.map((item, i) => (
                                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                                        <span style={{ fontSize: '13px', color: '#a1a1aa', flex: 1 }}>{item.name}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fafafa' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <div style={styles.empty}>No products yet</div>}
                </div>
            </div>

            {/* Recent Items */}
            <div style={styles.grid2} className="dash-grid2">
                <div style={styles.card}>
                    <h3 style={styles.sectionH}>Recent Products</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {recentProducts.length > 0 ? recentProducts.map(p => (
                            <div key={p._id} style={styles.listItem}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={styles.listImg}>
                                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShoppingBag size={14} color="#3f3f46" />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={styles.listName}>{p.name}</p>
                                    <p style={styles.listMeta}>{p.category} · {p.gender}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={styles.listPrice}>₹{p.price}</p>
                                    {p.isHidden && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>Hidden</span>}
                                </div>
                            </div>
                        )) : <p style={styles.empty}>No products yet</p>}
                    </div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.sectionH}>Recent Orders</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {recentOrders.length > 0 ? recentOrders.map(o => (
                            <div key={o._id} style={styles.listItem}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={styles.listImg}><Package size={14} color="#52525b" /></div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={styles.listName}>{o.customerName}</p>
                                    <p style={styles.listMeta}>{o.items?.length || 0} items · {new Date(o.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={styles.listPrice}>₹{o.totalAmount}</p>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', display: 'inline-block', marginTop: '2px',
                                        background: o.status === 'Delivered' ? 'rgba(34,197,94,0.1)' : o.status === 'Cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                        color: o.status === 'Delivered' ? '#4ade80' : o.status === 'Cancelled' ? '#f87171' : '#fbbf24'
                                    }}>{o.status}</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ ...styles.empty, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <Package size={24} color="#27272a" />
                                <span>No orders yet</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { height: '100%', overflowY: 'auto', padding: '32px', background: '#0a0a0a', fontFamily: 'Inter, system-ui, sans-serif' },
    header: { marginBottom: '28px' },
    h1: { fontSize: '22px', fontWeight: 700, color: '#fafafa', margin: 0, letterSpacing: '-0.3px' },
    sub: { fontSize: '13px', color: '#52525b', marginTop: '4px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
    card: { background: '#111113', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '22px', boxSizing: 'border-box' },
    cardTitle: { fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, margin: '0 0 2px 0' },
    cardValue: { fontSize: '28px', fontWeight: 700, color: '#fafafa', margin: '8px 0 4px 0', lineHeight: 1 },
    cardSub: { fontSize: '12px', color: '#3f3f46', margin: 0 },
    chartH: { fontSize: '14px', fontWeight: 600, color: '#fafafa', margin: '0 0 2px 0' },
    chartSub: { fontSize: '12px', color: '#52525b', margin: '0 0 20px 0' },
    chartBox: { height: '240px' },
    sectionH: { fontSize: '14px', fontWeight: 600, color: '#fafafa', margin: '0 0 14px 0' },
    listItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', cursor: 'default', transition: 'background 0.15s' },
    listImg: { width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    listName: { fontSize: '13px', fontWeight: 500, color: '#e5e5e5', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    listMeta: { fontSize: '11px', color: '#52525b', margin: '2px 0 0 0' },
    listPrice: { fontSize: '13px', fontWeight: 600, color: '#fafafa', margin: 0, textAlign: 'right' },
    empty: { fontSize: '13px', color: '#3f3f46', textAlign: 'center', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    alert: { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '24px' },
    alertIcon: { padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', flexShrink: 0 },
    alertTitle: { fontSize: '13px', fontWeight: 600, color: '#f87171', margin: 0 },
    alertText: { fontSize: '12px', color: 'rgba(248,113,113,0.6)', marginTop: '4px', lineHeight: 1.5 },
    iconBox: { width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', flexShrink: 0 },
    statusBadge: { display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 },
    statusConnected: { background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.15)' },
    statusDisconnected: { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' },
    miniStat: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' },
    miniLabel: { fontSize: '10px', color: '#52525b', margin: '0 0 1px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 },
    miniValue: { fontSize: '14px', fontWeight: 600, color: '#fafafa', margin: 0 },
};

export default Dashboard;
