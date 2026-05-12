import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../api/products';
import { getCategories } from '../api/categories';
import { Search, Plus, Upload, X, Loader2, Trash2, Eye, EyeOff, Edit3, Image as ImageIcon, Package } from 'lucide-react';

const FALLBACK_CATEGORIES = ['Shoes', 'Slippers', 'Sandals', 'Watches', 'Perfumes', 'Belts', 'Shirts', 'Jackets', 'T-Shirts', 'Pants', 'Joggers', 'Sunglasses', 'Socks', 'Other'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];

function proxyImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://localhost:5001')) return url.replace('http://localhost:5001', '');
    const r2Match = url.match(/https?:\/\/[^/]+\.r2\.dev\/(.+)/);
    if (r2Match) return `/api/upload/file/${r2Match[1]}`;
    return url;
}

const AdminProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [formData, setFormData] = useState({
        name: '', gender: 'Men', category: 'Shoes', price: '', discountPrice: '', description: '', images: [], sizes: [], isHidden: false
    });
    const [sizeInput, setSizeInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({ queryKey: ['products', 'admin'], queryFn: () => getProducts({ admin: true }) });
    const { data: catData = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
    const CATEGORIES = catData.length > 0 ? catData.map(c => c.name) : FALLBACK_CATEGORIES;
    const SIZE_CATEGORIES = ['Shoes', 'Slippers', 'Sandals', 'Shirts', 'Jackets', 'T-Shirts', 'Pants', 'Joggers', 'Socks', 'Apparel', 'Clothing'];

    const createMutation = useMutation({ mutationFn: createProduct, onSuccess: () => { queryClient.invalidateQueries(['products']); closeModal(); } });
    const updateMutation = useMutation({ mutationFn: ({ id, data }) => updateProduct(id, data), onSuccess: () => { queryClient.invalidateQueries(['products']); closeModal(); } });
    const deleteMutation = useMutation({ mutationFn: deleteProduct, onSuccess: () => queryClient.invalidateQueries(['products']) });
    const toggleVisibility = useMutation({ mutationFn: ({ id, isHidden }) => updateProduct(id, { isHidden }), onSuccess: () => queryClient.invalidateQueries(['products']) });

    const openCreate = () => { setEditingProduct(null); setFormData({ name: '', gender: 'Men', category: CATEGORIES[0] || 'Shoes', price: '', discountPrice: '', description: '', images: [], sizes: [], isHidden: false }); setSizeInput(''); setIsModalOpen(true); };
    const openEdit = (p) => { setEditingProduct(p); setFormData({ name: p.name, gender: p.gender, category: p.category, price: p.price.toString(), discountPrice: p.discountPrice?.toString() || '', description: p.description, images: p.images || [], sizes: p.sizes || [], isHidden: p.isHidden }); setSizeInput(''); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingProduct(null); };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        try {
            const newImages = [];
            for (const file of files) {
                const localPreview = URL.createObjectURL(file);
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

    const addSize = () => {
        const s = sizeInput.trim().toUpperCase();
        if (!s) return;
        if (formData.sizes.includes(s)) { setSizeInput(''); return; }
        setFormData(prev => ({ ...prev, sizes: [...prev.sizes, s] }));
        setSizeInput('');
    };

    const removeSize = (s) => setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(x => x !== s) }));

    const handleSubmit = () => {
        const data = { ...formData, price: Number(formData.price), discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined };
        if (!data.name || !data.price || !data.description || data.images.length === 0) { alert('Fill all required fields and upload at least one image'); return; }
        if (editingProduct) updateMutation.mutate({ id: editingProduct._id, data });
        else createMutation.mutate(data);
    };

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = !filterCategory || p.category === filterCategory;
        const matchStatus = !filterStatus || (filterStatus === 'active' ? !p.isHidden : p.isHidden);
        return matchSearch && matchCat && matchStatus;
    });

    const hiddenCount = products.filter(p => p.isHidden).length;
    const activeCount = products.length - hiddenCount;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent' }}>
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
                
                .prod-input { 
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 10px; padding: 12px 16px; color: #f4f4f5; 
                    font-size: 14px; outline: none; transition: all 0.2s; 
                }
                .prod-input:focus { 
                    border-color: rgba(99,102,241,0.5); 
                    background: rgba(99,102,241,0.05);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .prod-input::placeholder { color: #52525b; }
                
                .prod-select {
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 10px; padding: 12px 16px; color: #f4f4f5; 
                    font-size: 14px; outline: none; transition: all 0.2s; cursor: pointer;
                    appearance: auto;
                }
                .prod-select:focus { border-color: rgba(99,102,241,0.5); }
                .prod-select option { background: #12121a; color: #f4f4f5; }
                
                .prod-table-row {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    transition: background 0.15s;
                }
                .prod-table-row:hover { background: rgba(255,255,255,0.02); }
                
                .prod-action-btn {
                    padding: 8px; border-radius: 8px; background: none; border: none; 
                    cursor: pointer; color: #a1a1aa; transition: all 0.15s; display: flex;
                }
                .prod-action-btn:hover { background: rgba(255,255,255,0.05); color: #f4f4f5; }
                .prod-action-btn.edit:hover { background: rgba(99,102,241,0.15); color: #818cf8; }
                .prod-action-btn.del:hover { background: rgba(239,68,68,0.15); color: #f87171; }
                
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px); z-index: 100;
                    display: flex; align-items: center; justify-content: center;
                    animation: fadeIn 0.2s ease; padding: 20px;
                }
                .modal-content {
                    background: #12121a; border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px; width: 100%; max-width: 600px;
                    max-height: 85vh; overflow-y: auto;
                    animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    display: flex; flex-direction: column;
                }
            `}</style>

            {/* Header */}
            <header className="products-header admin-header" style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', color: '#f4f4f5' }}>
                        Products
                    </h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>
                        {filtered.length} product{filtered.length !== 1 ? 's' : ''} in your catalog
                    </p>
                </div>
                <div className="products-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="products-search" style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input
                            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="prod-input"
                            style={{ width: '240px', paddingLeft: '40px' }}
                        />
                    </div>
                    <select
                        value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                        className="prod-select"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="prod-select"
                    >
                        <option value="">All Status</option>
                        <option value="active">✅ Active ({activeCount})</option>
                        <option value="hidden">🚫 Hidden ({hiddenCount})</option>
                    </select>
                    <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Plus size={16} /> <span>Add Product</span>
                    </button>
                </div>
            </header>

            {/* Table */}
            <div className="products-body admin-body" style={{ padding: '32px 40px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                        <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>
                            <Package size={32} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: '0 0 4px 0' }}>No products found</h3>
                        <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Product', 'Category', 'Gender', 'Price', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ 
                                            padding: '16px 24px', fontSize: '11px', fontWeight: 600, color: '#71717a', 
                                            textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.01)',
                                            width: h === 'Product' ? '40%' : 'auto',
                                            minWidth: h === 'Product' ? '280px' : h === 'Category' ? '120px' : h === 'Gender' ? '100px' : h === 'Price' ? '100px' : h === 'Status' ? '120px' : 'auto',
                                            ...(h === 'Actions' ? { textAlign: 'right', width: '100px' } : {}) 
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((product) => (
                                    <tr key={product._id} className="prod-table-row">
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {product.images?.[0] ? <img src={proxyImageUrl(product.images[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={18} color="#71717a" />}
                                                </div>
                                                <div style={{ minWidth: '180px' }}>
                                                    <p 
                                                        title={product.name}
                                                        style={{ 
                                                            fontSize: '14px', fontWeight: 600, color: '#f4f4f5', margin: '0 0 4px 0',
                                                            display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden', lineHeight: '1.4'
                                                        }}
                                                    >
                                                        {product.name}
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: '#71717a', margin: 0, fontFamily: 'monospace' }}>#{product._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                            <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)' }}>{product.category}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '13px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{product.gender}</td>
                                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5' }}>₹{product.price}</span>
                                                {product.discountPrice && <span style={{ fontSize: '12px', color: '#71717a', textDecoration: 'line-through' }}>₹{product.discountPrice}</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                            <button onClick={() => toggleVisibility.mutate({ id: product._id, isHidden: !product.isHidden })}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s',
                                                    background: product.isHidden ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)',
                                                    color: product.isHidden ? '#fbbf24' : '#34d399',
                                                    borderColor: product.isHidden ? 'rgba(251,191,36,0.2)' : 'rgba(52,211,153,0.2)',
                                                }}
                                            >
                                                {product.isHidden ? <><EyeOff size={14} /> Hidden</> : <><Eye size={14} /> Visible</>}
                                            </button>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button className="prod-action-btn edit" onClick={() => openEdit(product)} title="Edit"><Edit3 size={16} /></button>
                                                <button className="prod-action-btn del" onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product._id); }} title="Delete"><Trash2 size={16} /></button>
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
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: '#12121a', zIndex: 10, borderRadius: '20px 20px 0 0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={closeModal} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f4f4f5'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#a1a1aa'; }}
                            ><X size={18} /></button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Images */}
                            <FieldGroup label="Product Images *">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {formData.images.map((url, i) => (
                                        <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img src={proxyImageUrl(url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }))}
                                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                            ><X size={16} color="#f87171" /></button>
                                        </div>
                                    ))}
                                    <label style={{ width: '80px', height: '80px', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', gap: '4px' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {uploading ? <Loader2 size={18} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} /> : <><Upload size={16} color="#71717a" /><span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 600 }}>Upload</span></>}
                                        <input type="file" style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" multiple />
                                    </label>
                                </div>
                            </FieldGroup>

                            {/* Name */}
                            <FieldGroup label="Product Name *">
                                <input type="text" className="prod-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Nike Air Max 90" />
                            </FieldGroup>

                            {/* Category + Gender */}
                            <div className="products-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <FieldGroup label="Category *">
                                    <select className="prod-select" style={{ width: '100%' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </FieldGroup>
                                <FieldGroup label="Gender *">
                                    <select className="prod-select" style={{ width: '100%' }} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        {GENDERS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </FieldGroup>
                            </div>

                            {/* Sizes (Conditional) */}
                            {SIZE_CATEGORIES.includes(formData.category) && (
                                <FieldGroup label="Available Sizes">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input 
                                                type="text" 
                                                className="prod-input" 
                                                style={{ flex: 1 }} 
                                                value={sizeInput} 
                                                onChange={e => setSizeInput(e.target.value)} 
                                                placeholder="e.g. UK 8, XL, 42..."
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={addSize}
                                                style={{ padding: '0 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f4f4f5', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
                                            >Add</button>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {formData.sizes.map(s => (
                                                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(99,102,241,0.2)' }}>
                                                    {s}
                                                    <button type="button" onClick={() => removeSize(s)} style={{ background: 'none', border: 'none', padding: 0, color: '#818cf8', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>
                                                </span>
                                            ))}
                                            {formData.sizes.length === 0 && <span style={{ fontSize: '13px', color: '#52525b', fontStyle: 'italic' }}>No sizes added yet</span>}
                                        </div>
                                    </div>
                                </FieldGroup>
                            )}

                            {/* Price */}
                            <div className="products-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <FieldGroup label="Price (₹) *">
                                    <input type="number" className="prod-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="1999" />
                                </FieldGroup>
                                <FieldGroup label="Discount Price (₹)">
                                    <input type="number" className="prod-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} placeholder="999 (optional)" />
                                </FieldGroup>
                            </div>

                            {/* Description */}
                            <FieldGroup label="Description *">
                                <textarea rows="4" className="prod-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Product description..."
                                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                                />
                            </FieldGroup>

                            {/* Hidden Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#f4f4f5', margin: 0 }}>Hide from storefront</p>
                                    <p style={{ fontSize: '12px', color: '#71717a', margin: '4px 0 0 0' }}>Product won't appear to customers</p>
                                </div>
                                <button onClick={() => setFormData(prev => ({ ...prev, isHidden: !prev.isHidden }))}
                                    style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', background: formData.isHidden ? '#6366f1' : 'rgba(255,255,255,0.1)', flexShrink: 0 }}
                                >
                                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', transition: 'left 0.2s', left: formData.isHidden ? '25px' : '3px' }} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: '12px', position: 'sticky', bottom: 0, background: '#12121a', borderRadius: '0 0 20px 20px' }}>
                            <button onClick={closeModal} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#a1a1aa', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#f4f4f5'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            >Cancel</button>
                            <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending || uploading}
                                style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s', opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                                onMouseEnter={e => { if(!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { if(!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
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
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>{label}</label>
        {children}
    </div>
);

export default AdminProducts;
