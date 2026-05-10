import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import useMeta from '../hooks/useMeta';
import '../styles/auth.css';

const ResetPassword = () => {
    useMeta('Reset Password', 'Set a new password for your WAVWAY account.');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { login: _login } = useAuth();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    if (!token) {
        return (
            <div className="av-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="av-left" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
                    <p style={{ color: '#dc2626', marginBottom: 16 }}>Invalid or missing reset token.</p>
                    <Link to="/forgot-password" className="av-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
                        Request new link
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.put(`/api/auth/reset-password/${token}`, { password });
            // Auto-login after reset
            localStorage.setItem('wavway_token', data.token);
            setDone(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="av-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="av-left" style={{ maxWidth: 480, width: '100%' }}>
                <div className="av-topbar">
                    <span className="av-logo">WAVWAY</span>
                    <Link to="/auth" className="av-back"><ArrowLeft size={15} /> Back</Link>
                </div>

                <div className="av-form-wrap">
                    {done ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: '#f0fdf4', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <CheckCircle size={28} color="#16a34a" />
                            </div>
                            <h1 className="av-title" style={{ marginBottom: 10 }}>Password reset!</h1>
                            <p style={{ color: '#6b7280', fontSize: 14 }}>
                                You're now logged in. Redirecting to home...
                            </p>
                        </div>
                    ) : (
                        <>
                            <h1 className="av-title">Set new password</h1>
                            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
                                Choose a strong password for your WAVWAY account.
                            </p>

                            {error && <div className="av-error">{error}</div>}

                            <form className="av-form" onSubmit={handleSubmit}>
                                <div className="av-field">
                                    <label className="av-label">New Password</label>
                                    <div className="av-pass-wrap">
                                        <input
                                            className="av-input"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Min. 6 characters"
                                            value={password}
                                            onChange={e => { setPassword(e.target.value); setError(''); }}
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button type="button" className="av-eye" onClick={() => setShowPass(v => !v)}>
                                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="av-field">
                                    <label className="av-label">Confirm Password</label>
                                    <input
                                        className="av-input"
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={confirm}
                                        onChange={e => { setConfirm(e.target.value); setError(''); }}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <button type="submit" className="av-submit" disabled={loading}>
                                    {loading ? <span className="av-spinner" /> : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
