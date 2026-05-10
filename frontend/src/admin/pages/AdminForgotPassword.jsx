import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

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

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');
        if (!otp.trim() || otp.length !== 6) { setError('Enter the 6-digit OTP from your email'); return; }
        setStep(3);
    };

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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', fontFamily: 'Inter, system-ui, sans-serif', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity:0;transform:translateY(12px);} to {opacity:1;transform:translateY(0);} }
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                
                .afp-inp {
                    width: 100%; padding: 14px 16px 14px 44px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px; font-size: 14px; color: #f4f4f5;
                    outline: none; box-sizing: border-box; font-family: inherit;
                    transition: all 0.2s;
                }
                .afp-inp:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; background: rgba(99,102,241,0.05) !important; }
                .afp-inp::placeholder { color: #52525b; }
                
                .afp-btn {
                    width: 100%; padding: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 700;
                    cursor: pointer; transition: all 0.2s; display: flex; alignItems: center; justifyContent: center; gap: 8px;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.2);
                }
                .afp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(99,102,241,0.3); }
                .afp-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }
                
                .afp-back { display:inline-flex;align-items:center;gap:6px;color:#a1a1aa;font-size:14px;font-weight:600;text-decoration:none;margin-bottom:32px;transition:color 0.2s; }
                .afp-back:hover { color:#f4f4f5; }
                
                .otp-input { 
                    width: 100%; text-align: center; letter-spacing: 16px; font-size: 28px; font-weight: 800; 
                    padding: 16px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.2); 
                    border-radius: 12px; color: #f4f4f5; outline: none; font-family: monospace; 
                    transition: all 0.2s; 
                }
                .otp-input:focus { border-color: #6366f1; border-style: solid; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: rgba(99,102,241,0.02); }
            `}</style>

            {/* Background Effects */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(10,10,15,0) 70%)', filter: 'blur(60px)', zIndex: 0, animation: 'float 20s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(10,10,15,0) 70%)', filter: 'blur(80px)', zIndex: 0, animation: 'float 25s ease-in-out infinite reverse' }} />

            <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', zIndex: 10, animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <Link to="/admin/login" className="afp-back">
                    <ArrowLeft size={16} /> Back to Sign In
                </Link>

                {/* DONE state */}
                {step === 'done' ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ width: '72px', height: '72px', background: 'rgba(52,211,153,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 0 8px rgba(52,211,153,0.05)' }}>
                            <CheckCircle2 size={36} color="#34d399" />
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f4f4f5', marginBottom: '12px', letterSpacing: '-0.02em' }}>Password Reset!</h1>
                        <p style={{ fontSize: '15px', color: '#a1a1aa', marginBottom: '32px', lineHeight: 1.6 }}>
                            Your admin password has been updated. You can now sign in with your new password.
                        </p>
                        <button className="afp-btn" onClick={() => navigate('/admin/login')}>
                            Go to Sign In
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <ShieldCheck size={24} color="#818cf8" />
                            </div>
                            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f4f4f5', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                {step === 1 ? 'Forgot Password' : step === 2 ? 'Enter OTP' : 'New Password'}
                            </h1>
                            <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
                                {step === 1 && "Enter your admin email and we'll send a one-time code."}
                                {step === 2 && `We sent a 6-digit OTP to ${email}. Enter it below.`}
                                {step === 3 && 'Choose a strong new password for your admin account.'}
                            </p>
                        </div>

                        {/* Step indicator */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                            {[1, 2, 3].map(n => (
                                <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= n ? '#6366f1' : 'rgba(255,255,255,0.06)', transition: 'background 0.3s' }} />
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', color: '#f87171', fontSize: '14px', fontWeight: 500, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        {/* Info */}
                        {info && step === 2 && (
                            <div style={{ padding: '14px 16px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', color: '#34d399', fontSize: '14px', fontWeight: 500, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle2 size={18} /> {info}
                            </div>
                        )}

                        {/* STEP 1 – Email */}
                        {step === 1 && (
                            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>Admin Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', pointerEvents: 'none' }} />
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@wavway.in" required className="afp-inp" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="afp-btn">
                                    {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending OTP...</> : 'Send OTP →'}
                                </button>
                            </form>
                        )}

                        {/* STEP 2 – OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '12px' }}>6-Digit OTP</label>
                                    <input
                                        type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="------" maxLength={6} className="otp-input"
                                    />
                                </div>
                                <button type="submit" className="afp-btn">
                                    <KeyRound size={18} /> Verify OTP →
                                </button>
                                <button type="button" onClick={handleSendOtp} disabled={loading}
                                    style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '14px', cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
                                >
                                    {loading ? 'Resending...' : 'Resend OTP'}
                                </button>
                            </form>
                        )}

                        {/* STEP 3 – New password */}
                        {step === 3 && (
                            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', pointerEvents: 'none' }} />
                                        <input type={showPass ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)}
                                            placeholder="Min. 8 characters" required className="afp-inp" style={{ paddingRight: '48px' }} />
                                        <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                                        >
                                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', pointerEvents: 'none' }} />
                                        <input type={showPass ? 'text' : 'password'} value={confPass} onChange={e => setConfPass(e.target.value)}
                                            placeholder="Repeat new password" required className="afp-inp" style={{ paddingRight: '48px' }} />
                                    </div>
                                </div>
                                {newPass && confPass && newPass !== confPass && (
                                    <p style={{ fontSize: '13px', color: '#f87171', margin: 0, fontWeight: 500 }}>Passwords don't match</p>
                                )}
                                <button type="submit" disabled={loading} className="afp-btn">
                                    {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Resetting...</> : 'Reset Password →'}
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
