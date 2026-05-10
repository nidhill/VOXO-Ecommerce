import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDbStats } from '../api/categories';
import { Database, Server, HardDrive, Package, ShoppingCart, Users, Tag, Loader2, RefreshCw, Wifi } from 'lucide-react';

function fmtBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function fmtUptime(seconds) {
    if (!seconds) return '—';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return [d && `${d}d`, h && `${h}h`, `${m}m`].filter(Boolean).join(' ');
}

const StatCard = ({ icon, label, value, color = '#6366f1', sub }) => (
    <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: '14px', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {React.cloneElement(icon, { size: 20, color })}
        </div>
        <div>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0', fontWeight: 500 }}>{label}</p>
            {sub && <p style={{ fontSize: '11px', color: '#c4b5fd', margin: '2px 0 0 0' }}>{sub}</p>}
        </div>
    </div>
);

const AdminDatabase = () => {
    const { data: stats, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['db-stats'],
        queryFn: getDbStats,
        refetchInterval: 30000,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f6fa', overflow: 'hidden' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .col-row:nth-child(even) { background: #fafafa; }
                .col-row:hover { background: #f0f4ff; }
            `}</style>

            {/* Header */}
            <header style={{ padding: '24px 32px', borderBottom: '1px solid #e8eaed', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>Database</h1>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                        MongoDB • Live collection stats
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', background: '#f3f4f6', border: '1px solid #e8eaed', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e9eaf0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; }}
                >
                    <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
                    Refresh
                </button>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px', color: '#9ca3af' }}>
                        <Loader2 size={24} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: '14px' }}>Fetching database info…</span>
                    </div>
                ) : error ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '10px', color: '#ef4444', fontSize: '14px' }}>
                        Could not load database stats.
                    </div>
                ) : (
                    <>
                        {/* Connection Banner */}
                        <div style={{ background: stats.connection.status === 'Connected' ? 'rgba(22,163,74,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${stats.connection.status === 'Connected' ? '#bbf7d0' : '#fecaca'}`, borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: stats.connection.status === 'Connected' ? '#22c55e' : '#ef4444', flexShrink: 0, boxShadow: `0 0 0 3px ${stats.connection.status === 'Connected' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }} />
                            <div>
                                <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: stats.connection.status === 'Connected' ? '#16a34a' : '#dc2626' }}>
                                    {stats.connection.status}
                                </p>
                                <p style={{ margin: '1px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                                    {stats.connection.host} &nbsp;/&nbsp; <strong>{stats.connection.dbName}</strong>
                                    {stats.uptime && <>&nbsp; · Uptime: <strong>{fmtUptime(stats.uptime)}</strong></>}
                                </p>
                            </div>
                            <Wifi size={16} color={stats.connection.status === 'Connected' ? '#16a34a' : '#dc2626'} style={{ marginLeft: 'auto' }} />
                        </div>

                        {/* Stat Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                            <StatCard icon={<Package />} label="Products" value={stats.counts.products} color="#6366f1" />
                            <StatCard icon={<ShoppingCart />} label="Orders" value={stats.counts.orders} color="#f59e0b" />
                            <StatCard icon={<Users />} label="Customers" value={stats.counts.users} color="#10b981" />
                            <StatCard icon={<Tag />} label="Categories" value={stats.counts.categories} color="#ec4899" />
                        </div>

                        {/* Collections Table */}
                        <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: '14px', overflow: 'hidden' }}>
                            <div style={{ padding: '16px 22px', borderBottom: '1px solid #e8eaed', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <HardDrive size={16} color="#6366f1" />
                                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Collections</h2>
                                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>{stats.collections.length} collections</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e8eaed' }}>
                                            {['Collection', 'Documents', 'Data Size', 'Storage'].map(h => (
                                                <th key={h} style={{ padding: '11px 20px', fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f9fafb' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.collections
                                            .sort((a, b) => b.count - a.count)
                                            .map((col, idx) => (
                                                <tr key={col.name} className="col-row" style={{ borderBottom: idx < stats.collections.length - 1 ? '1px solid #f3f4f6' : 'none', transition: 'background 0.12s' }}>
                                                    <td style={{ padding: '12px 20px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                                                            <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#111827', fontFamily: 'monospace' }}>{col.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>{col.count.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6b7280' }}>{fmtBytes(col.size)}</td>
                                                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6b7280' }}>{fmtBytes(col.storageSize)}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Refresh note */}
                        <p style={{ fontSize: '11.5px', color: '#c4b5fd', textAlign: 'center', margin: 0 }}>
                            Stats auto-refresh every 30 seconds. Last fetched: {new Date().toLocaleTimeString()}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDatabase;
