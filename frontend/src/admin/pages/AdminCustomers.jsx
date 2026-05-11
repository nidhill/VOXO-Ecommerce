import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminUsers } from '../api/settings';
import { Users, Search, Mail, Phone, Calendar, User, UserPlus, Activity } from 'lucide-react';

const AdminCustomers = () => {
    const [search, setSearch] = useState('');
    const { data: users = [], isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: getAdminUsers });

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    );

    const avatar = (name) => {
        const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
        const colors = ['rgba(99,102,241,0.15)', 'rgba(168,85,247,0.15)', 'rgba(236,72,153,0.15)', 'rgba(251,191,36,0.15)', 'rgba(52,211,153,0.15)'];
        const textColors = ['#818cf8', '#c084fc', '#f472b6', '#fbbf24', '#34d399'];
        const idx = name?.charCodeAt(0) % 5 || 0;
        return { initials, bg: colors[idx], color: textColors[idx] };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent' }}>
            <style>{`
                .cust-input { 
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 10px; padding: 12px 16px; color: #f4f4f5; 
                    font-size: 14px; outline: none; transition: all 0.2s; box-sizing: border-box;
                }
                .cust-input:focus { 
                    border-color: rgba(99,102,241,0.5); 
                    background: rgba(99,102,241,0.05);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .cust-input::placeholder { color: #52525b; }

                .cust-table-row { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
                .cust-table-row:hover { background: rgba(255,255,255,0.02); }

                .cust-stat-card {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px; padding: 24px; transition: all 0.2s ease;
                    display: flex; flex-direction: column; position: relative; overflow: hidden;
                }
                .cust-stat-card:hover {
                    background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1);
                    transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                @media (max-width: 768px) {
                    .cust-header { padding: 16px !important; flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
                    .cust-header .cust-search-wrap { width: 100% !important; }
                    .cust-header .cust-search-wrap input { width: 100% !important; }
                    .cust-body { padding: 16px !important; }
                    .cust-stat-card { padding: 16px; }
                    .cust-stat-card p:first-of-type { font-size: 24px !important; }
                }
            `}</style>
            
            {/* Header */}
            <header className="admin-header cust-header" style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', color: '#f4f4f5' }}>Customers</h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>{users.length} registered customer{users.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="cust-search-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input
                            type="text" placeholder="Search by name, email, phone..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="cust-input"
                            style={{ width: '280px', paddingLeft: '40px' }}
                        />
                    </div>
                </div>
            </header>

            <div className="admin-body cust-body" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {[
                        { label: 'Total Customers', value: users.length, icon: <Users size={20} />, color: '#818cf8', bg: 'rgba(99,102,241,0.15)' },
                        { label: 'New This Month', value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 3600000)).length, icon: <UserPlus size={20} />, color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
                        { label: 'Active Profiles', value: users.filter(u => u.phone).length, icon: <Activity size={20} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
                    ].map((stat) => (
                        <div key={stat.label} className="cust-stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p style={{ fontSize: '32px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{stat.value}</p>
                            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0, fontWeight: 500 }}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    {isLoading ? (
                        <div style={{ padding: '80px', textAlign: 'center', color: '#71717a', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            Loading customers...
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: '80px', textAlign: 'center', color: '#71717a' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                                <User size={32} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#f4f4f5' }}>No customers found</h3>
                            <p style={{ fontSize: '14px', margin: 0 }}>{search ? 'Try adjusting your search term' : 'No registered users yet'}</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Customer', 'Email Address', 'Phone Number', 'Joined Date'].map(h => (
                                        <th key={h} style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.01)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user) => {
                                    const av = avatar(user.name);
                                    return (
                                        <tr key={user._id} className="cust-table-row">
                                            <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: av.bg, color: av.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                                                        {av.initials}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '14px' }}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa' }}>
                                                    <Mail size={14} />
                                                    <a href={`mailto:${user.email}`} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>{user.email}</a>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                                {user.phone ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '14px' }}>
                                                        <Phone size={14} />
                                                        {user.phone}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#52525b', fontSize: '14px' }}>—</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '14px' }}>
                                                    <Calendar size={14} />
                                                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
