import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'What Are Cookies?',
        content: (
            <p>
                Cookies are small text files that are stored on your device (computer, phone, or tablet)
                when you visit a website. They help the website remember your preferences and improve your
                browsing experience. Cookies cannot execute programs or deliver viruses to your device.
            </p>
        ),
    },
    {
        num: '02',
        title: 'How We Use Cookies',
        content: (
            <>
                <p>Wavway uses cookies and similar technologies to:</p>
                <ul>
                    <li>Keep you signed in across pages</li>
                    <li>Remember items in your shopping cart</li>
                    <li>Understand how visitors use our website</li>
                    <li>Improve website performance and user experience</li>
                    <li>Deliver relevant content and offers</li>
                </ul>
            </>
        ),
    },
    {
        num: '03',
        title: 'Types of Cookies We Use',
        content: (
            <>
                <h4>Strictly Necessary Cookies</h4>
                <p>
                    These cookies are essential for the website to function. They enable core features such
                    as authentication, cart functionality, and secure checkout. You cannot opt out of these
                    cookies.
                </p>
                <h4>Functional Cookies</h4>
                <p>
                    These cookies remember your preferences such as language settings and login details to
                    provide a personalised experience.
                </p>
                <h4>Analytics Cookies</h4>
                <p>
                    We may use analytics tools to understand how visitors interact with our website. This
                    data is aggregated and anonymous — it helps us improve content and navigation.
                </p>
                <h4>Session Cookies</h4>
                <p>
                    Session cookies are temporary and are deleted when you close your browser. We use them
                    to maintain your session while you browse the site.
                </p>
            </>
        ),
    },
    {
        num: '04',
        title: 'Third-Party Cookies',
        content: (
            <>
                <p>
                    Some cookies on our website are set by third-party services that appear on our pages.
                    We do not control these cookies. Third-party services we use may include:
                </p>
                <ul>
                    <li><strong>Google OAuth</strong> — for sign-in with Google</li>
                    <li><strong>Payment gateways</strong> — for secure transaction processing</li>
                    <li><strong>Analytics platforms</strong> — for usage data and performance monitoring</li>
                </ul>
                <p>
                    These third parties have their own privacy and cookie policies which we encourage you
                    to review.
                </p>
            </>
        ),
    },
    {
        num: '05',
        title: 'Managing Cookies',
        content: (
            <>
                <p>
                    You can control and manage cookies through your browser settings. Most browsers allow
                    you to:
                </p>
                <ul>
                    <li>View cookies that are stored on your device</li>
                    <li>Delete some or all cookies</li>
                    <li>Block cookies from specific websites</li>
                    <li>Block all cookies entirely</li>
                </ul>
                <p>
                    Please note that disabling certain cookies may affect the functionality of our website.
                    For example, disabling authentication cookies will prevent you from staying signed in.
                    To manage cookies in your browser, refer to your browser's help documentation.
                </p>
            </>
        ),
    },
    {
        num: '06',
        title: 'Cookie Retention',
        content: (
            <>
                <p>Cookies are stored for varying durations depending on their type:</p>
                <ul>
                    <li><strong>Session cookies</strong> — deleted when you close your browser</li>
                    <li><strong>Authentication tokens</strong> — expire after 15 minutes of inactivity (refreshed automatically while active)</li>
                    <li><strong>Refresh tokens</strong> — expire after 7 days</li>
                    <li><strong>Preference cookies</strong> — may persist for up to 1 year</li>
                </ul>
            </>
        ),
    },
    {
        num: '07',
        title: 'Updates to This Policy',
        content: (
            <p>
                We may update this Cookie Policy from time to time to reflect changes in technology,
                legislation, or our data practices. Any changes will be posted on this page with an
                updated date. We encourage you to review this policy periodically.
            </p>
        ),
    },
    {
        num: '08',
        title: 'Contact Us',
        content: (
            <>
                <p>If you have any questions about our use of cookies, please contact us:</p>
                <ul>
                    <li>WhatsApp: <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer">+91 97448 11272</a></li>
                    <li>Instagram: <a href="https://www.instagram.com/wavway.in/" target="_blank" rel="noopener noreferrer">@wavway.in</a></li>
                    <li>Email: support@wavway.in</li>
                </ul>
            </>
        ),
    },
];

const CookiePolicy = () => {
    useMeta('Cookie Policy', 'Learn how Wavway uses cookies and similar technologies to improve your browsing experience.');

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Legal</span>
                    <h1 className="legal-title">Cookie Policy</h1>
                    <p className="legal-subtitle">
                        How we use cookies and similar technologies on wavway.in.
                        Last updated: May 2026.
                    </p>
                </div>
            </div>

            <div className="legal-body">
                <div className="legal-toc">
                    <p className="legal-toc-label">Contents</p>
                    {SECTIONS.map(s => (
                        <a key={s.num} href={`#section-${s.num}`} className="legal-toc-item">
                            <span className="legal-toc-num">{s.num}</span>
                            <span>{s.title}</span>
                        </a>
                    ))}
                </div>

                <div className="legal-sections">
                    {SECTIONS.map(s => (
                        <section key={s.num} id={`section-${s.num}`} className="legal-section">
                            <div className="legal-section-num">{s.num}</div>
                            <div className="legal-section-content">
                                <h2 className="legal-section-title">{s.title}</h2>
                                {s.content}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <div className="legal-footer-nav">
                <Link to="/terms" className="legal-nav-link">← Terms &amp; Conditions</Link>
                <Link to="/privacy-policy" className="legal-nav-link">Privacy Policy →</Link>
            </div>
        </div>
    );
};

export default CookiePolicy;
