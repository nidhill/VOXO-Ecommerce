import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../api/coupons';
import { Plus, Trash2, Loader2, Tag, X, Edit3, Copy, Check, Ticket } from 'lucide-react';

const AdminCoupons = () => {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent' }}>
            <style>{`
                .coup-input { 
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 10px; padding: 12px 16px; color: #f4f4f5; 
                    font-size: 14px; outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box;
                }
                .coup-input:focus { 
                    border-color: rgba(99,102,241,0.5); 
                    background: rgba(99,102,241,0.05);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .coup-input::placeholder { color: #52525b; }
                
                .coup-card {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px; padding: 24px; transition: all 0.2s ease;
                    display: flex; flex-direction: column; position: relative; overflow: hidden;
                }
                .coup-card:hover {
                    background: rgba(255,255,255,0.04); border-color: rgba(99,102,241,0.3);
                    transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }
                .coup-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
                    background: linear-gradient(180deg, #6366f1, #8b5cf6);
                    opacity: 0; transition: opacity 0.2s ease;
                }
                .coup-card:hover::before { opacity: 1; }
                
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px); z-index: 100;
                    display: flex; align-items: center; justify-content: center;
                    animation: fadeIn 0.2s ease; padding: 20px;
                }
                .modal-content {
                    background: #12121a; border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px; width: 100%; max-width: 440px;
                    animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
            `}</style>
            
            {/* Header */}
            <header className="admin-header" style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', color: '#f4f4f5' }}>Coupons</h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>{coupons.length} total · <span style={{ color: '#34d399' }}>{activeCoupons} active</span></p>
                </div>
                <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Plus size={16} /> <span>Create Coupon</span>
                </button>
            </header>

            {/* Content */}
            <div className="admin-body" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : coupons.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>
                            <Ticket size={32} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#f4f4f5' }}>No coupons yet</h3>
                        <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>Create discount codes to boost sales.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {coupons.map(coupon => {
                            const expired = isExpired(coupon.expiryDate);
                            return (
                                <div key={coupon._id} className="coup-card">
                                    {/* Code + Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <button onClick={() => copyCode(coupon.code)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', transition: 'all 0.15s' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                        >
                                            <span style={{ fontSize: '15px', fontFamily: 'monospace', fontWeight: 700, color: '#f4f4f5', letterSpacing: '2px' }}>{coupon.code}</span>
                                            {copiedCode === coupon.code ? <Check size={14} color="#34d399" /> : <Copy size={14} color="#a1a1aa" />}
                                        </button>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <button onClick={() => openEdit(coupon)} style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', transition: 'all 0.15s', display: 'flex' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#818cf8'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#a1a1aa'; }}
                                            ><Edit3 size={16} /></button>
                                            <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(coupon._id); }} style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', transition: 'all 0.15s', display: 'flex' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#a1a1aa'; }}
                                            ><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    {/* Discount */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' }}>
                                        <span style={{ fontSize: '36px', fontWeight: 800, color: '#f4f4f5', lineHeight: 1, letterSpacing: '-0.02em' }}>{coupon.discountPercentage}</span>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#a1a1aa' }}>% OFF</span>
                                    </div>

                                    {/* Footer */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                                        <div>
                                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Expires</p>
                                            <p style={{ fontSize: '13px', fontWeight: 600, color: expired ? '#f87171' : '#a1a1aa', margin: 0 }}>
                                                {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <button onClick={() => !expired && toggleActive.mutate({ id: coupon._id, isActive: !coupon.isActive })} disabled={expired}
                                            style={{
                                                fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', cursor: expired ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                                                background: expired ? 'rgba(239,68,68,0.1)' : coupon.isActive ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                                                color: expired ? '#f87171' : coupon.isActive ? '#34d399' : '#a1a1aa',
                                                border: `1px solid ${expired ? 'rgba(239,68,68,0.2)' : coupon.isActive ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.1)'}`,
                                            }}
                                        >
                                            {expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="modal-content">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                            <button onClick={closeModal} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f4f4f5'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#a1a1aa'; }}
                            ><X size={18} /></button>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>Coupon Code *</label>
                                <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="SAVE20" disabled={!!editingCoupon}
                                    className="coup-input" style={{ fontFamily: 'monospace', letterSpacing: '3px', textTransform: 'uppercase', opacity: editingCoupon ? 0.5 : 1, fontSize: '16px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>Discount % *</label>
                                <input type="number" min="0" max="100" value={formData.discountPercentage} onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })} placeholder="20"
                                    className="coup-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>Expiry Date *</label>
                                <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="coup-input" style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                        <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={closeModal} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#a1a1aa', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#f4f4f5'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            >Cancel</button>
                            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}
                                style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s', opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                                onMouseEnter={e => { if(!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { if(!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                                {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
