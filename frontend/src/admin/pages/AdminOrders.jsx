import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrder, deleteOrder } from '../api/orders';
import { Search, Trash2, Loader2, ShoppingCart, Eye, X, Package } from 'lucide-react';

const STATUSES = ['Incomplete', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusStyles = {
    Incomplete: { bg: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: 'rgba(245,158,11,0.15)' },
    Processing: { bg: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: 'rgba(59,130,246,0.15)' },
    Shipped: { bg: 'rgba(168,85,247,0.08)', color: '#c084fc', border: 'rgba(168,85,247,0.15)' },
    Delivered: { bg: 'rgba(34,197,94,0.08)', color: '#4ade80', border: 'rgba(34,197,94,0.15)' },
    Cancelled: { bg: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'rgba(239,68,68,0.15)' },
};

const Orders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewingOrder, setViewingOrder] = useState(null);
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: getOrders });
    const updateMutation = useMutation({ mutationFn: ({ id, data }) => updateOrder(id, data), onSuccess: () => queryClient.invalidateQueries(['orders']) });
    const deleteMutation = useMutation({ mutationFn: deleteOrder, onSuccess: () => queryClient.invalidateQueries(['orders']) });

    const filtered = orders.filter(o => {
        const matchSearch = o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || o._id.includes(searchQuery);
        const matchStatus = !filterStatus || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0a0a' }}>
            <style>{`
                @media (max-width: 640px) {
                    .orders-header { padding: 16px !important; flex-wrap: wrap !important; gap: 10px !important; }
                    .orders-controls { width: 100% !important; flex-wrap: wrap !important; }
                    .orders-search { flex: 1 !important; min-width: 0 !important; }
                    .orders-search input { width: 100% !important; }
                    .orders-controls select { flex: 1 !important; min-width: 120px !important; }
                    .orders-body { padding: 16px !important; }
                }
            `}</style>
            {/* Header */}
            <header className="orders-header" style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fafafa', margin: 0, letterSpacing: '-0.3px' }}>Orders</h1>
                    <p style={{ fontSize: '13px', color: '#52525b', marginTop: '2px' }}>{filtered.length} orders · ₹{totalRevenue.toLocaleString()} revenue</p>
                </div>
                <div className="orders-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="orders-search" style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search orders..."
                            style={{ width: '220px', background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px 9px 36px', color: '#e5e5e5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', color: '#a1a1aa', fontSize: '13px', outline: 'none', cursor: 'pointer', appearance: 'auto' }}
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </header>

            {/* Table */}
            <div className="orders-body" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '10px' }}>
                        <Package size={32} color="#27272a" />
                        <p style={{ color: '#52525b', fontSize: '14px', fontWeight: 500, margin: 0 }}>No orders found</p>
                        <p style={{ color: '#3f3f46', fontSize: '13px', margin: 0 }}>Orders will appear when customers buy</p>
                    </div>
                ) : (
                    <div style={{ background: '#111113', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(255,255,255,0.02)', ...(h === 'Actions' ? { textAlign: 'right' } : {}) }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((order, idx) => (
                                    <tr key={order._id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 20px', fontSize: '13px', fontFamily: 'monospace', color: '#71717a' }}>#{order._id.slice(-8)}</td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500, color: '#fafafa' }}>{order.customerName}</td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#a1a1aa' }}>{order.items?.length || 0} items</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fafafa' }}>₹{order.totalAmount}</span>
                                            {order.couponCode && <span style={{ fontSize: '10px', fontWeight: 600, color: '#c084fc', background: 'rgba(168,85,247,0.1)', padding: '2px 7px', borderRadius: '4px', marginLeft: '8px' }}>{order.couponCode}</span>}
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <select value={order.status} onChange={e => updateMutation.mutate({ id: order._id, data: { status: e.target.value } })}
                                                style={{
                                                    fontSize: '11px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', outline: 'none', appearance: 'auto',
                                                    background: (statusStyles[order.status] || statusStyles.Incomplete).bg,
                                                    color: (statusStyles[order.status] || statusStyles.Incomplete).color,
                                                    border: `1px solid ${(statusStyles[order.status] || statusStyles.Incomplete).border}`,
                                                }}
                                            >
                                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#52525b' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                <button onClick={() => setViewingOrder(order)} style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', transition: 'all 0.15s', display: 'flex' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#818cf8'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#52525b'; }}
                                                ><Eye size={15} /></button>
                                                <button onClick={() => { if (confirm('Delete this order?')) deleteMutation.mutate(order._id); }} style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', transition: 'all 0.15s', display: 'flex' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#52525b'; }}
                                                ><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {viewingOrder && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) setViewingOrder(null); }}>
                    <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fafafa', margin: 0 }}>Order Details</h2>
                                <p style={{ fontSize: '12px', color: '#52525b', margin: '2px 0 0 0', fontFamily: 'monospace' }}>#{viewingOrder._id.slice(-8)}</p>
                            </div>
                            <button onClick={() => setViewingOrder(null)} style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fafafa'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#71717a'; }}
                            ><X size={18} /></button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <InfoBlock label="Customer" value={viewingOrder.customerName} />
                                <InfoBlock label="Phone" value={viewingOrder.phone || '—'} />
                                <InfoBlock label="Amount" value={`₹${viewingOrder.totalAmount}`} />
                                <InfoBlock label="Status" value={viewingOrder.status} />
                                <InfoBlock label="Date" value={new Date(viewingOrder.createdAt).toLocaleString('en-IN')} />
                                {viewingOrder.address && <InfoBlock label="Address" value={`${viewingOrder.address}, ${viewingOrder.city} - ${viewingOrder.zip}`} />}
                                {viewingOrder.couponCode && <InfoBlock label="Coupon" value={viewingOrder.couponCode} />}
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Items</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {viewingOrder.items?.length > 0 ? viewingOrder.items.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#18181b', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#fafafa', margin: 0 }}>{item.name}</p>
                                                <p style={{ fontSize: '11px', color: '#52525b', margin: '2px 0 0 0' }}>Qty: {item.quantity}</p>
                                            </div>
                                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#fafafa', margin: 0 }}>₹{item.price * item.quantity}</p>
                                        </div>
                                    )) : <p style={{ fontSize: '13px', color: '#3f3f46', margin: 0 }}>No items</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoBlock = ({ label, value }) => (
    <div>
        <p style={{ fontSize: '10px', fontWeight: 600, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#fafafa', margin: 0 }}>{value}</p>
    </div>
);

export default Orders;
