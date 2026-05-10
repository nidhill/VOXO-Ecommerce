import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Lock, Mail, ShoppingBag, Users, TrendingUp, Package } from 'lucide-react';

const STAT_PILLS = [
    { icon: <ShoppingBag size={13} />, label: 'Products' },
    { icon: <Package size={13} />, label: 'Orders' },
    { icon: <Users size={13} />, label: 'Customers' },
    { icon: <TrendingUp size={13} />, label: 'Analytics' },
];

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
        setIsLoading(true);
        setError('');
        setTimeout(() => {
            const success = login(email, password);
            if (success) navigate('/admin');
            else setError('Invalid email or password');
            setIsLoading(false);
        }, 500);
    };

    const inp = {
        width: '100%', padding: '11px 16px 11px 42px',
        background: '#f9fafb', border: '1px solid #e5e7eb',
        borderRadius: '10px', fontSize: '14px', color: '#111827',
        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.15s, box-shadow 0.15s',
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            fontFamily: "'Inter', system-ui, sans-serif",
            background: '#f5f6fa',
        }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                .login-inp:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; background: #fff !important; }
                .login-btn:hover:not(:disabled) { background: #4f46e5 !important; }
                .login-left { display: flex; }
                @media (max-width: 768px) { .login-left { display: none !important; } }
            `}</style>

            {/* Left decorative panel */}
            <div className="login-left" style={{
                flex: 1, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                padding: '60px', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Background circles */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '60px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#6366f1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: '#fff' }}>W</div>
                        <span style={{ color: '#fff', fontWeight: '800', fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Wavway</span>
                    </div>

                    <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: '800', lineHeight: 1.15, marginBottom: '16px' }}>
                        Your store,<br />
                        <span style={{ color: '#818cf8' }}>fully in control.</span>
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.65, maxWidth: '340px' }}>
                        Manage products, track orders, run campaigns and grow your e-commerce business from one place.
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {STAT_PILLS.map((s) => (
                        <div key={s.label} style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px', padding: '7px 14px',
                            color: '#cbd5e1', fontSize: '13px', fontWeight: '500',
                        }}>
                            {s.icon} {s.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right login form */}
            <div style={{
                width: '100%', maxWidth: '480px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                padding: '40px 32px', background: '#ffffff',
                animation: 'fadeUp 0.4s ease',
            }}>
                <div style={{ width: '100%', maxWidth: '360px' }}>
                    <div style={{ marginBottom: '36px' }}>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>Admin Sign In</h1>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Sign in to manage your store</p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px', background: '#fef2f2',
                            border: '1px solid #fecaca', borderRadius: '10px',
                            color: '#dc2626', fontSize: '13.5px', marginBottom: '20px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <span style={{ fontSize: '16px' }}>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px', letterSpacing: '0.02em' }}>
                                Email address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                <input
                                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@wavway.com" required
                                    className="login-inp" style={inp}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px', letterSpacing: '0.02em' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" required
                                    className="login-inp" style={{ ...inp, paddingRight: '44px' }}
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: '4px' }}>
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className="login-btn"
                            style={{
                                width: '100%', padding: '13px',
                                background: '#6366f1', color: '#fff',
                                border: 'none', borderRadius: '10px',
                                fontSize: '14px', fontWeight: '700',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'background 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                marginTop: '4px', letterSpacing: '0.02em',
                            }}
                        >
                            {isLoading
                                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                                : 'Sign In to Dashboard'
                            }
                        </button>
                    </form>

                    <p style={{ marginTop: '32px', fontSize: '12px', color: '#d1d5db', textAlign: 'center' }}>
                        Wavway Admin Panel · Secure Access
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
