import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminUsers } from '../api/settings';
import { Users, Search, Mail, Phone, Calendar, User } from 'lucide-react';

const AdminCustomers = () => {
    const [search, setSearch] = useState('');
    const { data: users = [], isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: getAdminUsers });

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    );

    const s = {
        page: { height: '100%', overflowY: 'auto', padding: '28px 32px', background: '#f5f6fa', fontFamily: "'Inter', system-ui, sans-serif" },
        card: { background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed' },
        th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' },
        td: { padding: '14px 16px', fontSize: '13.5px', color: '#374151', borderBottom: '1px solid #f9fafb', verticalAlign: 'middle' },
    };

    const avatar = (name) => {
        const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
        const colors = ['#dbeafe', '#ede9fe', '#dcfce7', '#fef3c7', '#fce7f3'];
        const textColors = ['#2563eb', '#7c3aed', '#16a34a', '#d97706', '#db2777'];
        const idx = name?.charCodeAt(0) % 5 || 0;
        return { initials, bg: colors[idx], color: textColors[idx] };
    };

    return (
        <div style={s.page}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={18} color="#6366f1" />
                        </div>
                        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>Customers</h1>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginLeft: '46px' }}>
                        {users.length} registered customer{users.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', minWidth: '260px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    <input
                        type="text" placeholder="Search by name, email, phone…"
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', color: '#111827', outline: 'none', fontFamily: 'inherit' }}
                    />
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Total Customers', value: users.length, color: '#6366f1', bg: '#eef2ff' },
                    { label: 'This Month', value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 3600000)).length, color: '#16a34a', bg: '#dcfce7' },
                    { label: 'With Phone', value: users.filter(u => u.phone).length, color: '#d97706', bg: '#fef3c7' },
                ].map((stat) => (
                    <div key={stat.label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8eaed', padding: '16px 20px' }}>
                        <p style={{ fontSize: '24px', fontWeight: '800', color: stat.color, margin: '0 0 4px' }}>{stat.value}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={s.card}>
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                        <div style={{ width: '28px', height: '28px', border: '3px solid #e5e7eb', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                        Loading customers…
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
                        <User size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 4px', color: '#6b7280' }}>No customers found</p>
                        <p style={{ fontSize: '13px', margin: 0 }}>{search ? 'Try a different search term' : 'No registered users yet'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f9fafb' }}>
                                <tr>
                                    <th style={s.th}>Customer</th>
                                    <th style={s.th}>Email</th>
                                    <th style={s.th}>Phone</th>
                                    <th style={s.th}>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user) => {
                                    const av = avatar(user.name);
                                    return (
                                        <tr key={user._id} style={{ transition: 'background 0.1s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                            onMouseLeave={e => e.currentTarget.style.background = ''}
                                        >
                                            <td style={s.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: av.bg, color: av.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                                                        {av.initials}
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#111827' }}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td style={s.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#6b7280' }}>
                                                    <Mail size={13} />
                                                    <a href={`mailto:${user.email}`} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px' }}>{user.email}</a>
                                                </div>
                                            </td>
                                            <td style={s.td}>
                                                {user.phone ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#6b7280' }}>
                                                        <Phone size={13} />
                                                        {user.phone}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#d1d5db', fontSize: '13px' }}>—</span>
                                                )}
                                            </td>
                                            <td style={s.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#9ca3af', fontSize: '13px' }}>
                                                    <Calendar size={13} />
                                                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
