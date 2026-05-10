import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => (
    <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        background: '#fff',
    }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>
            404
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, fontStyle: 'italic', margin: '0 0 16px', color: '#111' }}>
            Page not found
        </h1>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '36px', maxWidth: '360px', lineHeight: 1.6 }}>
            The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#fff', background: '#111', padding: '14px 32px', textDecoration: 'none',
            transition: 'opacity 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
            <ArrowLeft size={14} /> Back to Home
        </Link>
    </div>
);

export default NotFound;
