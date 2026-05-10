import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminSubscribers, deleteSubscriber } from '../api/settings';
import { Mail, Search, Trash2, Download, Calendar, CheckCircle } from 'lucide-react';

const AdminSubscribers = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);

    const { data: subscribers = [], isLoading } = useQuery({ queryKey: ['admin-subscribers'], queryFn: getAdminSubscribers });

    const deleteMutation = useMutation({
        mutationFn: deleteSubscriber,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subscribers'] });
            setToast({ msg: 'Subscriber removed', type: 'success' });
            setTimeout(() => setToast(null), 3000);
        },
    });

    const filtered = subscribers.filter(s => s.email?.toLowerCase().includes(search.toLowerCase()));

    const exportCSV = () => {
        const rows = [['Email', 'Subscribed On'], ...subscribers.map(s => [s.email, new Date(s.createdAt).toLocaleDateString('en-IN')])];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'wavway-subscribers.csv';
        a.click();
    };

    const s = {
        page: { height: '100%', overflowY: 'auto', padding: '28px 32px', background: '#f5f6fa', fontFamily: "'Inter', system-ui, sans-serif" },
        card: { background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed' },
        th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', borderBottom: '1px solid #f3f4f6' },
        td: { padding: '14px 16px', fontSize: '13.5px', color: '#374151', borderBottom: '1px solid #f9fafb', verticalAlign: 'middle' },
    };

    return (
        <div style={s.page}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                    background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0',
                    padding: '12px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', animation: 'slideUp 0.2s ease',
                }}>
                    <CheckCircle size={15} /> {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Mail size={18} color="#6366f1" />
                        </div>
                        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>Email Subscribers</h1>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginLeft: '46px' }}>
                        {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} from the newsletter signup
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                        <input
                            type="text" placeholder="Search emails…"
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: '10px 14px 10px 34px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', color: '#111827', outline: 'none', fontFamily: 'inherit', minWidth: '220px' }}
                        />
                    </div>
                    {subscribers.length > 0 && (
                        <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                            <Download size={14} /> Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Total Subscribers', value: subscribers.length, color: '#6366f1' },
                    { label: 'This Month', value: subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 3600000)).length, color: '#16a34a' },
                    { label: 'This Week', value: subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 3600000)).length, color: '#d97706' },
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
                        Loading subscribers…
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
                        <Mail size={36} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
                        <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 4px', color: '#6b7280' }}>No subscribers yet</p>
                        <p style={{ fontSize: '13px', margin: 0 }}>{search ? 'No match for that email' : 'Subscribers from your footer signup form will appear here'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f9fafb' }}>
                                <tr>
                                    <th style={s.th}>#</th>
                                    <th style={s.th}>Email Address</th>
                                    <th style={s.th}>Source</th>
                                    <th style={s.th}>Subscribed On</th>
                                    <th style={{ ...s.th, textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((sub, idx) => (
                                    <tr key={sub._id}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                        onMouseLeave={e => e.currentTarget.style.background = ''}
                                    >
                                        <td style={{ ...s.td, color: '#9ca3af', fontSize: '12px', width: '48px' }}>{idx + 1}</td>
                                        <td style={s.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Mail size={13} color="#6366f1" />
                                                </div>
                                                <a href={`mailto:${sub.email}`} style={{ color: '#111827', textDecoration: 'none', fontWeight: '500' }}>{sub.email}</a>
                                            </div>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{ background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                                                {sub.source || 'footer'}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '13px' }}>
                                                <Calendar size={13} />
                                                {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td style={{ ...s.td, textAlign: 'right' }}>
                                            <button
                                                onClick={() => { if (window.confirm('Remove this subscriber?')) deleteMutation.mutate(sub._id); }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '6px', borderRadius: '6px', display: 'inline-flex', transition: 'color 0.15s, background 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#d1d5db'; e.currentTarget.style.background = 'none'; }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSubscribers;
