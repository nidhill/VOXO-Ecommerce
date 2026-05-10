import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';

/**
 * Admin Forgot Password — 3-step OTP flow (outside dashboard)
 * Step 1: Enter email → send OTP
 * Step 2: Enter OTP
 * Step 3: Set new password
 */
const AdminForgotPassword = () => {
    const { sendForgotOtp, resetForgotPassword } = useAdminAuth();
    const navigate = useNavigate();

    const [step, setStep]         = useState(1); // 1 | 2 | 3 | 'done'
    const [email, setEmail]       = useState('');
    const [otp, setOtp]           = useState('');
    const [newPass, setNewPass]   = useState('');
    const [confPass, setConfPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError]       = useState('');
    const [info, setInfo]         = useState('');
    const [loading, setLoading]   = useState(false);

    const container = {
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f6fa', fontFamily: "'Inter', system-ui, sans-serif", padding: '24px',
    };
    const card = {
        width: '100%', maxWidth: '420px', background: '#fff',
        borderRadius: '20px', padding: '40px', boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
        border: '1px solid #e8eaed',
    };
    const inp = {
        width: '100%', padding: '11px 16px 11px 42px',
        background: '#f9fafb', border: '1px solid #e5e7eb',
        borderRadius: '10px', fontSize: '14px', color: '#111827',
        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.15s, box-shadow 0.15s',
    };
    const btn = {
        width: '100%', padding: '13px', background: '#6366f1', color: '#fff',
        border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
        cursor: 'pointer', transition: 'background 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    };

    // ── Step 1: Send OTP ───────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Email is required'); return; }
        setLoading(true);
        try {
            await sendForgotOtp(email.trim());
            setInfo('OTP sent! Check your inbox (it may take a minute).');
            setStep(2);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    // ── Step 2: Verify OTP ─────────────────────────────────────────────
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');
        if (!otp.trim() || otp.length !== 6) { setError('Enter the 6-digit OTP from your email'); return; }
        setStep(3);
    };

    // ── Step 3: Set new password ───────────────────────────────────────
    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        if (newPass.length < 8) { setError('Password must be at least 8 characters'); return; }
        if (newPass !== confPass) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            await resetForgotPassword(email.trim(), otp, newPass);
            setStep('done');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to reset password');
        } finally { setLoading(false); }
    };

    return (
        <div style={container}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity:0;transform:translateY(12px);} to {opacity:1;transform:translateY(0);} }
                .afp-inp:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; background: #fff !important; }
                .afp-btn:hover:not(:disabled) { background: #4f46e5 !important; }
                .afp-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .afp-back { display:inline-flex;align-items:center;gap:6px;color:#6b7280;font-size:13px;font-weight:500;text-decoration:none;margin-bottom:28px;transition:color 0.15s; }
                .afp-back:hover { color:#6366f1; }
                .otp-input { width:100%;text-align:center;letter-spacing:12px;font-size:22px;font-weight:700;padding:14px 16px;background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:10px;color:#111827;outline:none;font-family:monospace;transition:border-color 0.15s,box-shadow 0.15s; }
                .otp-input:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.12);background:#fff; }
            `}</style>

            <div style={{ ...card, animation: 'fadeUp 0.35s ease' }}>
                <Link to="/admin/login" className="afp-back">
                    <ArrowLeft size={15} /> Back to Sign In
                </Link>

                {/* DONE state */}
                {step === 'done' ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ width: '64px', height: '64px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle2 size={32} color="#6366f1" />
                        </div>
                        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Password Reset!</h1>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
                            Your admin password has been updated. You can now sign in with your new password.
                        </p>
                        <button style={btn} className="afp-btn" onClick={() => navigate('/admin/login')}>
                            Go to Sign In
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ marginBottom: '28px' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <ShieldCheck size={22} color="#6366f1" />
                            </div>
                            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                                {step === 1 ? 'Forgot Password' : step === 2 ? 'Enter OTP' : 'New Password'}
                            </h1>
                            <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.55 }}>
                                {step === 1 && "Enter your admin email and we'll send a one-time code."}
                                {step === 2 && `We sent a 6-digit OTP to ${email}. Enter it below.`}
                                {step === 3 && 'Choose a strong new password for your admin account.'}
                            </p>
                        </div>

                        {/* Step indicator */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                            {[1, 2, 3].map(n => (
                                <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', background: step >= n ? '#6366f1' : '#e5e7eb', transition: 'background 0.3s' }} />
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ padding: '11px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', color: '#dc2626', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Info */}
                        {info && step === 2 && (
                            <div style={{ padding: '11px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '9px', color: '#16a34a', fontSize: '13px', marginBottom: '18px' }}>
                                ✅ {info}
                            </div>
                        )}

                        {/* STEP 1 – Email */}
                        {step === 1 && (
                            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>Admin Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="wavwayofficial@gmail.com" required className="afp-inp" style={inp} />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} style={btn} className="afp-btn">
                                    {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sending OTP...</> : 'Send OTP →'}
                                </button>
                            </form>
                        )}

                        {/* STEP 2 – OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>6-Digit OTP</label>
                                    <input
                                        type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="_ _ _ _ _ _" maxLength={6} className="otp-input"
                                    />
                                </div>
                                <button type="submit" style={btn} className="afp-btn">
                                    <KeyRound size={15} /> Verify OTP →
                                </button>
                                <button type="button" onClick={handleSendOtp} disabled={loading}
                                    style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                                    {loading ? 'Resending...' : 'Resend OTP'}
                                </button>
                            </form>
                        )}

                        {/* STEP 3 – New password */}
                        {step === 3 && (
                            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                        <input type={showPass ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)}
                                            placeholder="Min. 8 characters" required className="afp-inp" style={{ ...inp, paddingRight: '44px' }} />
                                        <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                        <input type={showPass ? 'text' : 'password'} value={confPass} onChange={e => setConfPass(e.target.value)}
                                            placeholder="Repeat new password" required className="afp-inp" style={{ ...inp, paddingRight: '44px' }} />
                                    </div>
                                </div>
                                {newPass && confPass && newPass !== confPass && (
                                    <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>Passwords don't match</p>
                                )}
                                <button type="submit" disabled={loading} style={btn} className="afp-btn">
                                    {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Resetting...</> : 'Reset Password →'}
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminForgotPassword;
