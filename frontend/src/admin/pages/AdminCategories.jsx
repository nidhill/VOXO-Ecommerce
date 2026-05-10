import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, deleteCategory, editCategory } from '../api/categories';
import { getProducts } from '../api/products';
import { Plus, Trash2, Tag, Loader2, AlertCircle, CheckCircle2, Search, Edit2, X, Package } from 'lucide-react';

const AdminCategories = () => {
    const [newCat, setNewCat] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [editName, setEditName] = useState('');
    const queryClient = useQueryClient();

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
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

    const editMutation = useMutation({
        mutationFn: ({ id, name }) => editCategory(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setEditModal(null);
            showToast('Category updated successfully!');
        },
        onError: (err) => {
            showToast(err?.response?.data?.message || 'Failed to update category', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setDeleteModal(null);
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

    const handleEditSubmit = () => {
        const trimmed = editName.trim();
        if (!trimmed || !editModal) return;
        if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c._id !== editModal._id)) {
            showToast('Category already exists', 'error');
            return;
        }
        editMutation.mutate({ id: editModal._id, name: trimmed });
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getProductCount = (categoryName) => {
        return products.filter(p => p.category === categoryName).length;
    };

    return (
        <div className="cat-page">
            <style>{`
                .cat-page { 
                    display: flex; flex-direction: column; height: 100%; 
                    font-family: 'Inter', system-ui, sans-serif; 
                    background: transparent; color: #f4f4f5; 
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                
                .cat-card {
                    display: flex; flex-direction: column; gap: 12px; padding: 20px;
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px; transition: all 0.2s ease;
                    position: relative; overflow: hidden;
                }
                .cat-card:hover {
                    background: rgba(255,255,255,0.04); border-color: rgba(99,102,241,0.3);
                    transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }
                .cat-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
                    background: linear-gradient(180deg, #6366f1, #8b5cf6);
                    opacity: 0; transition: opacity 0.2s ease;
                }
                .cat-card:hover::before { opacity: 1; }
                
                .cat-btn {
                    padding: 8px; border: none; background: rgba(255,255,255,0.05); 
                    cursor: pointer; color: #a1a1aa; border-radius: 8px; 
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.15s;
                }
                .cat-btn:hover { background: rgba(255,255,255,0.1); color: #f4f4f5; }
                .cat-btn.edit:hover { background: rgba(99,102,241,0.15); color: #818cf8; }
                .cat-btn.del:hover { background: rgba(239,68,68,0.15); color: #f87171; }
                
                .cat-input { 
                    flex: 1; background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; 
                    padding: 12px 16px; font-size: 14px; color: #f4f4f5; 
                    outline: none; font-family: inherit; transition: all 0.2s; 
                }
                .cat-input:focus { 
                    border-color: rgba(99,102,241,0.5); 
                    background: rgba(99,102,241,0.05);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .cat-input::placeholder { color: #52525b; }
                
                .cat-add-btn { 
                    background: linear-gradient(135deg, #6366f1, #8b5cf6); 
                    color: #fff; border: none; border-radius: 10px; 
                    padding: 12px 24px; font-size: 14px; font-weight: 600; 
                    cursor: pointer; display: flex; align-items: center; gap: 8px; 
                    transition: all 0.2s; white-space: nowrap; 
                }
                .cat-add-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
                .cat-add-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                
                .toast { 
                    position: fixed; bottom: 28px; right: 28px; padding: 14px 20px; 
                    border-radius: 12px; font-size: 14px; font-weight: 500; 
                    display: flex; align-items: center; gap: 10px; 
                    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 9999; 
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3); backdrop-filter: blur(10px);
                }
                .toast-success { background: rgba(22,163,74,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
                .toast-error { background: rgba(220,38,38,0.15); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
                
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px); z-index: 100;
                    display: flex; items-center; justify-content: center;
                    animation: fadeIn 0.2s ease;
                }
                .modal-content {
                    background: #12121a; border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px; padding: 24px; width: 100%; max-width: 400px;
                    animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
            `}</style>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {toast.msg}
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="modal-overlay" style={{ alignItems: 'center' }} onClick={(e) => { if (e.target === e.currentTarget) setDeleteModal(null); }}>
                    <div className="modal-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>Delete Category</h3>
                                <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '2px 0 0 0' }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#d4d4d8', marginBottom: '24px', lineHeight: 1.5 }}>
                            Are you sure you want to delete the category <strong>"{deleteModal.name}"</strong>? 
                            Products in this category will not be deleted.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setDeleteModal(null)}
                                style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: '#f4f4f5', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => deleteMutation.mutate(deleteModal._id)}
                                disabled={deleteMutation.isPending}
                                style={{ padding: '10px 16px', background: '#dc2626', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {deleteMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="modal-overlay" style={{ alignItems: 'center' }} onClick={(e) => { if (e.target === e.currentTarget) setEditModal(null); }}>
                    <div className="modal-content">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>Edit Category</h3>
                            <button onClick={() => setEditModal(null)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '8px', fontWeight: 500 }}>Category Name</label>
                            <input 
                                type="text" className="cat-input" style={{ width: '100%', boxSizing: 'border-box' }}
                                value={editName} onChange={e => setEditName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleEditSubmit()}
                                autoFocus
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setEditModal(null)}
                                style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: '#f4f4f5', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleEditSubmit}
                                disabled={editMutation.isPending || !editName.trim()}
                                style={{ padding: '10px 16px', background: '#6366f1', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {editMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Categories
                    </h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>
                        Manage product categories and collections
                    </p>
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
                {/* Add new */}
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '24px', marginBottom: '32px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#d4d4d8', marginBottom: '16px' }}>Add New Category</p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <input
                            className="cat-input"
                            type="text"
                            value={newCat}
                            onChange={e => setNewCat(e.target.value)}
                            placeholder="e.g. Accessories"
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            style={{ minWidth: '250px' }}
                        />
                        <button className="cat-add-btn" onClick={handleAdd} disabled={addMutation.isPending || !newCat.trim()}>
                            {addMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
                            Create Category
                        </button>
                    </div>
                </div>

                {/* List Container */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                            All Categories <span style={{ fontSize: '13px', fontWeight: 500, color: '#71717a', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '20px', marginLeft: '8px' }}>{categories.length}</span>
                        </p>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                            <input 
                                type="text" 
                                className="cat-input" 
                                placeholder="Search categories..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '40px', paddingRight: '16px', width: '260px' }}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                            <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : categories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#818cf8' }}>
                                <Tag size={32} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: '0 0 8px 0' }}>No categories yet</h3>
                            <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>Create your first category to start organizing your products.</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a', fontSize: '14px' }}>
                            No categories found matching "{searchQuery}"
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                            {filteredCategories.map(cat => {
                                const count = getProductCount(cat.name);
                                const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                
                                return (
                                    <div key={cat._id} className="cat-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa' }}>
                                                    <Tag size={16} />
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#f4f4f5', margin: '0 0 2px 0' }}>{cat.name}</h4>
                                                    <p style={{ fontSize: '12px', color: '#71717a', margin: 0, fontFamily: 'monospace' }}>/category/{slug}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#a1a1aa', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '20px' }}>
                                                <Package size={12} />
                                                {count} product{count !== 1 ? 's' : ''}
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button 
                                                    className="cat-btn edit" 
                                                    onClick={() => { setEditName(cat.name); setEditModal(cat); }}
                                                    title="Edit Category"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button 
                                                    className="cat-btn del" 
                                                    onClick={() => setDeleteModal(cat)}
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
