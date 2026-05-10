import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
import { API_BASE } from '../api/axios';

const InstagramIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.522 3.66 1.432 5.18L2 22l4.82-1.432A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
            d="M9 10.5c.5 1.5 2 3 3.5 3.5" />
        <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            d="M8.5 9a.5.5 0 01.5-.5h.5c.3 0 .6.2.7.5l.8 2a.7.7 0 01-.2.8l-.3.3c.5 1 1.4 1.9 2.4 2.4l.3-.3a.7.7 0 01.8-.2l2 .8c.3.1.5.4.5.7v.5a1 1 0 01-1 1C10.5 17 7 13.5 7 9.5a1 1 0 011-1z" />
    </svg>
);

const Footer = () => {
    const [email, setEmail] = useState('');
    const [joined, setJoined] = useState(false);
    const [subError, setSubError] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (res.ok || res.status === 409) {
                setJoined(true);
                setEmail('');
                setSubError('');
            } else {
                setSubError('Something went wrong. Try again.');
            }
        } catch {
            setJoined(true);
            setEmail('');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-inner">

                {/* Top grid */}
                <div className="footer-grid">

                    {/* Col 1 — Brand */}
                    <div className="footer-brand-col">
                        <Link to="/" className="footer-logo">WAVWAY</Link>
                        <p className="footer-tagline">Premium fashion & accessories, curated for the modern lifestyle.</p>
                        <div className="footer-socials">
                            <a href="https://www.instagram.com/wavway.in/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                                <InstagramIcon />
                            </a>
                            <a href="https://wa.me/918848041999" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                                <WhatsAppIcon />
                            </a>
                        </div>
                    </div>

                    {/* Col 2 — Shop */}
                    <div className="footer-col">
                        <h4 className="footer-col-heading">Shop</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/collections/all">All Products</Link></li>
                            <li><Link to="/collections/men">Men</Link></li>
                            <li><Link to="/collections/women">Women</Link></li>
                            <li><Link to="/collections/all?category=Watch">Watches</Link></li>
                            <li><Link to="/collections/all?category=Perfume">Perfumes</Link></li>
                            <li><Link to="/collections/all?category=Belt">Belts</Link></li>
                        </ul>
                    </div>

                    {/* Col 3 — Support */}
                    <div className="footer-col">
                        <h4 className="footer-col-heading">Support</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/auth">Login / Register</Link></li>
                            <li><Link to="/orders">Track Order</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                            <li><a href="https://wa.me/918848041999" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Col 4 — Newsletter */}
                    <div className="footer-col">
                        <h4 className="footer-col-heading">Newsletter</h4>
                        <p className="footer-newsletter-text">
                            Get exclusive deals, new arrivals, and style tips straight to your inbox.
                        </p>
                        {joined ? (
                            <p className="footer-joined-msg">Thanks for subscribing!</p>
                        ) : (
                            <form className="footer-newsletter-form" onSubmit={handleJoin}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="footer-email-input"
                                    required
                                />
                                <button type="submit" className="footer-join-btn">Join</button>
                            </form>
                        )}
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <p className="footer-copyright">© {new Date().getFullYear()} Wavway. All rights reserved.</p>
                    <div className="footer-legal-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms">Terms &amp; Conditions</Link>
                        <Link to="/cookie-policy">Cookie Policy</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
