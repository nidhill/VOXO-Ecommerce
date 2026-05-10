import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../api/coupons';
import { Plus, Trash2, Loader2, Tag, X, Edit3, Copy, Check } from 'lucide-react';

const Coupons = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [copiedCode, setCopiedCode] = useState(null);
    const [formData, setFormData] = useState({ code: '', discountPercentage: '', expiryDate: '' });
    const queryClient = useQueryClient();

    const { data: coupons = [], isLoading } = useQuery({ queryKey: ['coupons'], queryFn: getCoupons });
    const createMutation = useMutation({ mutationFn: createCoupon, onSuccess: () => { queryClient.invalidateQueries(['coupons']); closeModal(); }, onError: (err) => alert(err.response?.data?.msg || 'Failed') });
    const updateMutation = useMutation({ mutationFn: ({ id, data }) => updateCoupon(id, data), onSuccess: () => { queryClient.invalidateQueries(['coupons']); closeModal(); } });
    const deleteMutation = useMutation({ mutationFn: deleteCoupon, onSuccess: () => queryClient.invalidateQueries(['coupons']) });
    const toggleActive = useMutation({ mutationFn: ({ id, isActive }) => updateCoupon(id, { isActive }), onSuccess: () => queryClient.invalidateQueries(['coupons']) });

    const openCreate = () => { setEditingCoupon(null); setFormData({ code: '', discountPercentage: '', expiryDate: '' }); setIsModalOpen(true); };
    const openEdit = (c) => { setEditingCoupon(c); setFormData({ code: c.code, discountPercentage: c.discountPercentage.toString(), expiryDate: new Date(c.expiryDate).toISOString().split('T')[0] }); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingCoupon(null); };

    const handleSubmit = () => {
        if (!formData.code || !formData.discountPercentage || !formData.expiryDate) { alert('Fill all fields'); return; }
        const data = { code: formData.code.toUpperCase(), discountPercentage: Number(formData.discountPercentage), expiryDate: new Date(formData.expiryDate) };
        if (editingCoupon) updateMutation.mutate({ id: editingCoupon._id, data });
        else createMutation.mutate(data);
    };

    const copyCode = (code) => { navigator.clipboard.writeText(code); setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000); };
    const isExpired = (date) => new Date(date) < new Date();
    const activeCoupons = coupons.filter(c => c.isActive && !isExpired(c.expiryDate)).length;

    const inputStyle = { width: '100%', background: '#f9fafb', border: '1px solid #e8eaed', borderRadius: '8px', padding: '10px 14px', color: '#111827', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f6fa' }}>
            {/* Header */}
            <header style={{ padding: '24px 32px', borderBottom: '1px solid #e8eaed', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>Coupons</h1>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{coupons.length} total · {activeCoupons} active</p>
                </div>
                <button onClick={openCreate} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                    onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                >
                    <Plus size={15} /> Create Coupon
                </button>
            </header>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : coupons.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '10px' }}>
                        <Tag size={32} color="#27272a" />
                        <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 500, margin: 0 }}>No coupons yet</p>
                        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Create your first discount coupon</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {coupons.map(coupon => {
                            const expired = isExpired(coupon.expiryDate);
                            return (
                                <div key={coupon._id} style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e8eaed', overflow: 'hidden', transition: 'border-color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e8eaed'}
                                >
                                    <div style={{ padding: '20px' }}>
                                        {/* Code + Actions */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <button onClick={() => copyCode(coupon.code)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb', border: '1px solid #e8eaed', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8eaed'}
                                            >
                                                <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#111827', letterSpacing: '1.5px' }}>{coupon.code}</span>
                                                {copiedCode === coupon.code ? <Check size={13} color="#16a34a" /> : <Copy size={13} color="#9ca3af" />}
                                            </button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <button onClick={() => openEdit(coupon)} style={{ padding: '7px', borderRadius: '7px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', transition: 'all 0.15s', display: 'flex' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#818cf8'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9ca3af'; }}
                                                ><Edit3 size={14} /></button>
                                                <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(coupon._id); }} style={{ padding: '7px', borderRadius: '7px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', transition: 'all 0.15s', display: 'flex' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9ca3af'; }}
                                                ><Trash2 size={14} /></button>
                                            </div>
                                        </div>

                                        {/* Discount */}
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
                                            <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{coupon.discountPercentage}</span>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#9ca3af' }}>% OFF</span>
                                        </div>

                                        {/* Footer */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px 0' }}>Expires</p>
                                                <p style={{ fontSize: '13px', fontWeight: 500, color: expired ? '#dc2626' : '#6b7280', margin: 0 }}>
                                                    {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <button onClick={() => !expired && toggleActive.mutate({ id: coupon._id, isActive: !coupon.isActive })} disabled={expired}
                                                style={{
                                                    fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '6px', cursor: expired ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                                                    background: expired ? '#fef2f2' : coupon.isActive ? '#f0fdf4' : '#f9fafb',
                                                    color: expired ? '#dc2626' : coupon.isActive ? '#16a34a' : '#6b7280',
                                                    border: `1px solid ${expired ? '#fecaca' : coupon.isActive ? '#bbf7d0' : '#e5e7eb'}`,
                                                }}
                                            >
                                                {expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e8eaed', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e8eaed' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                            <button onClick={closeModal} style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#111827'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6b7280'; }}
                            ><X size={18} /></button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>Coupon Code *</label>
                                <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="SAVE20" disabled={!!editingCoupon}
                                    style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase', opacity: editingCoupon ? 0.5 : 1 }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = '#e8eaed'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>Discount % *</label>
                                <input type="number" min="0" max="100" value={formData.discountPercentage} onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })} placeholder="20"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = '#e8eaed'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>Expiry Date *</label>
                                <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = '#e8eaed'}
                                />
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e8eaed', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={closeModal} style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 500, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.background = '#f3f4f6'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'none'; }}
                            >Cancel</button>
                            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}
                                style={{ padding: '9px 22px', fontSize: '13px', fontWeight: 600, color: 'white', background: '#6366f1', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s', opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1 }}
                                onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                                onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
