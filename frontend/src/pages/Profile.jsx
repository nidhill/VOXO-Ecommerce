import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { User, Package, LogOut, ChevronRight, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import useMeta from '../hooks/useMeta';
import '../styles/profile.css';

const Profile = () => {
    useMeta('My Profile', 'Manage your WAVWAY account.');
    const { user, logout, googleLogin } = useAuth();
    const navigate = useNavigate();
    const hasGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== '';

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [disconnecting, setDisconnecting] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

    if (!user) {
        return (
            <div className="prof-page">
                <div className="prof-empty">
                    <p>You're not logged in.</p>
                    <Link to="/auth" className="prof-cta-btn">Sign In</Link>
                </div>
            </div>
        );
    }

    const initials = user.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.put('/auth/profile', { name: form.name, phone: form.phone });
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleGoogleLink = async (cr) => {
        try {
            await googleLogin(cr.credential);
            window.location.reload();
        } catch {
            setError('Google sign-in failed.');
        }
    };

    const handleDisconnectGoogle = async () => {
        if (!window.confirm('Remove Google from your account?')) return;
        setDisconnecting(true);
        setError('');
        try {
            await api.post('/auth/disconnect-google');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to disconnect Google.');
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <div className="prof-page">
            <div className="prof-topbar">
                <Link to="/" className="prof-logo">WAVWAY</Link>
                <Link to="/" className="prof-back">← Back to store</Link>
            </div>

            <div className="prof-layout">

                {/* Sidebar */}
                <aside className="prof-sidebar">
                    <div className="prof-avatar-wrap">
                        <div className="prof-avatar">{initials}</div>
                        <div>
                            <p className="prof-name">{user.name}</p>
                            <p className="prof-email">{user.email}</p>
                        </div>
                    </div>

                    <nav className="prof-nav">
                        <a className="prof-nav-item active" href="#info">
                            <User size={15} /> Profile Info
                        </a>
                        <Link to="/orders" className="prof-nav-item">
                            <Package size={15} /> My Orders <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                        </Link>
                    </nav>

                    <button className="prof-logout-btn" onClick={handleLogout}>
                        <LogOut size={14} /> Sign Out
                    </button>
                </aside>

                {/* Main */}
                <main className="prof-main">

                    {/* Profile Info Card */}
                    <div className="prof-card" id="info">
                        <div className="prof-card-head">
                            <h2 className="prof-card-title">Profile Information</h2>
                            {!editing && (
                                <button className="prof-edit-btn" onClick={() => setEditing(true)}>Edit</button>
                            )}
                        </div>

                        {error && <div className="prof-error">{error}</div>}
                        {saved && (
                            <div className="prof-success">
                                <Check size={14} /> Changes saved successfully.
                            </div>
                        )}

                        {editing ? (
                            <form className="prof-form" onSubmit={handleSave}>
                                <div className="prof-field">
                                    <label className="prof-label">Full Name</label>
                                    <input
                                        className="prof-input"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="prof-field">
                                    <label className="prof-label">Email <span className="prof-opt">Cannot be changed</span></label>
                                    <input className="prof-input" value={user.email} disabled />
                                </div>
                                <div className="prof-field">
                                    <label className="prof-label">Phone <span className="prof-opt">(optional)</span></label>
                                    <input
                                        className="prof-input"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    />
                                </div>
                                <div className="prof-form-actions">
                                    <button type="submit" className="prof-save-btn" disabled={saving}>
                                        {saving ? 'Saving…' : 'Save Changes'}
                                    </button>
                                    <button type="button" className="prof-cancel-btn" onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone || '' }); }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="prof-info-rows">
                                <div className="prof-info-row">
                                    <span className="prof-info-label">Name</span>
                                    <span className="prof-info-value">{user.name}</span>
                                </div>
                                <div className="prof-info-row">
                                    <span className="prof-info-label">Email</span>
                                    <span className="prof-info-value">{user.email}</span>
                                </div>
                                <div className="prof-info-row">
                                    <span className="prof-info-label">Phone</span>
                                    <span className="prof-info-value">{user.phone || <span style={{ color: '#aaa' }}>Not added</span>}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Google Card */}
                    {hasGoogleClientId && (
                        <div className="prof-card">
                            <div className="prof-card-head">
                                <h2 className="prof-card-title">Connected Accounts</h2>
                            </div>
                            <div className="prof-google-row">
                                <div className="prof-google-info">
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <div>
                                        <p className="prof-google-title">Google</p>
                                        <p className="prof-google-sub">Sign in faster with your Google account</p>
                                    </div>
                                </div>
                                {user.googleId ? (
                                    <button
                                        type="button"
                                        className="prof-disconnect-btn"
                                        onClick={handleDisconnectGoogle}
                                        disabled={disconnecting}
                                    >
                                        <X size={14} />
                                        {disconnecting ? 'Disconnecting…' : 'Disconnect'}
                                    </button>
                                ) : (
                                    <div className="prof-google-btn-wrap">
                                        <GoogleLogin
                                            onSuccess={handleGoogleLink}
                                            onError={() => setError('Google link failed.')}
                                            theme="outline"
                                            size="medium"
                                            text="continue_with"
                                            shape="rectangular"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Profile;
