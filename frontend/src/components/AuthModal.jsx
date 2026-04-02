import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { X, Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const AuthModal = () => {
    const { authModal, closeAuthModal, login, register, googleLogin, continueAsGuest } = useAuth();
    const [tab, setTab] = useState('login');
    const [showPass, setShowPass] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const hasGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== '';

    if (!authModal.open) return null;

    const reset = (t) => { setTab(t); setError(''); setForm({ name: '', email: '', password: '', phone: '' }); setAgreed(false); };

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tab === 'signup' && !agreed) { setError('Please agree to the Terms & Conditions'); return; }
        setLoading(true); setError('');
        try {
            if (tab === 'login') await login(form.email, form.password);
            else await register(form.name, form.email, form.password, form.phone);
            authModal.onSuccess && authModal.onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async (cr) => {
        try {
            await googleLogin(cr.credential);
            authModal.onSuccess && authModal.onSuccess();
        } catch { setError('Google sign-in failed.'); }
    };

    const handleGuest = () => {
        continueAsGuest();
        authModal.onSuccess && authModal.onSuccess();
    };

    return (
        <AnimatePresence>
            <motion.div
                className="auth-modal-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={e => e.target === e.currentTarget && closeAuthModal()}
            >
                <motion.div
                    className="auth-modal"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                >
                    <button className="auth-modal-close" onClick={closeAuthModal}><X size={14} /></button>

                    <span className="auth-modal-logo">WAVWAY</span>
                    <div className="auth-modal-pretitle">
                        <div className="auth-modal-pretitle-dot" />
                        Sign in to continue shopping
                    </div>

                    {/* Tabs */}
                    <div className="auth-tabs" style={{ marginBottom: 20 }}>
                        <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => reset('login')}>Sign In</button>
                        <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => reset('signup')}>Sign Up</button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={tab}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                        >
                            {/* Google - Only show if client ID is configured */}
                            {hasGoogleClientId && (
                                <>
                                    <div className="auth-google-wrap">
                                        <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google sign-in failed')}
                                            theme="outline" size="large" width={300}
                                            text={tab === 'login' ? 'signin_with' : 'signup_with'} shape="pill" />
                                    </div>

                                    <div className="auth-divider">
                                        <div className="auth-divider-line" />
                                        <span className="auth-divider-text">or</span>
                                        <div className="auth-divider-line" />
                                    </div>
                                </>
                            )}

                            {error && <div className="auth-error">{error}</div>}

                            <form className="auth-form" onSubmit={handleSubmit}>
                                {tab === 'signup' && (
                                    <div className="av-field">
                                        <label className="auth-label">Name</label>
                                        <input className="av-input" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                                    </div>
                                )}
                                <div className="av-field">
                                    <label className="auth-label">Email</label>
                                    <input className="av-input" name="email" type="email" placeholder="Enter your Email" value={form.email} onChange={handleChange} required />
                                </div>
                                {tab === 'signup' && (
                                    <div className="av-field">
                                        <label className="auth-label">Phone <span className="auth-optional">(optional)</span></label>
                                        <input className="av-input" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                                    </div>
                                )}
                                <div className="av-field">
                                    <label className="auth-label">Password</label>
                                    <div className="av-pass-wrap">
                                        <input className="av-input" name="password" type={showPass ? 'text' : 'password'}
                                            placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                                        <button type="button" className="av-eye" onClick={() => setShowPass(v => !v)}>
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {tab === 'login' && (
                                    <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '4px' }}>
                                        <Link to="/forgot-password" className="av-link" style={{ fontSize: '12px' }} onClick={closeAuthModal}>
                                            Forgot password?
                                        </Link>
                                    </div>
                                )}

                                {tab === 'signup' && (
                                    <label className="av-checkbox-label">
                                        <input type="checkbox" className="av-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                                        <span className="av-checkbox-box" />
                                        <span>I agree to all <a href="#" className="av-link">Terms &amp; Conditions</a></span>
                                    </label>
                                )}

                                <button type="submit" className="av-submit" disabled={loading}>
                                    {loading ? <span className="av-spinner" />
                                        : tab === 'login' ? 'Sign In' : 'Sign Up'}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    {/* Guest */}
                    <div className="auth-guest-wrap">
                        <button className="av-guest-btn" onClick={handleGuest}>
                            <ShoppingBag size={14} /> Continue as Guest
                        </button>
                        <p className="auth-guest-note">Browse freely · No account needed · Checkout via WhatsApp</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
