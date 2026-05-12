import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, Mail, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', fontFamily: 'Inter, system-ui, sans-serif', background: 'transparent' }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity:0;transform:translateY(8px);} to {opacity:1;transform:translateY(0);} }
                
                .cp-inp {
                    width: 100%; padding: 12px 16px 12px 42px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px; font-size: 14px; color: #f4f4f5;
                    outline: none; box-sizing: border-box; font-family: inherit;
                    transition: all 0.2s;
                }
                .cp-inp:focus { 
                    border-color: rgba(99,102,241,0.5) !important; 
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; 
                    background: rgba(99,102,241,0.05) !important; 
                }
                .cp-inp::placeholder { color: #52525b; }
                
                .cp-btn {
                    width: 100%; padding: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff; border: none; border-radius: 12px; font-size: 14px; font-weight: 700;
                    cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.2);
                }
                .cp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(99,102,241,0.3); }
                .cp-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }
                
                .otp-input { 
                    width: 100%; text-align: center; letter-spacing: 16px; font-size: 28px; font-weight: 800; 
                    padding: 16px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.2); 
                    border-radius: 12px; color: #f4f4f5; outline: none; font-family: monospace; 
                    transition: all 0.2s; 
                }
                .otp-input:focus { border-color: #6366f1; border-style: solid; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: rgba(99,102,241,0.02); }
                @media (max-width: 768px) {
                    .cp-header { padding: 20px 16px !important; }
                    .cp-header h1 { font-size: 22px !important; }
                    .cp-header p { font-size: 13px !important; }
                    .cp-body { padding: 16px !important; }
                    .cp-card { border-radius: 16px !important; }
                    .cp-card-inner { padding: 24px 16px !important; }
                    .cp-steps > div { padding: 10px 12px !important; }
                    .cp-steps > div p:first-child { font-size: 10px !important; }
                    .cp-steps > div p:last-child { font-size: 11px !important; }
                    .otp-input { letter-spacing: 10px !important; font-size: 24px !important; padding: 12px !important; }
                    .cp-done { padding: 32px 16px !important; border-radius: 16px !important; }
                    .cp-done h2 { font-size: 20px !important; }
                    .cp-btn { padding: 12px !important; font-size: 13px !important; }
                    .cp-header-icon { width: 40px !important; height: 40px !important; }
                    .cp-header-icon svg { width: 20px !important; height: 20px !important; }
                }
            `}</style>

            {/* Header */}
            <header className="admin-header cp-header" style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f4f4f5', margin: '0 0 4px 0', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Change Password</h1>
                    <p style={{ fontSize: '14px', color: '#71717a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Secure your admin account with a new password</p>
                </div>
                <div className="cp-header-icon" style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '16px' }}>
                    <ShieldCheck size={24} color="#818cf8" />
                </div>
            </header>

            <div className="cp-body" style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeIn 0.3s ease' }}>

                    {/* Done state */}
                    {step === 'done' ? (
                        <div className="cp-done" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
                            <div style={{ width: '72px', height: '72px', background: 'rgba(52,211,153,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 0 8px rgba(52,211,153,0.05)' }}>
                                <CheckCircle2 size={36} color="#34d399" />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f4f4f5', marginBottom: '12px', letterSpacing: '-0.02em' }}>Password Updated!</h2>
                            <p style={{ fontSize: '15px', color: '#a1a1aa', marginBottom: '32px', lineHeight: 1.6 }}>
                                Your admin password has been changed successfully. Please use your new password for future logins.
                            </p>
                            <button className="cp-btn" onClick={reset}>Change Again</button>
                        </div>
                    ) : (
                        <div className="cp-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
                            {/* Step bar */}
                            <div className="cp-steps" style={{ display: 'flex' }}>
                                {['Current Password', 'OTP & New Password'].map((label, i) => (
                                    <div key={i} style={{ flex: 1, padding: '16px 24px', borderBottom: `2px solid ${step >= i + 1 ? '#6366f1' : 'rgba(255,255,255,0.06)'}`, background: step === i + 1 ? 'rgba(99,102,241,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: step >= i + 1 ? '#818cf8' : '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Step {i + 1}
                                        </p>
                                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: step >= i + 1 ? '#f4f4f5' : '#a1a1aa', fontWeight: 600 }}>{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="cp-card-inner" style={{ padding: '32px' }}>
                                {/* Account info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '16px', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
                                        {(adminUser?.name || 'A')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#f4f4f5' }}>{adminUser?.name || 'Admin'}</p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#a1a1aa' }}>{adminUser?.email || ''}</p>
                                    </div>
                                    <Mail size={16} color="#71717a" style={{ marginLeft: 'auto' }} />
                                </div>

                                {/* Error */}
                                {error && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', color: '#f87171', fontSize: '14px', fontWeight: 500, marginBottom: '24px' }}>
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                {/* Info */}
                                {info && step === 2 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', color: '#34d399', fontSize: '14px', fontWeight: 500, marginBottom: '24px' }}>
                                        <CheckCircle2 size={18} /> {info}
                                    </div>
                                )}

                                {/* STEP 1 */}
                                {step === 1 && (
                                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>Current Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', pointerEvents: 'none' }} />
                                                <input type={showCurrent ? 'text' : 'password'} value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                                                    placeholder="Enter current password" required className="cp-inp" style={{ paddingRight: '48px' }} />
                                                <button type="button" onClick={() => setShowCurrent(v => !v)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                                                >
                                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ padding: '16px', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)', fontSize: '13px', color: '#818cf8', lineHeight: 1.6 }}>
                                            <strong style={{ color: '#a5b4fc' }}>🔒 Security Check:</strong> Verify your current password to receive a one-time code on your admin email.
                                        </div>
                                        <button type="submit" disabled={loading} className="cp-btn">
                                            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending OTP...</> : 'Send OTP to Email →'}
                                        </button>
                                    </form>
                                )}

                                {/* STEP 2 */}
                                {step === 2 && (
                                    <form onSubmit={handleChange} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '12px' }}>
                                                OTP from Email
                                            </label>
                                            <input
                                                type="text" value={otp}
                                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="------" maxLength={6}
                                                className="otp-input"
                                            />
                                            <p style={{ fontSize: '13px', color: '#71717a', marginTop: '12px', textAlign: 'center' }}>
                                                Check your email for the 6-digit verification code.
                                            </p>
                                        </div>

                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>New Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', pointerEvents: 'none' }} />
                                                <input type={showNew ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)}
                                                    placeholder="Min. 8 characters" required className="cp-inp" style={{ paddingRight: '48px' }} />
                                                <button type="button" onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#a1a1aa'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                                                >
                                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '8px' }}>Confirm New Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#71717a', pointerEvents: 'none' }} />
                                                <input type={showNew ? 'text' : 'password'} value={confPass} onChange={e => setConfPass(e.target.value)}
                                                    placeholder="Repeat new password" required className="cp-inp" />
                                            </div>
                                            {newPass && confPass && newPass !== confPass && (
                                                <p style={{ fontSize: '13px', color: '#f87171', marginTop: '8px', fontWeight: 500 }}>Passwords don't match</p>
                                            )}
                                        </div>

                                        <button type="submit" disabled={loading} className="cp-btn">
                                            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</> : <><KeyRound size={18} /> Change Password</>}
                                        </button>

                                        <button type="button" onClick={handleSendOtp} disabled={loading}
                                            style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '14px', cursor: 'pointer', fontWeight: 600, textAlign: 'center', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
                                        >
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
