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
                    <span className="legal-eyebrow">WAVWAY</span>
                    <h1 className="legal-title">Contact Us</h1>
                    <p className="legal-subtitle">
                        We’re here to help. If you have any questions regarding orders, shipping, returns, products, or general inquiries, feel free to contact us.
                    </p>
                </div>
            </div>

            <div className="legal-body">
                <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '64px' }}>
                    
                    {/* Customer Support */}
                    <div className="contact-card" style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', border: '1px solid #e8e8e6' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', fontFamily: "'Playfair Display', serif" }}>Customer Support</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <a href="mailto:wavwayofficial@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#111111' }}>
                                <div style={{ width: '40px', height: '40px', background: '#f5f5f3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                                    <FaEnvelope size={18} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#777777', margin: 0 }}>Email</p>
                                    <p style={{ fontWeight: 600, margin: 0 }}>wavwayofficial@gmail.com</p>
                                </div>
                            </a>
                            <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#111111' }}>
                                <div style={{ width: '40px', height: '40px', background: '#e8fdf0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#25D366' }}>
                                    <FaWhatsapp size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#777777', margin: 0 }}>WhatsApp / Phone</p>
                                    <p style={{ fontWeight: 600, margin: 0 }}>+91 97448 11272</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Support Hours */}
                    <div className="contact-card" style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', border: '1px solid #e8e8e6' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', fontFamily: "'Playfair Display', serif" }}>Support Hours</h2>
                        <p style={{ fontWeight: 600, margin: '0 0 8px' }}>Monday – Saturday</p>
                        <p style={{ color: '#555555', margin: '0 0 20px' }}>10:00 AM – 7:00 PM (IST)</p>
                        <p style={{ fontSize: '13px', color: '#888888', fontStyle: 'italic', lineHeight: 1.5 }}>
                            Response times may vary during weekends, holidays, or high inquiry periods.
                        </p>
                    </div>

                </div>

                <div className="contact-info-sections" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
                    
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Support</h3>
                        <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '16px' }}>For faster assistance regarding orders, please include:</p>
                        <ul style={{ fontSize: '14px', color: '#111111', lineHeight: 1.8, paddingLeft: '20px' }}>
                            <li>Order Number</li>
                            <li>Full Name</li>
                            <li>Registered Email or Phone</li>
                            <li>Description of the issue</li>
                        </ul>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Returns Assistance</h3>
                        <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '16px' }}>For damaged or incorrect product claims, you must provide:</p>
                        <ul style={{ fontSize: '14px', color: '#111111', lineHeight: 1.8, paddingLeft: '20px' }}>
                            <li>Complete 360-degree unboxing video</li>
                            <li>Clear images if required</li>
                            <li>Order details</li>
                        </ul>
                        <Link to="/return-refund" style={{ fontSize: '13px', color: '#111111', fontWeight: 600, textDecoration: 'underline' }}>View Full Return Policy</Link>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Business Inquiries</h3>
                        <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6, marginBottom: '16px' }}>For partnerships, collaborations, or wholesale:</p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                            Subject: "Business Inquiry – Wavway"
                        </p>
                        <p style={{ fontSize: '14px', color: '#555555' }}>Email: wavwayofficial@gmail.com</p>
                    </div>

                </div>

                <div style={{ marginTop: '80px', textAlign: 'center', padding: '40px', background: '#f5f5f3', borderRadius: '24px' }}>
                    <p style={{ fontSize: '18px', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#111111', margin: 0 }}>
                        Thank you for choosing Wavway. We appreciate your trust and support.
                    </p>
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
