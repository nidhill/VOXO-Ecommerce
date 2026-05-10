import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError('Email is required'); return; }
        if (!password) { setError('Password is required'); return; }

        setIsLoading(true);
        setError('');

        try {
            const result = await login(email.trim(), password);
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.message || 'Invalid email or password.');
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={s.page}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-40px) scale(1.1); } }
                @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,30px) scale(1.15); } }
                @keyframes float3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,40px) scale(1.05); } }
                @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
                @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(99,102,241,0.15); } 50% { box-shadow: 0 0 40px rgba(99,102,241,0.3); } }
                .adm-login-input { 
                    width:100%; padding:14px 16px 14px 44px; background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08); border-radius:12px; font-size:14px;
                    color:#f4f4f5; outline:none; box-sizing:border-box; font-family:inherit;
                    transition: all 0.2s ease;
                }
                .adm-login-input::placeholder { color: #52525b; }
                .adm-login-input:focus { 
                    border-color: rgba(99,102,241,0.5); 
                    background: rgba(99,102,241,0.04);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .adm-login-btn {
                    width:100%; padding:14px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color:#fff; border:none; border-radius:12px; font-size:14px; font-weight:700;
                    cursor:pointer; transition: all 0.25s ease; display:flex; align-items:center;
                    justify-content:center; gap:8px; font-family:inherit; letter-spacing:0.02em;
                    position: relative; overflow: hidden;
                }
                .adm-login-btn:hover:not(:disabled) { 
                    transform: translateY(-1px);
                    box-shadow: 0 8px 30px rgba(99,102,241,0.4);
                }
                .adm-login-btn:active:not(:disabled) { transform: translateY(0); }
                .adm-login-btn:disabled { opacity:0.6; cursor:not-allowed; }
                .adm-forgot-link { 
                    color:#818cf8; font-size:12.5px; font-weight:500; text-decoration:none; 
                    transition: color 0.15s; 
                }
                .adm-forgot-link:hover { color:#a5b4fc; }
            `}</style>

            {/* Animated gradient orbs */}
            <div style={{ ...s.orb, width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', top: '-10%', right: '-5%', animation: 'float1 8s ease-in-out infinite' }} />
            <div style={{ ...s.orb, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', bottom: '-5%', left: '-5%', animation: 'float2 10s ease-in-out infinite' }} />
            <div style={{ ...s.orb, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', top: '40%', left: '20%', animation: 'float3 12s ease-in-out infinite' }} />

            {/* Noise texture overlay */}
            <div style={s.noise} />

            {/* Login Card */}
            <div style={s.card}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={s.logoWrap}>
                        <div style={s.logo}>W</div>
                    </div>
                    <h1 style={s.title}>Welcome back</h1>
                    <p style={s.subtitle}>Sign in to your Wavway admin panel</p>
                </div>

                {/* Error */}
                {error && (
                    <div style={s.error}>
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Email */}
                    <div>
                        <label style={s.label}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={s.inputIcon} />
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="admin@wavway.com" required
                                className="adm-login-input"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ ...s.label, margin: 0 }}>Password</label>
                            <Link to="/admin/forgot-password" className="adm-forgot-link">Forgot?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={s.inputIcon} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••" required
                                className="adm-login-input"
                                style={{ paddingRight: '44px' }}
                            />
                            <button type="button" onClick={() => setShowPass(v => !v)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', display: 'flex', padding: '4px', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                                onMouseLeave={e => e.currentTarget.style.color = '#52525b'}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="adm-login-btn">
                        {isLoading ? (
                            <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                        ) : (
                            <>Sign in <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <div style={s.footer}>
                    <div style={s.divider} />
                    <p style={s.footerText}>Wavway Admin · Secure Access</p>
                </div>
            </div>
        </div>
    );
};

const s = {
    page: {
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0f', fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative', overflow: 'hidden', padding: '20px',
    },
    orb: {
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)',
    },
    noise: {
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
    },
    card: {
        width: '100%', maxWidth: '420px', padding: '40px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', position: 'relative', zIndex: 1,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        animation: 'fadeIn 0.5s ease',
    },
    logoWrap: {
        display: 'inline-flex', marginBottom: '20px',
        animation: 'pulse-glow 3s ease-in-out infinite',
        borderRadius: '16px',
    },
    logo: {
        width: '48px', height: '48px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: '20px', color: '#fff', letterSpacing: '0.05em',
    },
    title: {
        fontSize: '24px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 6px 0',
        letterSpacing: '-0.02em',
    },
    subtitle: {
        fontSize: '14px', color: '#52525b', margin: 0,
    },
    label: {
        display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa',
        marginBottom: '8px', letterSpacing: '0.01em',
    },
    inputIcon: {
        position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
        color: '#52525b', pointerEvents: 'none',
    },
    error: {
        padding: '12px 14px', background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px',
        color: '#f87171', fontSize: '13px', marginBottom: '8px',
        display: 'flex', alignItems: 'center', gap: '8px',
    },
    footer: { marginTop: '32px' },
    divider: {
        height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '16px',
    },
    footerText: {
        fontSize: '12px', color: '#3f3f46', textAlign: 'center', margin: 0,
    },
};

export default AdminLogin;
