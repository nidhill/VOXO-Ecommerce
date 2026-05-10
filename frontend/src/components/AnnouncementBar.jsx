import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAnnouncementBar } from '../api/settings';

const AnnouncementBar = ({ onHeightChange }) => {
    const [dismissed, setDismissed] = useState(
        () => sessionStorage.getItem('wavway_announcement_dismissed') === '1'
    );
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 80) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data } = useQuery({
        queryKey: ['announcement-bar'],
        queryFn: getAnnouncementBar,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const text = data?.text || 'FREE SHIPPING ALL OVER INDIA ON ORDERS OVER ₹3000';
    const enabled = data?.enabled !== false;

    if (dismissed || !enabled) return null;

    const handleDismiss = () => {
        sessionStorage.setItem('wavway_announcement_dismissed', '1');
        setDismissed(true);
    };

    return (
        <div style={{
            position: 'fixed',
            top: hidden ? '-50px' : '0',
            left: 0,
            right: 0,
            zIndex: 200,
            background: '#111111',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 48px',
            minHeight: '40px',
            transition: 'top 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            <p style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textAlign: 'center',
                flex: 1,
            }}>
                {text}
            </p>
            <button
                onClick={handleDismiss}
                aria-label="Dismiss"
                style={{
                    position: 'absolute',
                    right: 16,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default AnnouncementBar;
