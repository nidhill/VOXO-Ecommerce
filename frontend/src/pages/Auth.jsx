import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, ArrowLeft, ShoppingBag, Recycle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Auth = () => {
    const [mode, setMode] = useState('signup'); // 'login' | 'signup'
    const [showPass, setShowPass] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

    const { login, register, googleLogin, continueAsGuest } = useAuth();
    const navigate = useNavigate();
    const hasGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== '';

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'signup' && !agreed) { setError('Please agree to the Terms & Conditions'); return; }
        setLoading(true);
        setError('');
        try {
            if (mode === 'login') await login(form.email, form.password);
            else await register(form.name, form.email, form.password, form.phone);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed. Try again.');
        }
    };

    const switchMode = (m) => {
        setMode(m);
        setError('');
        setForm({ name: '', email: '', password: '', phone: '' });
        setAgreed(false);
    };

    return (
        <div className="av-page">
            {/* ── Left Panel ─────────────────────────── */}
            <div className="av-left">
                {/* Top bar */}
                <div className="av-topbar">
                    <span className="av-logo">WAVWAY</span>
                    <Link to="/" className="av-back"><ArrowLeft size={15} /> Back</Link>
                </div>

                {/* Form area */}
                <div className="av-form-wrap">
                    <h1 className="av-title">
                        {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                    </h1>
                    <p className="av-subtitle">
                        {mode === 'signup' ? 'Step into the digital atelier.' : 'Sign in to continue shopping.'}
                    </p>

                    {error && <div className="av-error">{error}</div>}

                    {/* Google - Only show if client ID is configured */}
                    {hasGoogleClientId && (
                        <>
                            <div className="av-google-wrap">
                                <GoogleLogin
                                    onSuccess={handleGoogle}
                                    onError={() => setError('Google sign-in failed')}
                                    theme="outline"
                                    size="large"
                                    width={360}
                                    text={mode === 'signup' ? 'signup_with' : 'signin_with'}
                                    shape="pill"
                                />
                            </div>
                            <div className="av-or"><span>or</span></div>
                        </>
                    )}

                    <form className="av-form" onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div className="av-field">
                                <label className="av-label">Name</label>
                                <input
                                    className="av-input"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        )}

                        <div className="av-field">
                            <label className="av-label">Email</label>
                            <input
                                className="av-input"
                                name="email"
                                type="email"
                                placeholder="Enter your Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="av-field">
                            <label className="av-label">Password</label>
                            <div className="av-pass-wrap">
                                <input
                                    className="av-input"
                                    name="password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                />
                                <button type="button" className="av-eye" onClick={() => setShowPass(v => !v)}>
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '4px' }}>
                                <Link to="/forgot-password" className="av-link" style={{ fontSize: '13px' }}>
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        {mode === 'signup' && (
                            <label className="av-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="av-checkbox"
                                    checked={agreed}
                                    onChange={e => setAgreed(e.target.checked)}
                                />
                                <span className="av-checkbox-box" />
                                <span>I agree to all <a href="#" className="av-link">Terms &amp; Conditions</a></span>
                            </label>
                        )}

                        <button type="submit" className="av-submit" disabled={loading}>
                            {loading
                                ? <span className="av-spinner" />
                                : mode === 'signup' ? 'Sign up' : 'Log In'
                            }
                        </button>
                    </form>

                    {/* Switch mode */}
                    <p className="av-switch">
                        {mode === 'signup'
                            ? <>Already have an account? <button className="av-switch-btn" onClick={() => switchMode('login')}>Log In</button></>
                            : <>Don't have an account? <button className="av-switch-btn" onClick={() => switchMode('signup')}>Sign up</button></>
                        }
                    </p>

                    {/* Guest */}
                    <button className="av-guest-btn" onClick={() => { continueAsGuest(); navigate('/'); }}>
                        <ShoppingBag size={15} />
                        Continue as Guest
                    </button>
                </div>
            </div>

            {/* ── Right Panel ────────────────────────── */}
            <div className="av-right">
                <div className="av-image-blob">
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85&fit=crop"
                        alt="WAVWAY Fashion"
                        className="av-image"
                    />
                    <div className="av-image-overlay">
                        <div className="av-image-text">
                            <p className="av-image-brand">WAVWAY</p>
                            <h2 className="av-image-headline">Dress the<br />part. Own<br />the style.</h2>
                        </div>
                        <div className="av-image-chips">
                            <div className="av-chip">
                                <Recycle size={13} />
                                Curated Collections
                            </div>
                            <div className="av-chip">
                                <Shield size={13} />
                                Secure WhatsApp Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
