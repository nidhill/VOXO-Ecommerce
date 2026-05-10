import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import useMeta from '../hooks/useMeta';
import '../styles/auth.css';

// ── OTP input — 6 individual boxes ──────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
    const inputs = useRef([]);
    const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

    const handleKey = (e, i) => {
        if (e.key === 'Backspace') {
            const next = [...digits];
            if (next[i]) {
                next[i] = '';
            } else if (i > 0) {
                next[i - 1] = '';
                inputs.current[i - 1]?.focus();
            }
            onChange(next.join(''));
            return;
        }
        if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < 5) inputs.current[i + 1]?.focus();
    };

    const handleChange = (e, i) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[i] = val;
        onChange(next.join(''));
        if (val && i < 5) inputs.current[i + 1]?.focus();
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted) {
            onChange(pasted.padEnd(6, '').slice(0, 6));
            inputs.current[Math.min(pasted.length, 5)]?.focus();
        }
        e.preventDefault();
    };

    return (
        <div className="otp-boxes" onPaste={handlePaste}>
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={el => inputs.current[i] = el}
                    className={`otp-box ${d ? 'filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKey(e, i)}
                    autoFocus={i === 0}
                />
            ))}
        </div>
    );
};

// ── Main Auth page ───────────────────────────────────────────────────────────
const Auth = () => {
    useMeta('Sign In', 'Sign in or create your WAVWAY account.');
    const [mode, setMode] = useState('login');
    // step: 'form' | 'otp' | 'success'
    const [step, setStep] = useState('form');
    const [showPass, setShowPass] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

    const { login, register, googleLogin, continueAsGuest } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hasGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== '';

    useEffect(() => {
        if (searchParams.get('mode') === 'signup') setMode('signup');
    }, []);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    // Step 1: send OTP (signup) or login directly
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'signup' && !agreed) { setError('Please agree to the Terms & Conditions'); return; }
        setLoading(true);
        setError('');
        try {
            if (mode === 'login') {
                await login(form.email, form.password);
                navigate('/');
            } else {
                // Send OTP
                await api.post('/auth/send-otp', { name: form.name, email: form.email });
                setStep('otp');
                setResendCooldown(60);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: verify OTP and create account
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) { setError('Please enter the full 6-digit code'); return; }
        setLoading(true);
        setError('');
        try {
            await register(form.name, form.email, form.password, form.phone, otp);
            setStep('success');
            setTimeout(() => navigate('/'), 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setResending(true);
        setError('');
        try {
            await api.post('/auth/send-otp', { name: form.name, email: form.email });
            setResendCooldown(60);
            setOtp('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend. Try again.');
        } finally {
            setResending(false);
        }
    };

    const handleGoogle = async (cr) => {
        try {
            await googleLogin(cr.credential);
            navigate('/');
        } catch (err) {
            console.error('Google login error:', err?.response?.data || err?.message || err);
            setError(err?.response?.data?.message || 'Google sign-in failed. Try again.');
        }
    };

    const switchMode = (m) => {
        setMode(m);
        setStep('form');
        setError('');
        setOtp('');
        setForm({ name: '', email: '', password: '', phone: '' });
        setAgreed(false);
        setShowPass(false);
    };

    // ── OTP Step ──────────────────────────────────────────────────────────────
    if (step === 'otp') {
        return (
            <div className="authp-page">
                <div className="authp-topbar">
                    <Link to="/" className="authp-logo">WAVWAY</Link>
                    <button className="authp-back" onClick={() => { setStep('form'); setError(''); setOtp(''); }}>
                        <ArrowLeft size={14} style={{ display: 'inline', marginRight: 4 }} /> Back
                    </button>
                </div>

                <div className="authp-card">
                    <div className="authp-head">
                        <div className="otp-email-icon">📧</div>
                        <h1 className="authp-title">Check your email</h1>
                        <p className="authp-sub">
                            We sent a 6-digit code to<br />
                            <strong style={{ color: '#111' }}>{form.email}</strong>
                        </p>
                    </div>

                    {error && <div className="authp-error">{error}</div>}

                    <form onSubmit={handleVerifyOtp}>
                        <OtpInput value={otp} onChange={setOtp} />

                        <button type="submit" className="authp-submit" style={{ marginTop: 28 }} disabled={loading || otp.length !== 6}>
                            {loading ? <span className="authp-spinner" /> : 'Verify & Create Account'}
                        </button>
                    </form>

                    <div className="otp-resend-row">
                        <span>Didn't receive it?</span>
                        <button
                            className="otp-resend-btn"
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0 || resending}
                        >
                            {resending ? 'Sending…' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : (
                                <><RotateCcw size={12} style={{ display: 'inline', marginRight: 4 }} />Resend Code</>
                            )}
                        </button>
                    </div>

                    <p className="authp-switch" style={{ marginTop: 12 }}>
                        Wrong email?{' '}
                        <button className="authp-switch-btn" onClick={() => { setStep('form'); setError(''); setOtp(''); }}>
                            Change it
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    // ── Success Step ──────────────────────────────────────────────────────────
    if (step === 'success') {
        return (
            <div className="authp-page">
                <div className="authp-topbar">
                    <Link to="/" className="authp-logo">WAVWAY</Link>
                </div>
                <div className="authp-card" style={{ textAlign: 'center', padding: '60px 44px' }}>
                    <CheckCircle size={52} strokeWidth={1.5} style={{ color: '#16a34a', margin: '0 auto 20px' }} />
                    <h1 className="authp-title">Welcome to WAVWAY!</h1>
                    <p className="authp-sub">Your account is verified. Taking you to the store…</p>
                </div>
            </div>
        );
    }

    // ── Main Form ─────────────────────────────────────────────────────────────
    return (
        <div className="authp-page">
            <div className="authp-topbar">
                <Link to="/" className="authp-logo">WAVWAY</Link>
                <Link to="/" className="authp-back">← Back to store</Link>
            </div>

            <div className="authp-card">
                {/* Tabs */}
                <div className="authp-tabs">
                    <button className={`authp-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>Sign In</button>
                    <button className={`authp-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>Sign Up</button>
                </div>

                <div className="authp-head" style={{ marginBottom: 24 }}>
                    <h1 className="authp-title">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="authp-sub">
                        {mode === 'login'
                            ? 'Sign in to access your account and orders'
                            : 'Join WAVWAY — a 6-digit code will be sent to your email'}
                    </p>
                </div>

                {error && <div className="authp-error">{error}</div>}

                <form className="authp-form" onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div className="authp-field">
                            <label className="authp-label">Full Name</label>
                            <input className="authp-input" name="name" type="text"
                                placeholder="Your full name" value={form.name}
                                onChange={handleChange} required autoComplete="name" />
                        </div>
                    )}

                    <div className="authp-field">
                        <label className="authp-label">Email</label>
                        <input className="authp-input" name="email" type="email"
                            placeholder="you@example.com" value={form.email}
                            onChange={handleChange} required autoComplete="email" />
                    </div>

                    {mode === 'signup' && (
                        <div className="authp-field">
                            <label className="authp-label">Phone <span className="authp-opt">(optional)</span></label>
                            <input className="authp-input" name="phone" type="tel"
                                placeholder="+91 98765 43210" value={form.phone}
                                onChange={handleChange} autoComplete="tel" />
                        </div>
                    )}

                    <div className="authp-field">
                        <label className="authp-label">Password</label>
                        <div className="authp-pass-wrap">
                            <input className="authp-input" name="password"
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••" value={form.password}
                                onChange={handleChange} required
                                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
                            <button type="button" className="authp-eye" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {mode === 'login' && (
                        <div className="authp-row">
                            <label className="authp-remember">
                                <input type="checkbox" className="authp-check" />
                                <span className="authp-check-box" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="authp-forgot">Forgot password?</Link>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <label className="authp-remember">
                            <input type="checkbox" className="authp-check" checked={agreed}
                                onChange={e => setAgreed(e.target.checked)} />
                            <span className="authp-check-box" />
                            I agree to all <a href="#" className="authp-link">Terms &amp; Conditions</a>
                        </label>
                    )}

                    <button type="submit" className="authp-submit" disabled={loading}>
                        {loading ? <span className="authp-spinner" /> :
                            mode === 'login' ? 'Sign In' : 'Send Verification Code →'}
                    </button>
                </form>

                {/* OR + Google */}
                <div className="authp-divider"><span>Or</span></div>
                {hasGoogleClientId ? (
                    <div className="authp-google">
                        <GoogleLogin
                            onSuccess={handleGoogle}
                            onError={() => setError('Google sign-in failed')}
                            theme="outline" size="large" width="400"
                            text={mode === 'login' ? 'signin_with' : 'signup_with'}
                            shape="rectangular"
                        />
                    </div>
                ) : (
                    <button type="button" className="authp-google-btn" disabled title="Google sign-in not configured">
                        <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                )}

                <p className="authp-switch">
                    {mode === 'login'
                        ? <>Don't have an account?{' '}<button className="authp-switch-btn" onClick={() => switchMode('signup')}>Create one</button></>
                        : <>Already have an account?{' '}<button className="authp-switch-btn" onClick={() => switchMode('login')}>Sign in</button></>
                    }
                </p>

                <div className="authp-guest-wrap">
                    <button className="authp-guest-btn" onClick={() => { continueAsGuest(); navigate('/'); }}>
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
