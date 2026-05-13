import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAnnouncementBar } from '../api/settings';

const AnnouncementBar = ({ onHeightChange }) => {
    const [dismissed, setDismissed] = useState(
        () => sessionStorage.getItem('wavway_announcement_dismissed') === '1'
    );

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
            top: 0,
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
