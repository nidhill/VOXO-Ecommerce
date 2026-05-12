import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDbStats } from '../api/categories';
import { Database, Server, HardDrive, Package, ShoppingCart, Users, Tag, Loader2, RefreshCw, Wifi, Activity } from 'lucide-react';

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

const StatCard = ({ icon, label, value, color = '#6366f1', bg = 'rgba(99,102,241,0.15)', sub }) => (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {React.cloneElement(icon, { size: 22, color })}
        </div>
        <div>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#f4f4f5', margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '6px 0 0 0', fontWeight: 500 }}>{label}</p>
            {sub && <p style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 0 0' }}>{sub}</p>}
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); } 50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); } }
                @keyframes pulseGlowErr { 0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 50% { box-shadow: 0 0 0 4px rgba(239,68,68,0); } }
                .db-row { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
                .db-row:hover { background: rgba(255,255,255,0.02); }
                @media (max-width: 768px) {
                    .db-header { padding: 16px !important; flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
                    .db-body { padding: 16px !important; }
                }
            `}</style>

            {/* Header */}
            <header className="admin-header db-header" style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Database</h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>
                        MongoDB • Live collection stats and health
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#f4f4f5', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none', color: '#a1a1aa' }} />
                    Refresh
                </button>
            </header>

            <div className="admin-body db-body" style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px', color: '#71717a' }}>
                        <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: '14px' }}>Fetching database metrics...</span>
                    </div>
                ) : error ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', background: 'rgba(239,68,68,0.05)', border: '1px dashed rgba(239,68,68,0.2)', borderRadius: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={24} />
                        </div>
                        <p style={{ color: '#f87171', fontSize: '15px', fontWeight: 600, margin: 0 }}>Connection Error</p>
                        <p style={{ color: '#fca5a5', fontSize: '13px', margin: 0 }}>Could not load database stats. Check your network.</p>
                    </div>
                ) : (
                    <>
                        {/* Connection Banner */}
                        <div style={{ background: stats.connection.status === 'Connected' ? 'rgba(52,211,153,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${stats.connection.status === 'Connected' ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: stats.connection.status === 'Connected' ? '#34d399' : '#f87171', flexShrink: 0, animation: stats.connection.status === 'Connected' ? 'pulseGlow 2s infinite' : 'pulseGlowErr 2s infinite' }} />
                            <div>
                                <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: stats.connection.status === 'Connected' ? '#34d399' : '#f87171' }}>
                                    {stats.connection.status}
                                </p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa' }}>
                                    {stats.connection.host} &nbsp;/&nbsp; <strong style={{ color: '#f4f4f5' }}>{stats.connection.dbName}</strong>
                                    {stats.uptime && <>&nbsp; · Uptime: <strong style={{ color: '#f4f4f5' }}>{fmtUptime(stats.uptime)}</strong></>}
                                </p>
                            </div>
                            <Wifi size={20} color={stats.connection.status === 'Connected' ? '#34d399' : '#f87171'} style={{ marginLeft: 'auto' }} />
                        </div>

                        {/* Stat Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                            <StatCard icon={<Package />} label="Total Products" value={stats.counts.products} color="#818cf8" bg="rgba(99,102,241,0.15)" />
                            <StatCard icon={<ShoppingCart />} label="Total Orders" value={stats.counts.orders} color="#fbbf24" bg="rgba(251,191,36,0.15)" />
                            <StatCard icon={<Users />} label="Registered Users" value={stats.counts.users} color="#34d399" bg="rgba(52,211,153,0.15)" />
                            <StatCard icon={<Tag />} label="Categories" value={stats.counts.categories} color="#f472b6" bg="rgba(236,72,153,0.15)" />
                        </div>

                        {/* Collections Table */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa' }}>
                                    <HardDrive size={16} />
                                </div>
                                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f4f4f5', margin: 0 }}>Collections Overview</h2>
                                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#71717a', fontWeight: 500, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>{stats.collections.length} collections</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            {['Collection', 'Documents', 'Data Size', 'Storage'].map(h => (
                                                <th key={h} style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.01)' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.collections
                                            .sort((a, b) => b.count - a.count)
                                            .map((col) => (
                                                <tr key={col.name} className="db-row">
                                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{col.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#e4e4e7', fontWeight: 600, whiteSpace: 'nowrap' }}>{col.count.toLocaleString()}</td>
                                                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{fmtBytes(col.size)}</td>
                                                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{fmtBytes(col.storageSize)}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Refresh note */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: '#71717a', margin: '8px 0' }}>
                            <Activity size={14} />
                            <p style={{ fontSize: '12px', margin: 0 }}>
                                Live auto-refreshing every 30 seconds. Last fetched: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDatabase;
