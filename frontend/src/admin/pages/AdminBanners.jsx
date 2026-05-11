import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, Loader2, Save, Image as ImageIcon, Trash2, CheckCircle, Megaphone } from 'lucide-react';
import { getHomepageBanners, updateHomepageBanners, getHeroImages, updateHeroImages, getAnnouncementBar, updateAnnouncementBar, getStoreAutomation, updateStoreAutomation } from '../api/settings';
import { uploadImage } from '../api/products';

// Proxy R2 URLs through backend to avoid CORS in admin preview
function proxyImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://localhost:5001')) return url.replace('http://localhost:5001', '');
    const r2Match = url.match(/https?:\/\/[^/]+\.r2\.dev\/(.+)/);
    if (r2Match) return `/api/upload/file/${r2Match[1]}`;
    return url;
}

const Toast = ({ msg, type }) => (
    <div style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
        background: type === 'success' ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)',
        border: `1px solid ${type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
        color: type === 'success' ? '#4ade80' : '#f87171', padding: '14px 20px', borderRadius: '12px',
        fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
    }}>
        <CheckCircle size={18} /> {msg}
    </div>
);

const ImageSlot = ({ label, url, uploading, onUpload, onClear, aspect = '16/9' }) => (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#a1a1aa' }}>{label}</p>
            {url && (
                <button onClick={onClear} title="Remove image"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer', color: '#f87171', padding: '4px', display: 'flex', transition: 'all 0.15s' }}>
                    <Trash2 size={14} />
                </button>
            )}
        </div>

        <div style={{
            width: '100%', aspectRatio: aspect, borderRadius: '12px', overflow: 'hidden',
            border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '12px',
            background: 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative'
        }}>
            {url ? (
                <img
                    src={proxyImageUrl(url)}
                    alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
            ) : null}
            <div style={{
                width: '100%', height: '100%', display: url ? 'none' : 'flex',
                alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px',
                color: '#52525b', fontSize: '13px',
            }}>
                <ImageIcon size={28} strokeWidth={1.5} />
                <span>No image</span>
            </div>
        </div>

        <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
            cursor: uploading ? 'not-allowed' : 'pointer', color: '#f4f4f5',
            fontSize: '13px', fontWeight: 600, opacity: uploading ? 0.6 : 1, transition: 'background 0.2s'
        }}>
            {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
            {url ? 'Replace Image' : 'Upload Image'}
            <input type="file" style={{ display: 'none' }} accept="image/*" disabled={uploading}
                onChange={(e) => onUpload(e.target.files?.[0])} />
        </label>
    </div>
);

const AdminBanners = () => {
    const queryClient = useQueryClient();
    const [bannerForm, setBannerForm] = useState({ men: '', women: '', lookbook: '' });
    const [bannerUploading, setBannerUploading] = useState({ men: false, women: false, lookbook: false });
    const [heroImages, setHeroImages] = useState(['', '', '', '']);
    const [heroUploading, setHeroUploading] = useState([false, false, false, false]);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementEnabled, setAnnouncementEnabled] = useState(true);
    const [autoHideDays, setAutoHideDays] = useState(60);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const { data: banners } = useQuery({ queryKey: ['homepage-banners'], queryFn: getHomepageBanners });
    const { data: heroConfig } = useQuery({ queryKey: ['hero-images'], queryFn: getHeroImages });
    const { data: announcementConfig } = useQuery({ queryKey: ['announcement-bar'], queryFn: getAnnouncementBar });
    const { data: automationConfig } = useQuery({ queryKey: ['store-automation'], queryFn: getStoreAutomation });

    useEffect(() => {
        if (banners) setBannerForm({ men: banners.men || '', women: banners.women || '', lookbook: banners.lookbook || '' });
    }, [banners]);

    useEffect(() => {
        if (heroConfig?.images && Array.isArray(heroConfig.images)) {
            const padded = [...heroConfig.images, '', '', '', ''].slice(0, 4);
            setHeroImages(padded);
        }
    }, [heroConfig]);

    useEffect(() => {
        if (announcementConfig) {
            setAnnouncementText(announcementConfig.text || '');
            setAnnouncementEnabled(announcementConfig.enabled !== false);
        }
    }, [announcementConfig]);

    useEffect(() => {
        if (automationConfig !== undefined) {
            setAutoHideDays(automationConfig.autoHideDays);
        }
    }, [automationConfig]);

    const saveBannersMutation = useMutation({
        mutationFn: updateHomepageBanners,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage-banners'] });
            showToast('Banners saved!');
        },
        onError: (err) => showToast(err?.response?.data?.message || 'Failed to save', 'error'),
    });

    const saveHeroMutation = useMutation({
        mutationFn: updateHeroImages,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hero-images'] });
            showToast('Hero images saved!');
        },
        onError: (err) => showToast(err?.response?.data?.message || 'Failed to save', 'error'),
    });

    const saveAnnouncementMutation = useMutation({
        mutationFn: updateAnnouncementBar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcement-bar'] });
            showToast('Announcement bar saved!');
        },
        onError: (err) => showToast(err?.response?.data?.message || 'Failed to save', 'error'),
    });

    const saveAutomationMutation = useMutation({
        mutationFn: updateStoreAutomation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['store-automation'] });
            showToast('Automation settings saved!');
        },
        onError: (err) => showToast(err?.response?.data?.message || 'Failed to save', 'error'),
    });

    const handleBannerUpload = async (type, file) => {
        if (!file) return;
        setBannerUploading(prev => ({ ...prev, [type]: true }));
        try {
            const url = await uploadImage(file);
            const updated = { ...bannerForm, [type]: url };
            setBannerForm(updated);
            await saveBannersMutation.mutateAsync(updated);
        } catch {
            showToast('Upload failed', 'error');
        } finally {
            setBannerUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleBannerClear = (type) => {
        const updated = { ...bannerForm, [type]: '' };
        setBannerForm(updated);
        saveBannersMutation.mutate(updated);
    };

    const handleHeroUpload = async (index, file) => {
        if (!file) return;
        setHeroUploading(prev => prev.map((v, i) => i === index ? true : v));
        try {
            const url = await uploadImage(file);
            const updated = heroImages.map((u, i) => i === index ? url : u);
            setHeroImages(updated);
            await saveHeroMutation.mutateAsync({ images: updated.filter(Boolean) });
        } catch {
            showToast('Upload failed', 'error');
        } finally {
            setHeroUploading(prev => prev.map((v, i) => i === index ? false : v));
        }
    };

    const handleHeroClear = (index) => {
        const updated = heroImages.map((u, i) => i === index ? '' : u);
        setHeroImages(updated);
        saveHeroMutation.mutate({ images: updated.filter(Boolean) });
    };

    const saveBtnStyle = (pending) => ({
        background: 'rgba(255,255,255,0.05)', color: '#f4f4f5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
        padding: '10px 16px', fontSize: '13px', fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px', opacity: pending ? 0.6 : 1, transition: 'all 0.2s',
    });

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '32px 40px', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .ban-grid { grid-template-columns: 1fr !important; }
                }
                .ban-section {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 20px; padding: 24px; margin-bottom: 24px;
                }
            `}</style>

            {toast && <Toast msg={toast.msg} type={toast.type} />}

            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>Banners & Media</h1>
                <p style={{ fontSize: '14px', color: '#71717a', margin: 0 }}>Images upload and save automatically. Changes reflect on the website immediately.</p>
            </header>

            {/* Announcement Bar */}
            <div className="ban-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Megaphone size={20} />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Announcement Bar</h2>
                    </div>
                    <button
                        onClick={() => saveAnnouncementMutation.mutate({ text: announcementText, enabled: announcementEnabled })}
                        disabled={saveAnnouncementMutation.isPending}
                        style={saveBtnStyle(saveAnnouncementMutation.isPending)}
                    >
                        {saveAnnouncementMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa' }}>Visibility</label>
                        <button
                            onClick={() => setAnnouncementEnabled(v => !v)}
                            style={{
                                width: '48px', height: '26px', borderRadius: '13px', border: 'none',
                                background: announcementEnabled ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                            }}
                        >
                            <span style={{
                                position: 'absolute', top: '3px',
                                left: announcementEnabled ? '25px' : '3px',
                                width: '20px', height: '20px', borderRadius: '50%',
                                background: '#fff', transition: 'left 0.2s',
                            }} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: announcementEnabled ? '#34d399' : '#71717a' }}>
                            {announcementEnabled ? 'Active on storefront' : 'Hidden'}
                        </span>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>
                            Announcement Text
                        </label>
                        <input
                            type="text"
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            placeholder="e.g. FREE SHIPPING ALL OVER INDIA ON ORDERS OVER ₹3000"
                            style={{
                                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px', padding: '12px 16px', color: '#f4f4f5',
                                fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <p style={{ fontSize: '12px', color: '#71717a', margin: '8px 0 0 0' }}>
                            This text appears in the top banner across all pages.
                        </p>
                    </div>
                </div>
            </div>

            {/* Store Automation */}
            <div className="ban-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(234,179,8,0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={20} />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Store Automation</h2>
                    </div>
                    <button
                        onClick={() => saveAutomationMutation.mutate({ autoHideDays })}
                        disabled={saveAutomationMutation.isPending}
                        style={saveBtnStyle(saveAutomationMutation.isPending)}
                    >
                        {saveAutomationMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        Save Settings
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>
                            Auto-Hide Products After (Days)
                        </label>
                        <input
                            type="number"
                            value={autoHideDays}
                            onChange={(e) => setAutoHideDays(e.target.value)}
                            placeholder="60"
                            style={{
                                width: '100%', maxWidth: '200px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px', padding: '12px 16px', color: '#f4f4f5',
                                fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <p style={{ fontSize: '12px', color: '#71717a', margin: '8px 0 0 0' }}>
                            Set to 0 to disable. Products older than this will automatically be hidden from the storefront.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="ban-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236,72,153,0.1)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={20} />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Featured Category Banners</h2>
                    </div>
                    <button
                        onClick={() => saveBannersMutation.mutate(bannerForm)}
                        disabled={saveBannersMutation.isPending}
                        style={saveBtnStyle(saveBannersMutation.isPending)}
                    >
                        {saveBannersMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>

                <div className="ban-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <ImageSlot label="Men's Collection Banner" url={bannerForm.men} uploading={bannerUploading.men} onUpload={(f) => handleBannerUpload('men', f)} onClear={() => handleBannerClear('men')} />
                    <ImageSlot label="Women's Collection Banner" url={bannerForm.women} uploading={bannerUploading.women} onUpload={(f) => handleBannerUpload('women', f)} onClear={() => handleBannerClear('women')} />
                    <ImageSlot label="Signature Collection (Lookbook)" url={bannerForm.lookbook} uploading={bannerUploading.lookbook} onUpload={(f) => handleBannerUpload('lookbook', f)} onClear={() => handleBannerClear('lookbook')} aspect="4/3" />
                </div>
            </div>

            {/* Hero Carousel */}
            <div className="ban-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={20} />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Hero Carousel Images</h2>
                    </div>
                    <button
                        onClick={() => saveHeroMutation.mutate({ images: heroImages.filter(Boolean) })}
                        disabled={saveHeroMutation.isPending}
                        style={saveBtnStyle(saveHeroMutation.isPending)}
                    >
                        {saveHeroMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        Save Hero Images
                    </button>
                </div>

                <div className="ban-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                    {heroImages.map((url, index) => (
                        <ImageSlot key={index} label={`Hero Image ${index + 1}`} url={url} uploading={heroUploading[index]} onUpload={(f) => handleHeroUpload(index, f)} onClear={() => handleHeroClear(index)} aspect="1/1" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminBanners;
