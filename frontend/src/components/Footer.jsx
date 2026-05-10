import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
import { API_BASE } from '../api/axios';

const InstagramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-grad)" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="white" strokeWidth="1.7" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="white" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5.5" fill="#25D366" />
        <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
