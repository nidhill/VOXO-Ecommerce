import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Upload, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { getHomepageBanners, updateHomepageBanners } from '../api/settings';
import { uploadImage } from '../api/products';

const AdminBanners = () => {
    const queryClient = useQueryClient();
    const [bannerForm, setBannerForm] = useState({
        men: '/images/banners/men-featured.png',
        women: '/images/banners/women-featured.png',
    });
    const [bannerUploading, setBannerUploading] = useState({ men: false, women: false });

    const { data: banners } = useQuery({
        queryKey: ['homepage-banners'],
        queryFn: getHomepageBanners,
    });

    useEffect(() => {
        if (banners) {
            setBannerForm({
                men: banners?.men || '/images/banners/men-featured.png',
                women: banners?.women || '/images/banners/women-featured.png',
            });
        }
    }, [banners]);

    const saveBannersMutation = useMutation({
        mutationFn: updateHomepageBanners,
        onSuccess: () => {
            queryClient.invalidateQueries(['homepage-banners']);
            alert('Homepage banners updated successfully');
        },
        onError: () => alert('Failed to save homepage banners'),
    });

    const handleBannerUpload = async (type, file) => {
        if (!file) return;
        setBannerUploading(prev => ({ ...prev, [type]: true }));
        try {
            const remoteUrl = await uploadImage(file);
            setBannerForm(prev => ({ ...prev, [type]: remoteUrl }));
        } catch (err) {
            alert('Banner upload failed');
        } finally {
            setBannerUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const saveHomepageBanners = () => {
        saveBannersMutation.mutate({ men: bannerForm.men, women: bannerForm.women });
    };

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '24px 32px', fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0a0a' }}>
            <style>{`
                @media (max-width: 768px) {
                    .banners-page { padding: 16px !important; }
                    .banners-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div className="banners-page">
                <div style={{ marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fafafa', margin: 0, letterSpacing: '-0.3px' }}>Homepage Banners</h1>
                    <p style={{ fontSize: '13px', color: '#52525b', marginTop: '4px' }}>Manage the Men/Women images shown on the home featured section.</p>
                </div>

                <div style={{ background: '#111113', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', padding: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ImageIcon size={16} color="#818cf8" />
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#fafafa', margin: 0 }}>Featured Section Images</p>
                        </div>
                        <button
                            onClick={saveHomepageBanners}
                            disabled={saveBannersMutation.isPending || bannerUploading.men || bannerUploading.women}
                            style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: (saveBannersMutation.isPending || bannerUploading.men || bannerUploading.women) ? 0.6 : 1 }}
                        >
                            {saveBannersMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                            Save Changes
                        </button>
                    </div>

                    <div className="banners-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#a1a1aa' }}>Men Banner</p>
                            <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '8px', background: '#0a0a0a' }}>
                                <img src={bannerForm.men} alt="Men banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: '#e5e5e5', fontSize: '12px', fontWeight: 600 }}>
                                {bannerUploading.men ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                                Upload Men Image
                                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleBannerUpload('men', e.target.files?.[0])} />
                            </label>
                        </div>

                        <div style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#a1a1aa' }}>Women Banner</p>
                            <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '8px', background: '#0a0a0a' }}>
                                <img src={bannerForm.women} alt="Women banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: '#e5e5e5', fontSize: '12px', fontWeight: 600 }}>
                                {bannerUploading.women ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                                Upload Women Image
                                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleBannerUpload('women', e.target.files?.[0])} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBanners;
