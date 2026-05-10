import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnnouncementBar, updateAnnouncementBar } from '../api/settings';
import { Megaphone, Save, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

const AdminAnnouncement = () => {
    const queryClient = useQueryClient();
    const [text, setText] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [toast, setToast] = useState(null);

    const { data } = useQuery({ queryKey: ['announcement-bar'], queryFn: getAnnouncementBar });

    useEffect(() => {
        if (data) {
            setText(data.text || '');
            setEnabled(data.enabled !== false);
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: updateAnnouncementBar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcement-bar'] });
            setToast({ msg: 'Announcement bar saved!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
        },
        onError: () => {
            setToast({ msg: 'Failed to save', type: 'error' });
            setTimeout(() => setToast(null), 3000);
        },
    });

    const s = {
        page: { height: '100%', overflowY: 'auto', padding: '28px 32px', background: '#f5f6fa', fontFamily: "'Inter', system-ui, sans-serif" },
        card: { background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed', padding: '24px', marginBottom: '16px' },
        label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px', letterSpacing: '0.03em' },
        input: { width: '100%', padding: '11px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#111827', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
    };

    return (
        <div style={s.page}>
            <style>{`
                .ann-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; background: #fff !important; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                    background: toast.type === 'success' ? '#dcfce7' : '#fef2f2',
                    color: toast.type === 'success' ? '#16a34a' : '#dc2626',
                    border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                    padding: '12px 18px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    animation: 'slideUp 0.2s ease',
                }}>
                    <CheckCircle size={15} /> {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Megaphone size={18} color="#6366f1" />
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>Announcement Bar</h1>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginLeft: '46px' }}>
                    The black banner shown at the top of every page on your store.
                </p>
            </div>

            {/* Live Preview */}
            <div style={s.card}>
                <p style={{ ...s.label, marginBottom: '12px' }}>Live Preview</p>
                <div style={{
                    background: enabled ? '#111111' : '#d1d5db',
                    borderRadius: '8px', padding: '12px 48px',
                    textAlign: 'center', position: 'relative',
                    transition: 'background 0.3s',
                }}>
                    <p style={{
                        color: enabled ? '#ffffff' : '#9ca3af',
                        fontSize: '11px', fontWeight: '600',
                        letterSpacing: '0.18em', textTransform: 'uppercase',
                        margin: 0,
                    }}>
                        {text || 'Your announcement text will appear here…'}
                    </p>
                    <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: enabled ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontSize: '16px' }}>×</span>
                </div>
                {!enabled && (
                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>
                        ⚠ Announcement bar is currently hidden on the store.
                    </p>
                )}
            </div>

            {/* Settings */}
            <div style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>Settings</p>
                    <button
                        onClick={() => mutation.mutate({ text, enabled })}
                        disabled={mutation.isPending}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            background: '#6366f1', color: '#fff',
                            border: 'none', borderRadius: '9px',
                            padding: '9px 18px', fontSize: '13px', fontWeight: '700',
                            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                            opacity: mutation.isPending ? 0.7 : 1,
                        }}
                    >
                        {mutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Enable toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {enabled ? <Eye size={16} color="#6366f1" /> : <EyeOff size={16} color="#9ca3af" />}
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Show on store</p>
                                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{enabled ? 'Announcement bar is visible to customers' : 'Announcement bar is hidden'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setEnabled(v => !v)}
                            style={{
                                width: '44px', height: '24px', borderRadius: '12px',
                                background: enabled ? '#6366f1' : '#d1d5db',
                                border: 'none', cursor: 'pointer',
                                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                            }}
                        >
                            <span style={{
                                position: 'absolute', top: '3px',
                                left: enabled ? '23px' : '3px',
                                width: '18px', height: '18px', borderRadius: '50%',
                                background: '#fff', transition: 'left 0.2s',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                            }} />
                        </button>
                    </div>

                    {/* Text input */}
                    <div>
                        <label style={s.label}>Announcement Text</label>
                        <input
                            type="text" value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g. FREE SHIPPING ALL OVER INDIA ON ORDERS OVER ₹3000"
                            className="ann-input" style={s.input}
                            maxLength={200}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Tip: Use uppercase for better visibility. Special characters like ₹ are supported.</p>
                            <p style={{ fontSize: '12px', color: text.length > 180 ? '#f59e0b' : '#9ca3af' }}>{text.length}/200</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnnouncement;
