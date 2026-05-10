import React, { useState, useEffect } from 'react';

const COOKIE_KEY = 'wavway_cookie_consent';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_KEY);
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(COOKIE_KEY, 'all');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(COOKIE_KEY, 'essential');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <>
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
                zIndex: 9998, backdropFilter: 'blur(2px)',
                animation: 'fadeIn 0.3s ease',
            }} onClick={decline} />

            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                zIndex: 9999,
                background: '#111',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: 'clamp(20px, 3vw, 32px) clamp(20px, 5vw, 80px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '24px', flexWrap: 'wrap',
                animation: 'slideUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}>
                <style>{`
                    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>

                {/* Left: Icon + Text */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: '1 1 300px' }}>
                    <span style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>🍪</span>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.01em' }}>
                            We use cookies
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888', lineHeight: 1.6, maxWidth: '520px' }}>
                            We use cookies to enhance your browsing experience, personalise content and ads, and analyse our traffic.
                            By clicking "Allow All", you consent to our use of cookies.
                        </p>
                    </div>
                </div>

                {/* Right: Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <button
                        onClick={decline}
                        style={{
                            padding: '10px 20px', border: '1px solid rgba(255,255,255,0.15)',
                            background: 'transparent', color: '#aaa',
                            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                            transition: 'all 0.18s', fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#aaa'; }}
                    >
                        Essential Only
                    </button>
                    <button
                        onClick={accept}
                        style={{
                            padding: '10px 24px', border: 'none',
                            background: '#fff', color: '#111',
                            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                            transition: 'opacity 0.18s', fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        Allow All
                    </button>
                </div>
            </div>
        </>
    );
};

export default CookieConsent;
