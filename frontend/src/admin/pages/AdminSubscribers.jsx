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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } } 
                @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                
                .sub-input { 
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 10px; padding: 12px 16px; color: #f4f4f5; 
                    font-size: 14px; outline: none; transition: all 0.2s; 
                }
                .sub-input:focus { 
                    border-color: rgba(99,102,241,0.5); 
                    background: rgba(99,102,241,0.05);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .sub-input::placeholder { color: #52525b; }

                .sub-row { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
                .sub-row:hover { background: rgba(255,255,255,0.02); }

                .sub-stat-card {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px; padding: 24px; transition: all 0.2s ease;
                }
                .sub-stat-card:hover {
                    background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1);
                    transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }
            `}</style>

            {toast && (
                <div style={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
                    background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(74,222,128,0.2)',
                    color: '#4ade80', padding: '14px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)', animation: 'slideUp 0.2s ease',
                }}>
                    <CheckCircle size={18} /> {toast.msg}
                </div>
            )}

            {/* Header */}
            <header className="admin-header" style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Email Subscribers</h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>
                        {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} from the newsletter signup
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input
                            type="text" placeholder="Search emails..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="sub-input" style={{ paddingLeft: '40px', minWidth: '240px' }}
                        />
                    </div>
                    {subscribers.length > 0 && (
                        <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#f4f4f5', cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                            <Download size={16} /> Export CSV
                        </button>
                    )}
                </div>
            </header>

            <div className="admin-body" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {[
                        { label: 'Total Subscribers', value: subscribers.length, color: '#818cf8', icon: <Mail size={20} /> },
                        { label: 'This Month', value: subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 3600000)).length, color: '#34d399', icon: <Calendar size={20} /> },
                        { label: 'This Week', value: subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 3600000)).length, color: '#fbbf24', icon: <CheckCircle size={20} /> },
                    ].map((stat) => (
                        <div key={stat.label} className="sub-stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${stat.color}25`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p style={{ fontSize: '32px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{stat.value}</p>
                            <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0, fontWeight: 500 }}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflowX: 'auto' }}>
                    {isLoading ? (
                        <div style={{ padding: '80px', textAlign: 'center', color: '#71717a', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            Loading subscribers...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: '80px', textAlign: 'center', color: '#71717a' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                                <Mail size={32} />
                            </div>
                            <p style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#f4f4f5' }}>No subscribers yet</p>
                            <p style={{ fontSize: '14px', margin: 0 }}>{search ? 'No match for that email' : 'Subscribers from your footer signup form will appear here'}</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.01)' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscribed On</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((sub, idx) => (
                                    <tr key={sub._id} className="sub-row">
                                        <td style={{ padding: '16px 24px', color: '#71717a', fontSize: '13px', width: '48px', whiteSpace: 'nowrap' }}>{idx + 1}</td>
                                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Mail size={16} color="#818cf8" />
                                                </div>
                                                <a href={`mailto:${sub.email}`} style={{ color: '#f4f4f5', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>{sub.email}</a>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                                {sub.source || 'footer'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '14px' }}>
                                                <Calendar size={14} />
                                                {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <button
                                                onClick={() => { if (window.confirm('Remove this subscriber?')) deleteMutation.mutate(sub._id); }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: '8px', borderRadius: '8px', display: 'inline-flex', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.background = 'none'; }}
                                                title="Delete Subscriber"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSubscribers;
