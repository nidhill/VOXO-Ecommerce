import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import axios from 'axios';
import '../styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setSent(true);
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
                    {sent ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: '#f0fdf4', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <Mail size={28} color="#16a34a" />
                            </div>
                            <h1 className="av-title" style={{ marginBottom: 10 }}>Check your inbox</h1>
                            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                                We sent a password reset link to <strong>{email}</strong>.<br />
                                It expires in 15 minutes.
                            </p>
                            <Link to="/auth" className="av-submit" style={{
                                display: 'inline-block', textAlign: 'center',
                                padding: '13px 32px', textDecoration: 'none'
                            }}>
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="av-title">Forgot password?</h1>
                            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
                                Enter your email and we'll send you a link to reset your password.
                            </p>

                            {error && <div className="av-error">{error}</div>}

                            <form className="av-form" onSubmit={handleSubmit}>
                                <div className="av-field">
                                    <label className="av-label">Email</label>
                                    <input
                                        className="av-input"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(''); }}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <button type="submit" className="av-submit" disabled={loading}>
                                    {loading ? <span className="av-spinner" /> : 'Send Reset Link'}
                                </button>
                            </form>

                            <p className="av-switch" style={{ marginTop: 20 }}>
                                Remembered it? <Link to="/auth" className="av-switch-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a0a0a', fontWeight: 600, textDecoration: 'underline' }}>Sign In</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
