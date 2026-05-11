import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/legal.css';

const Contact = () => {
    useMeta('Contact Us', 'Get in touch with Wavway for support, inquiries, or business opportunities.');

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Support</span>
                    <h1 className="legal-title">Contact Us</h1>
                    <p className="legal-subtitle">
                        We're here to help. Reach out to us through any of the channels below.
                    </p>
                </div>
            </div>

            <div className="legal-body">
                <div className="legal-sections" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                    <div className="legal-section" style={{ padding: '32px', background: '#ffffff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e8e8e6' }}>
                        <div style={{ fontSize: '24px', color: '#25D366', marginBottom: '16px' }}><FaWhatsapp /></div>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>WhatsApp</h3>
                        <p style={{ color: '#666666', marginBottom: '16px', fontSize: '14px' }}>Direct support for orders and inquiries.</p>
                        <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '700', color: '#111111', textDecoration: 'none' }}>+91 97448 11272</a>
                    </div>

                    <div className="legal-section" style={{ padding: '32px', background: '#ffffff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e8e8e6' }}>
                        <div style={{ fontSize: '24px', color: '#111111', marginBottom: '16px' }}><FaEnvelope /></div>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Email</h3>
                        <p style={{ color: '#666666', marginBottom: '16px', fontSize: '14px' }}>General inquiries and business opportunities.</p>
                        <a href="mailto:wavwayofficial@gmail.com" style={{ fontWeight: '700', color: '#111111', textDecoration: 'none' }}>wavwayofficial@gmail.com</a>
                    </div>

                    <div className="legal-section" style={{ padding: '32px', background: '#ffffff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e8e8e6' }}>
                        <div style={{ fontSize: '24px', color: '#111111', marginBottom: '16px' }}><FaMapMarkerAlt /></div>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Address</h3>
                        <p style={{ color: '#666666', marginBottom: '16px', fontSize: '14px' }}>Our primary location.</p>
                        <p style={{ fontWeight: '700', color: '#111111' }}>Calicut, India</p>
                    </div>
                </div>
            </div>

            <div className="legal-footer-nav">
                <Link to="/shipping-policy" className="legal-nav-link">← Shipping Policy</Link>
                <Link to="/" className="legal-nav-link">Back to Store →</Link>
            </div>
        </div>
    );
};

export default Contact;
