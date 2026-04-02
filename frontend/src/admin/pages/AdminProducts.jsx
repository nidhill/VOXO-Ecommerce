import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../api/products';
import { Search, Plus, Upload, X, Loader2, Trash2, Eye, EyeOff, Edit3, Image as ImageIcon, Package } from 'lucide-react';

const CATEGORIES = ['Shoe', 'Slipper', 'Sandal', 'Watch', 'Perfume', 'Belt', 'Shirt', 'Jacket', 'Tshirt', 'Pants', 'Joggers', 'Sunglasses', 'Socks', 'Other'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];

const Products = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [formData, setFormData] = useState({
        name: '', gender: 'Men', category: 'Shoe', price: '', discountPrice: '', description: '', images: [], isHidden: false
    });
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });

    const createMutation = useMutation({ mutationFn: createProduct, onSuccess: () => { queryClient.invalidateQueries(['products']); closeModal(); } });
    const updateMutation = useMutation({ mutationFn: ({ id, data }) => updateProduct(id, data), onSuccess: () => { queryClient.invalidateQueries(['products']); closeModal(); } });
    const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess: () => queryClient.invalidateQueries(['products']) });
    const toggleVisibility = useMutation({ mutationFn: ({ id, isHidden }) => updateProduct(id, { isHidden }), onSuccess: () => queryClient.invalidateQueries(['products']) });

    const openCreate = () => { setEditingProduct(null); setFormData({ name: '', gender: 'Men', category: 'Shoe', price: '', discountPrice: '', description: '', images: [], isHidden: false }); setIsModalOpen(true); };
    const openEdit = (p) => { setEditingProduct(p); setFormData({ name: p.name, gender: p.gender, category: p.category, price: p.price.toString(), discountPrice: p.discountPrice?.toString() || '', description: p.description, images: p.images || [], isHidden: p.isHidden }); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingProduct(null); };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        try {
            const newImages = [];
            for (const file of files) {
                // Create local preview immediately
                const localPreview = URL.createObjectURL(file);
                // Also upload to R2 in background
                let remoteUrl = localPreview;
                try {
                    remoteUrl = await uploadImage(file);
                } catch (uploadErr) {
                    console.warn('R2 upload failed, using local preview:', uploadErr);
                }
                newImages.push(remoteUrl);
            }
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
        catch (err) { alert('Image upload failed'); }
        finally { setUploading(false); }
    };


    const handleSubmit = () => {
        const data = { ...formData, price: Number(formData.price), discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined };
        if (!data.name || !data.price || !data.description || data.images.length === 0) { alert('Fill all required fields and upload at least one image'); return; }
        if (editingProduct) updateMutation.mutate({ id: editingProduct._id, data });
        else createMutation.mutate(data);
    };

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = !filterCategory || p.category === filterCategory;
        return matchSearch && matchCat;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0a0a' }}>
            <style>{`
                @media (max-width: 640px) {
                    .products-header { padding: 16px !important; flex-wrap: wrap !important; gap: 10px !important; }
                    .products-controls { width: 100% !important; flex-wrap: wrap !important; }
                    .products-search { flex: 1 !important; min-width: 0 !important; }
                    .products-search input { width: 100% !important; }
                    .products-controls select { flex: 1 !important; min-width: 120px !important; }
                    .products-add-btn span { display: none; }
                    .products-body { padding: 16px !important; }
                    .products-modal-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
            {/* Header */}
            <header className="products-header" style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fafafa', margin: 0, letterSpacing: '-0.3px' }}>Products</h1>
                    <p style={{ fontSize: '13px', color: '#52525b', marginTop: '2px' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="products-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="products-search" style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
                        <input
                            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            style={{ width: '220px', background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px 9px 36px', color: '#e5e5e5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>
                    <select
                        value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                        style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', color: '#a1a1aa', fontSize: '13px', outline: 'none', cursor: 'pointer', appearance: 'auto' }}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={openCreate} className="products-add-btn" style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                        onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                    >
                        <Plus size={15} /> <span>Add Product</span>
                    </button>
                </div>
            </header>

            {/* Table */}
            <div className="products-body" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '10px' }}>
                        <Package size={32} color="#27272a" />
                        <p style={{ color: '#52525b', fontSize: '14px', fontWeight: 500 }}>No products found</p>
                    </div>
                ) : (
                    <div style={{ background: '#111113', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Product', 'Category', 'Gender', 'Price', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(255,255,255,0.02)', ...(h === 'Actions' ? { textAlign: 'right' } : {}) }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((product, idx) => (
                                    <tr key={product._id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {/* Product */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '42px', height: '42px', borderRadius: '10px', overflow: 'hidden', background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {product.images?.[0] ? <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={14} color="#3f3f46" />}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#fafafa', margin: 0 }}>{product.name}</p>
                                                    <p style={{ fontSize: '11px', color: '#3f3f46', margin: '2px 0 0 0', fontFamily: 'monospace' }}>#{product._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Category */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)' }}>{product.category}</span>
                                        </td>
                                        {/* Gender */}
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#a1a1aa' }}>{product.gender}</td>
                                        {/* Price */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fafafa' }}>₹{product.price}</span>
                                                {product.discountPrice && <span style={{ fontSize: '12px', color: '#52525b', textDecoration: 'line-through' }}>₹{product.discountPrice}</span>}
                                            </div>
                                        </td>
                                        {/* Status */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <button onClick={() => toggleVisibility.mutate({ id: product._id, isHidden: !product.isHidden })}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
                                                    background: product.isHidden ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)',
                                                    color: product.isHidden ? '#fbbf24' : '#4ade80',
                                                    borderColor: product.isHidden ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                                                }}
                                            >
                                                {product.isHidden ? <><EyeOff size={12} /> Hidden</> : <><Eye size={12} /> Visible</>}
                                            </button>
                                        </td>
                                        {/* Actions */}
                                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                <button onClick={() => openEdit(product)} style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', transition: 'all 0.15s', display: 'flex' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#818cf8'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#52525b'; }}
                                                ><Edit3 size={15} /></button>
                                                <button onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product._id); }} style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', transition: 'all 0.15s', display: 'flex' }}
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

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: '#111113', zIndex: 10, borderRadius: '16px 16px 0 0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fafafa', margin: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={closeModal} style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fafafa'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#71717a'; }}
                            ><X size={18} /></button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Images */}
                            <FieldGroup label="Product Images *">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {formData.images.map((url, i) => (
                                        <div key={i} style={{ position: 'relative', width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }))}
                                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                            ><X size={14} color="#f87171" /></button>
                                        </div>
                                    ))}
                                    <label style={{ width: '72px', height: '72px', border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', gap: '2px' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {uploading ? <Loader2 size={16} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} /> : <><Upload size={14} color="#52525b" /><span style={{ fontSize: '9px', color: '#52525b', fontWeight: 600 }}>Upload</span></>}
                                        <input type="file" style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" multiple />
                                    </label>
                                </div>
                            </FieldGroup>

                            {/* Name */}
                            <FieldGroup label="Product Name *">
                                <ModalInput type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Nike Air Max 90" />
                            </FieldGroup>

                            {/* Category + Gender */}
                            <div className="products-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <FieldGroup label="Category *">
                                    <ModalSelect value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} options={CATEGORIES} />
                                </FieldGroup>
                                <FieldGroup label="Gender *">
                                    <ModalSelect value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} options={GENDERS} />
                                </FieldGroup>
                            </div>

                            {/* Price */}
                            <div className="products-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <FieldGroup label="Price (₹) *">
                                    <ModalInput type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="1999" />
                                </FieldGroup>
                                <FieldGroup label="Discount Price (₹)">
                                    <ModalInput type="number" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} placeholder="999 (optional)" />
                                </FieldGroup>
                            </div>

                            {/* Description */}
                            <FieldGroup label="Description *">
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Product description..."
                                    style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#e5e5e5', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </FieldGroup>

                            {/* Hidden Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#18181b', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#fafafa', margin: 0 }}>Hidden from store</p>
                                    <p style={{ fontSize: '11px', color: '#52525b', margin: '2px 0 0 0' }}>Product won't appear on the storefront</p>
                                </div>
                                <button onClick={() => setFormData(prev => ({ ...prev, isHidden: !prev.isHidden }))}
                                    style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', background: formData.isHidden ? '#6366f1' : '#3f3f46', flexShrink: 0 }}
                                >
                                    <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', transition: 'left 0.2s', left: formData.isHidden ? '23px' : '3px' }} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: '10px', position: 'sticky', bottom: 0, background: '#111113', borderRadius: '0 0 16px 16px' }}>
                            <button onClick={closeModal} style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 500, color: '#71717a', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fafafa'}
                                onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                            >Cancel</button>
                            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending || uploading}
                                style={{ padding: '9px 22px', fontSize: '13px', fontWeight: 600, color: 'white', background: '#6366f1', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s', opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1 }}
                                onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                                onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FieldGroup = ({ label, children }) => (
    <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#71717a', marginBottom: '6px', letterSpacing: '0.3px' }}>{label}</label>
        {children}
    </div>
);

const ModalInput = ({ ...props }) => (
    <input {...props}
        style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#e5e5e5', fontSize: '13px', outline: 'none', boxSizing: 'border-box', ...(props.style || {}) }}
        onFocus={e => { e.target.style.borderColor = '#6366f1'; props.onFocus?.(e); }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; props.onBlur?.(e); }}
    />
);

const ModalSelect = ({ options, ...props }) => (
    <select {...props}
        style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#e5e5e5', fontSize: '13px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', appearance: 'auto' }}
    >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
);

export default Products;
