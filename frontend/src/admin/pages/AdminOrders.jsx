import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrder, deleteOrder } from '../api/orders';
import { Search, Trash2, Loader2, ShoppingCart, Eye, X, Package } from 'lucide-react';

const STATUSES = ['Incomplete', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusStyles = {
    Incomplete: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
    Processing: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
    Shipped: { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
    Delivered: { bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.2)' },
    Cancelled: { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
};

const AdminOrders = () => {
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent' }}>
            <style>{`
                @media (max-width: 640px) {
                    .orders-header { padding: 16px !important; flex-wrap: wrap !important; gap: 10px !important; }
                    .orders-controls { width: 100% !important; flex-wrap: wrap !important; }
                    .orders-search { flex: 1 !important; min-width: 0 !important; }
                    .orders-search input { width: 100% !important; }
                    .orders-controls select { flex: 1 !important; min-width: 120px !important; }
                    .orders-body { padding: 16px !important; }
                }
                
                .ord-input { 
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 10px; padding: 12px 16px; color: #f4f4f5; 
                    font-size: 14px; outline: none; transition: all 0.2s; 
                }
                .ord-input:focus { 
                    border-color: rgba(99,102,241,0.5); 
                    background: rgba(99,102,241,0.05);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .ord-input::placeholder { color: #52525b; }
                
                .ord-select {
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 10px; padding: 12px 16px; color: #f4f4f5; 
                    font-size: 14px; outline: none; transition: all 0.2s; cursor: pointer;
                    appearance: auto;
                }
                .ord-select:focus { border-color: rgba(99,102,241,0.5); }
                .ord-select option { background: #12121a; color: #f4f4f5; }
                
                .ord-table-row {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    transition: background 0.15s;
                }
                .ord-table-row:hover { background: rgba(255,255,255,0.02); }
                
                .ord-action-btn {
                    padding: 8px; border-radius: 8px; background: none; border: none; 
                    cursor: pointer; color: #a1a1aa; transition: all 0.15s; display: flex;
                }
                .ord-action-btn:hover { background: rgba(255,255,255,0.05); color: #f4f4f5; }
                .ord-action-btn.view:hover { background: rgba(99,102,241,0.15); color: #818cf8; }
                .ord-action-btn.del:hover { background: rgba(239,68,68,0.15); color: #f87171; }
                
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px); z-index: 100;
                    display: flex; align-items: center; justify-content: center;
                    animation: fadeIn 0.2s ease; padding: 20px;
                }
                .modal-content {
                    background: #12121a; border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px; width: 100%; max-width: 540px;
                    max-height: 85vh; overflow-y: auto;
                    animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
            `}</style>
            
            {/* Header */}
            <header className="orders-header" style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', color: '#f4f4f5' }}>Orders</h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>{filtered.length} orders · ₹{totalRevenue.toLocaleString()} revenue</p>
                </div>
                <div className="orders-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="orders-search" style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search orders..."
                            className="ord-input" style={{ width: '240px', paddingLeft: '40px' }}
                        />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="ord-select">
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </header>

            {/* Table */}
            <div className="orders-body" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>
                            <Package size={32} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: '0 0 4px 0' }}>No orders found</h3>
                        <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>Orders will appear when customers buy products.</p>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.01)', ...(h === 'Actions' ? { textAlign: 'right' } : {}) }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((order) => (
                                    <tr key={order._id} className="ord-table-row">
                                        <td style={{ padding: '16px 24px', fontSize: '13px', fontFamily: 'monospace', color: '#a1a1aa' }}>#{order._id.slice(-8)}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#f4f4f5' }}>{order.customerName}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '13px', color: '#a1a1aa' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <ShoppingCart size={14} /> {order.items?.length || 0} items
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5' }}>₹{order.totalAmount?.toLocaleString()}</span>
                                            {order.couponCode && <span style={{ fontSize: '10px', fontWeight: 600, color: '#c084fc', background: 'rgba(168,85,247,0.1)', padding: '3px 8px', borderRadius: '6px', marginLeft: '8px' }}>{order.couponCode}</span>}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <select value={order.status} onChange={e => updateMutation.mutate({ id: order._id, data: { status: e.target.value } })}
                                                style={{
                                                    fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', outline: 'none', appearance: 'auto',
                                                    background: (statusStyles[order.status] || statusStyles.Incomplete).bg,
                                                    color: (statusStyles[order.status] || statusStyles.Incomplete).color,
                                                    border: `1px solid ${(statusStyles[order.status] || statusStyles.Incomplete).border}`,
                                                }}
                                            >
                                                {STATUSES.map(s => <option key={s} value={s} style={{ background: '#12121a', color: '#f4f4f5' }}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '13px', color: '#71717a' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button className="ord-action-btn view" onClick={() => setViewingOrder(order)} title="View Details"><Eye size={16} /></button>
                                                <button className="ord-action-btn del" onClick={() => { if (confirm('Delete this order?')) deleteMutation.mutate(order._id); }} title="Delete Order"><Trash2 size={16} /></button>
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
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setViewingOrder(null); }}>
                    <div className="modal-content">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Order Details</h2>
                                <p style={{ fontSize: '13px', color: '#71717a', margin: '4px 0 0 0', fontFamily: 'monospace' }}>#{viewingOrder._id}</p>
                            </div>
                            <button onClick={() => setViewingOrder(null)} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f4f4f5'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#a1a1aa'; }}
                            ><X size={18} /></button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <InfoBlock label="Customer" value={viewingOrder.customerName} />
                                <InfoBlock label="Phone" value={viewingOrder.phone || '—'} />
                                <InfoBlock label="Amount" value={`₹${viewingOrder.totalAmount?.toLocaleString()}`} />
                                <InfoBlock label="Status" value={viewingOrder.status} />
                                <InfoBlock label="Date" value={new Date(viewingOrder.createdAt).toLocaleString('en-IN')} />
                                {viewingOrder.address && <InfoBlock label="Address" value={`${viewingOrder.address}, ${viewingOrder.city} - ${viewingOrder.zip}`} />}
                                {viewingOrder.couponCode && <InfoBlock label="Coupon" value={viewingOrder.couponCode} />}
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Order Items</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {viewingOrder.items?.length > 0 ? viewingOrder.items.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa' }}>
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5', margin: 0 }}>{item.name}</p>
                                                    <p style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 0 0' }}>Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '15px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    )) : <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>No items</p>}
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
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px 0' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#e4e4e7', margin: 0 }}>{value}</p>
    </div>
);

export default AdminOrders;
