import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
import api from '../api/axios';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const InstagramIcon = () => (
    <FaInstagram size={24} />
);

const WhatsAppIcon = () => (
    <FaWhatsapp size={24} />
);

const Footer = () => {
    const [email, setEmail] = useState('');
    const [joined, setJoined] = useState(false);
    const [subError, setSubError] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return;

        setSubError('');
        try {
            const res = await api.post('/newsletter/subscribe', { email: trimmedEmail });
            if (res.status === 200 || res.status === 201) {
                setJoined(true);
                setEmail('');
            }
        } catch (err) {
            // 409 means already subscribed, which we can treat as success for the user
            if (err.response?.status === 409) {
                setJoined(true);
                setEmail('');
            } else {
                setSubError(err.response?.data?.message || 'Something went wrong. Try again.');
            }
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
                            <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
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
                            <li><Link to="/collections/all?category=Watches">Watches</Link></li>
                            <li><Link to="/collections/all?category=Perfumes">Perfumes</Link></li>
                            <li><Link to="/collections/all?category=Belts">Belts</Link></li>
                        </ul>
                    </div>

                    {/* Col 3 — Support */}
                    <div className="footer-col">
                        <h4 className="footer-col-heading">Support</h4>
                        <ul className="footer-link-list">
                            <li><Link to="/auth">Login / Register</Link></li>
                            <li><Link to="/orders">Track Order</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/return-refund">Return & Refund</Link></li>
                            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
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
                                {subError && <p className="footer-sub-error">{subError}</p>}
                            </form>
                        )}
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <p className="footer-copyright">© {new Date().getFullYear()} Wavway. All rights reserved.</p>
                    <div className="footer-legal-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms">Terms</Link>
                        <Link to="/return-refund">Refund</Link>
                        <Link to="/shipping-policy">Shipping</Link>
                        <Link to="/cookie-policy">Cookie</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
