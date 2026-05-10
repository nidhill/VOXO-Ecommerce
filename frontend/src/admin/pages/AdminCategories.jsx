import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, deleteCategory } from '../api/categories';
import { Plus, Trash2, Tag, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminCategories = () => {
    const [newCat, setNewCat] = useState('');
    const [toast, setToast] = useState(null);
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setNewCat('');
            showToast('Category added successfully!');
        },
        onError: (err) => {
            showToast(err?.response?.data?.message || 'Failed to add category', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            showToast('Category removed.');
        },
        onError: () => showToast('Failed to delete category', 'error'),
    });

    const handleAdd = () => {
        const trimmed = newCat.trim();
        if (!trimmed) return;
        if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
            showToast('Category already exists', 'error');
            return;
        }
        addMutation.mutate(trimmed);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f6fa', overflow: 'hidden' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
                .cat-tag { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #fff; border: 1px solid #e8eaed; border-radius: 10px; transition: all 0.15s; }
                .cat-tag:hover { border-color: #c7d2fe; background: #f0f4ff; }
                .cat-del-btn { margin-left: auto; padding: 6px; border: none; background: none; cursor: pointer; color: #d1d5db; border-radius: 6px; display: flex; transition: all 0.15s; }
                .cat-del-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
                .cat-input { flex: 1; background: #f9fafb; border: 1px solid #e8eaed; border-radius: 8px; padding: 11px 16px; font-size: 14px; color: #111827; outline: none; font-family: inherit; transition: border-color 0.15s; }
                .cat-input:focus { border-color: #6366f1; }
                .cat-add-btn { background: #6366f1; color: #fff; border: none; border-radius: 8px; padding: 11px 20px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: background 0.15s; white-space: nowrap; }
                .cat-add-btn:hover { background: #4f46e5; }
                .cat-add-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .toast { position: fixed; bottom: 28px; right: 28px; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; animation: fadeIn 0.25s ease; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
                .toast-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
                .toast-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
            `}</style>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <header style={{ padding: '24px 32px', borderBottom: '1px solid #e8eaed', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>Categories</h1>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                        {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} configured
                    </p>
                </div>
                <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={18} color="#6366f1" />
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                {/* Add new */}
                <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed', padding: '20px 24px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px', letterSpacing: '0.2px' }}>Add New Category</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            className="cat-input"
                            type="text"
                            value={newCat}
                            onChange={e => setNewCat(e.target.value)}
                            placeholder="e.g. Accessories"
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        />
                        <button className="cat-add-btn" onClick={handleAdd} disabled={addMutation.isPending || !newCat.trim()}>
                            {addMutation.isPending ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={15} />}
                            Add
                        </button>
                    </div>
                </div>

                {/* List */}
                <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8eaed', padding: '20px 24px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
                        Existing Categories
                    </p>

                    {isLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
                            <Loader2 size={24} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : categories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: '14px' }}>
                            <Tag size={28} color="#d1d5db" style={{ marginBottom: '8px' }} />
                            <p>No categories yet. Add your first one above.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                            {categories.map(cat => (
                                <div key={cat._id} className="cat-tag">
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', flex: 1 }}>{cat.name}</span>
                                    <button
                                        className="cat-del-btn"
                                        onClick={() => {
                                            if (confirm(`Remove "${cat.name}"?`)) deleteMutation.mutate(cat._id);
                                        }}
                                        title="Remove"
                                    >
                                        {deleteMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Note */}
                <div style={{ marginTop: '20px', padding: '14px 18px', background: 'rgba(99,102,241,0.06)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <AlertCircle size={15} color="#6366f1" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '12.5px', color: '#4f46e5', margin: 0, lineHeight: 1.6 }}>
                        Categories added here will appear as options when creating or editing products.
                        Removing a category won't affect existing products already tagged with it.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
