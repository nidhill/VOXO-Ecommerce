import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, Loader2, Save, Image as ImageIcon, Trash2, CheckCircle, Megaphone } from 'lucide-react';
import { getHomepageBanners, updateHomepageBanners, getHeroImages, updateHeroImages, getAnnouncementBar, updateAnnouncementBar } from '../api/settings';
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
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        background: type === 'success' ? '#16a34a' : '#dc2626',
        color: '#fff', padding: '10px 18px', borderRadius: '8px',
        fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}>
        <CheckCircle size={15} /> {msg}
    </div>
);

const ImageSlot = ({ label, url, uploading, onUpload, onClear, aspect = '16/9' }) => (
    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{label}</p>
            {url && (
                <button onClick={onClear} title="Remove image"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', display: 'flex' }}>
                    <Trash2 size={13} />
                </button>
            )}
        </div>

        <div style={{
            width: '100%', aspectRatio: aspect, borderRadius: '8px', overflow: 'hidden',
            border: '1px solid #e5e7eb', marginBottom: '8px',
            background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px',
                color: '#9ca3af', fontSize: '12px',
            }}>
                <ImageIcon size={24} strokeWidth={1} />
                <span>No image uploaded</span>
            </div>
        </div>

        <label style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb',
            cursor: uploading ? 'not-allowed' : 'pointer', color: '#374151',
            fontSize: '12px', fontWeight: 600, opacity: uploading ? 0.6 : 1,
        }}>
            {uploading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
            {url ? 'Replace Image' : 'Upload Image'}
            <input type="file" style={{ display: 'none' }} accept="image/*" disabled={uploading}
                onChange={(e) => onUpload(e.target.files?.[0])} />
        </label>
    </div>
);

const AdminBanners = () => {
    const queryClient = useQueryClient();
    const [bannerForm, setBannerForm] = useState({ men: '', women: '' });
    const [bannerUploading, setBannerUploading] = useState({ men: false, women: false });
    const [heroImages, setHeroImages] = useState(['', '', '', '']);
    const [heroUploading, setHeroUploading] = useState([false, false, false, false]);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementEnabled, setAnnouncementEnabled] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const { data: banners } = useQuery({ queryKey: ['homepage-banners'], queryFn: getHomepageBanners });
    const { data: heroConfig } = useQuery({ queryKey: ['hero-images'], queryFn: getHeroImages });
    const { data: announcementConfig } = useQuery({ queryKey: ['announcement-bar'], queryFn: getAnnouncementBar });

    useEffect(() => {
        if (banners) setBannerForm({ men: banners.men || '', women: banners.women || '' });
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

    // Upload banner + auto-save immediately
    const handleBannerUpload = async (type, file) => {
        if (!file) return;
        setBannerUploading(prev => ({ ...prev, [type]: true }));
        try {
            const url = await uploadImage(file);
            const updated = { ...bannerForm, [type]: url };
            setBannerForm(updated);
            // auto-save
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

    // Upload hero + auto-save
    const handleHeroUpload = async (index, file) => {
        if (!file) return;
        setHeroUploading(prev => prev.map((v, i) => i === index ? true : v));
        try {
            const url = await uploadImage(file);
            const updated = heroImages.map((u, i) => i === index ? url : u);
            setHeroImages(updated);
            // auto-save
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

    const card = { background: '#ffffff', borderRadius: '14px', border: '1px solid #e8eaed', padding: '18px' };
    const sectionHead = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' };
    const saveBtn = (pending) => ({
        background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px',
        padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px', opacity: pending ? 0.6 : 1,
    });

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '28px 32px', fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f6fa' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .banners-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
                }
            `}</style>

            {toast && <Toast msg={toast.msg} type={toast.type} />}

            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>Banners & Media</h1>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    Images upload and save automatically. Changes reflect on the website immediately.
                </p>
            </div>

            {/* ── Announcement Bar ── */}
            <div style={{ ...card, marginBottom: '16px' }}>
                <div style={sectionHead}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Megaphone size={16} color="#818cf8" />
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Announcement Bar</p>
                    </div>
                    <button
                        onClick={() => saveAnnouncementMutation.mutate({ text: announcementText, enabled: announcementEnabled })}
                        disabled={saveAnnouncementMutation.isPending}
                        style={saveBtn(saveAnnouncementMutation.isPending)}
                    >
                        {saveAnnouncementMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa', minWidth: '60px' }}>Enabled</label>
                        <button
                            onClick={() => setAnnouncementEnabled(v => !v)}
                            style={{
                                width: '40px', height: '22px', borderRadius: '11px', border: 'none',
                                background: announcementEnabled ? '#6366f1' : '#3f3f46',
                                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                            }}
                        >
                            <span style={{
                                position: 'absolute', top: '3px',
                                left: announcementEnabled ? '21px' : '3px',
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: '#fff', transition: 'left 0.2s',
                            }} />
                        </button>
                        <span style={{ fontSize: '11px', color: announcementEnabled ? '#a3e635' : '#71717a' }}>
                            {announcementEnabled ? 'Showing on site' : 'Hidden'}
                        </span>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#a1a1aa', marginBottom: '6px' }}>
                            Announcement Text
                        </label>
                        <input
                            type="text"
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            placeholder="e.g. FREE SHIPPING ALL OVER INDIA ON ORDERS OVER ₹3000"
                            style={{
                                width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', padding: '10px 12px', color: '#fafafa',
                                fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                        <p style={{ fontSize: '11px', color: '#52525b', marginTop: '6px' }}>
                            This text appears in the black bar at the top of every page.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Featured Section Banners ── */}
            <div style={{ ...card, marginBottom: '16px' }}>
                <div style={sectionHead}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ImageIcon size={16} color="#818cf8" />
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Featured Section Images</p>
                    </div>
                    <button
                        onClick={() => saveBannersMutation.mutate(bannerForm)}
                        disabled={saveBannersMutation.isPending}
                        style={saveBtn(saveBannersMutation.isPending)}
                    >
                        {saveBannersMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>

                <div className="banners-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <ImageSlot
                        label="Men Banner"
                        url={bannerForm.men}
                        uploading={bannerUploading.men}
                        onUpload={(f) => handleBannerUpload('men', f)}
                        onClear={() => handleBannerClear('men')}
                    />
                    <ImageSlot
                        label="Women Banner"
                        url={bannerForm.women}
                        uploading={bannerUploading.women}
                        onUpload={(f) => handleBannerUpload('women', f)}
                        onClear={() => handleBannerClear('women')}
                    />
                </div>
            </div>

            {/* ── Hero Carousel ── */}
            <div style={card}>
                <div style={sectionHead}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ImageIcon size={16} color="#818cf8" />
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>Hero Carousel Images</p>
                    </div>
                    <button
                        onClick={() => saveHeroMutation.mutate({ images: heroImages.filter(Boolean) })}
                        disabled={saveHeroMutation.isPending}
                        style={saveBtn(saveHeroMutation.isPending)}
                    >
                        {saveHeroMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                        Save Hero Images
                    </button>
                </div>

                <div className="banners-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {heroImages.map((url, index) => (
                        <ImageSlot
                            key={index}
                            label={`Hero Image ${index + 1}`}
                            url={url}
                            uploading={heroUploading[index]}
                            onUpload={(f) => handleHeroUpload(index, f)}
                            onClear={() => handleHeroClear(index)}
                            aspect="1/1"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminBanners;
