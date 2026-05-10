import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, Mail, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';

/**
 * AdminChangePassword — inside the admin dashboard
 * Flow: Enter current password + request OTP → verify OTP + enter new password
 */
const AdminChangePassword = () => {
    const { sendChangeOtp, changePassword, adminUser } = useAdminAuth();

    const [step, setStep]           = useState(1); // 1 = form, 2 = OTP + new pass, 'done'
    const [currentPass, setCurrentPass] = useState('');
    const [otp, setOtp]             = useState('');
    const [newPass, setNewPass]     = useState('');
    const [confPass, setConfPass]   = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew]     = useState(false);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [info, setInfo]           = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!currentPass) { setError('Enter your current password first'); return; }
        setLoading(true);
        try {
            const res = await sendChangeOtp();
            setInfo(res.message || 'OTP sent to your admin email.');
            setStep(2);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to send OTP');
        } finally { setLoading(false); }
    };

    const handleChange = async (e) => {
        e.preventDefault();
        setError('');
        if (!otp || otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
        if (newPass.length < 8) { setError('New password must be at least 8 characters'); return; }
        if (newPass !== confPass) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            await changePassword(currentPass, otp, newPass);
            setStep('done');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to change password');
        } finally { setLoading(false); }
    };

    const reset = () => {
        setStep(1); setCurrentPass(''); setOtp(''); setNewPass(''); setConfPass('');
        setError(''); setInfo('');
    };

    const inp = {
        width: '100%', padding: '11px 16px 11px 42px',
        background: '#f9fafb', border: '1px solid #e8eaed',
        borderRadius: '10px', fontSize: '13.5px', color: '#111827',
        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        transition: 'border-color 0.15s, box-shadow 0.15s',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Inter, system-ui, sans-serif', background: '#f5f6fa', overflow: 'hidden' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity:0;transform:translateY(8px);} to {opacity:1;transform:translateY(0);} }
                .cp-inp:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; background: #fff !important; }
                .cp-btn { width:100%;padding:12px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:background 0.2s;display:flex;align-items:center;justify-content:center;gap:8px; }
                .cp-btn:hover:not(:disabled) { background:#4f46e5; }
                .cp-btn:disabled { opacity:0.65;cursor:not-allowed; }
                .otp-input { width:100%;text-align:center;letter-spacing:14px;font-size:24px;font-weight:700;padding:14px;background:#f9fafb;border:1.5px solid #e8eaed;border-radius:10px;color:#111827;outline:none;font-family:monospace;transition:border-color 0.15s,box-shadow 0.15s; }
                .otp-input:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.12);background:#fff; }
            `}</style>

            {/* Header */}
            <header style={{ padding: '24px 32px', borderBottom: '1px solid #e8eaed', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>Change Password</h1>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                        Secure your admin account with a new password
                    </p>
                </div>
                <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={18} color="#6366f1" />
                </div>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeIn 0.3s ease' }}>

                    {/* Done state */}
                    {step === 'done' ? (
                        <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <CheckCircle2 size={32} color="#6366f1" />
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Password Changed!</h2>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
                                Your admin password has been updated successfully.
                            </p>
                            <button className="cp-btn" onClick={reset}>Change Again</button>
                        </div>
                    ) : (
                        <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: '16px', overflow: 'hidden' }}>
                            {/* Step bar */}
                            <div style={{ display: 'flex' }}>
                                {['Current Password', 'OTP & New Password'].map((label, i) => (
                                    <div key={i} style={{ flex: 1, padding: '14px 20px', borderBottom: `2px solid ${step >= i + 1 ? '#6366f1' : '#e8eaed'}`, background: step === i + 1 ? 'rgba(99,102,241,0.04)' : 'transparent', transition: 'all 0.2s' }}>
                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: step >= i + 1 ? '#6366f1' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Step {i + 1}
                                        </p>
                                        <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: step >= i + 1 ? '#374151' : '#9ca3af', fontWeight: 500 }}>{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '28px 28px 32px' }}>
                                {/* Account info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e8eaed', marginBottom: '24px' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                                        {(adminUser?.name || 'A')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{adminUser?.name || 'Admin'}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{adminUser?.email || ''}</p>
                                    </div>
                                    <Mail size={14} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                                </div>

                                {/* Error */}
                                {error && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', color: '#dc2626', fontSize: '13px', marginBottom: '18px' }}>
                                        <AlertCircle size={15} /> {error}
                                    </div>
                                )}

                                {/* Info */}
                                {info && step === 2 && (
                                    <div style={{ padding: '11px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '9px', color: '#16a34a', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <CheckCircle2 size={14} /> {info}
                                    </div>
                                )}

                                {/* STEP 1 */}
                                {step === 1 && (
                                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>Current Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                                <input type={showCurrent ? 'text' : 'password'} value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                                                    placeholder="Enter current password" required className="cp-inp" style={{ ...inp, paddingRight: '44px' }} />
                                                <button type="button" onClick={() => setShowCurrent(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                                                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.06)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.15)', fontSize: '12.5px', color: '#4f46e5', lineHeight: 1.6 }}>
                                            <strong>🔒 Security step:</strong> After verifying your current password, we'll send a one-time code to your admin email address.
                                        </div>
                                        <button type="submit" disabled={loading} className="cp-btn">
                                            {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sending OTP...</> : 'Send OTP to Email →'}
                                        </button>
                                    </form>
                                )}

                                {/* STEP 2 */}
                                {step === 2 && (
                                    <form onSubmit={handleChange} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
                                                OTP from Email
                                            </label>
                                            <input
                                                type="text" value={otp}
                                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="_ _ _ _ _ _" maxLength={6}
                                                className="otp-input"
                                            />
                                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', textAlign: 'center' }}>
                                                Enter the 6-digit code sent to your email
                                            </p>
                                        </div>

                                        <div style={{ height: '1px', background: '#f3f4f6' }} />

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>New Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                                <input type={showNew ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)}
                                                    placeholder="Min. 8 characters" required className="cp-inp" style={{ ...inp, paddingRight: '44px' }} />
                                                <button type="button" onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                                                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>Confirm New Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                                <input type={showNew ? 'text' : 'password'} value={confPass} onChange={e => setConfPass(e.target.value)}
                                                    placeholder="Repeat new password" required className="cp-inp" style={inp} />
                                            </div>
                                            {newPass && confPass && newPass !== confPass && (
                                                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px' }}>Passwords don't match</p>
                                            )}
                                        </div>

                                        <button type="submit" disabled={loading} className="cp-btn">
                                            {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Changing Password...</> : <><KeyRound size={15} /> Change Password</>}
                                        </button>

                                        <button type="button" onClick={handleSendOtp} disabled={loading}
                                            style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '13px', cursor: 'pointer', fontWeight: 500, textAlign: 'center' }}>
                                            Resend OTP
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChangePassword;
