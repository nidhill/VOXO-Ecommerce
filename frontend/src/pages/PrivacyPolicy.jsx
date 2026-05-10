import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'Information We Collect',
        content: (
            <>
                <p>When you use our website, we may collect the following information:</p>
                <h4>Personal Information</h4>
                <ul>
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Mobile number</li>
                    <li>Billing and shipping address</li>
                    <li>Order details</li>
                    <li>Payment-related information</li>
                </ul>
                <h4>Technical Information</h4>
                <ul>
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Website usage data</li>
                    <li>Cookies and tracking technologies</li>
                </ul>
            </>
        ),
    },
    {
        num: '02',
        title: 'How We Use Your Information',
        content: (
            <ul>
                <li>Process and deliver orders</li>
                <li>Provide customer support</li>
                <li>Send order confirmations and tracking updates</li>
                <li>Improve website functionality and customer experience</li>
                <li>Prevent fraud and unauthorized transactions</li>
                <li>Send promotional offers, updates, and marketing communications (only where permitted)</li>
            </ul>
        ),
    },
    {
        num: '03',
        title: 'Payment Security',
        content: (
            <p>All payments are processed through secure third-party payment gateways. Wavway does not store complete debit card, credit card, or banking credentials on our servers. We take reasonable security measures to protect customer information from unauthorized access, misuse, or disclosure.</p>
        ),
    },
    {
        num: '04',
        title: 'Cookies & Tracking Technologies',
        content: (
            <>
                <p>Our website may use cookies and similar technologies to:</p>
                <ul>
                    <li>Maintain user sessions</li>
                    <li>Save cart information</li>
                    <li>Analyze website traffic</li>
                    <li>Improve website performance and shopping experience</li>
                </ul>
                <p>You may disable cookies through your browser settings if preferred.</p>
            </>
        ),
    },
    {
        num: '05',
        title: 'Sharing of Information',
        content: (
            <>
                <p>Wavway does not sell, rent, or trade customer personal information to third parties.</p>
                <p>Information may only be shared with:</p>
                <ul>
                    <li>Shipping and logistics partners</li>
                    <li>Payment processing providers</li>
                    <li>Government or legal authorities when legally required</li>
                </ul>
            </>
        ),
    },
    {
        num: '06',
        title: 'Shipping & Delivery',
        content: (
            <>
                <p>Wavway offers shipping both within India and internationally. Worldwide shipping is available to selected countries and regions.</p>
                <p>Delivery timelines may vary depending on:</p>
                <ul>
                    <li>Customer location</li>
                    <li>Courier availability</li>
                    <li>Customs clearance processes</li>
                    <li>Public holidays or unforeseen delays</li>
                </ul>
                <p>Customers are responsible for ensuring that shipping details provided during checkout are accurate and complete. International customers may be responsible for customs duties, taxes, or import charges applicable in their country.</p>
            </>
        ),
    },
    {
        num: '07',
        title: 'Return & Refund Policy',
        content: (
            <>
                <p>At Wavway, returns or refunds are accepted only under the following conditions:</p>
                <ul>
                    <li>The customer receives a <strong>damaged product</strong>, or</li>
                    <li>The customer receives a <strong>wrong / changed product</strong> different from the order placed.</li>
                </ul>
                <p>To request a return or refund, customers must provide:</p>
                <ul>
                    <li>A complete <strong>360-degree unboxing video</strong> recorded from the beginning of opening the package until the product is fully shown.</li>
                    <li>The video must clearly display the damage, defect, or incorrect item received.</li>
                    <li>The video must be recorded <strong>continuously in a single take</strong>.</li>
                    <li><strong>No cuts, pauses, edits, filters, or video modifications</strong> are allowed.</li>
                </ul>
                <div className="legal-notice">
                    <span className="legal-notice-icon">⚠️</span>
                    <p>Claims submitted without a valid continuous unboxing video may be rejected. Used products, opened products without valid proof, or damage caused after delivery will not be eligible for return or refund. Wavway reserves the right to inspect and verify all claims before approving refunds or replacements.</p>
                </div>
            </>
        ),
    },
    {
        num: '08',
        title: 'Product Authenticity Statement',
        content: (
            <>
                <p>All <strong>perfumes</strong> sold on Wavway are <strong>100% authentic and genuine</strong> products sourced from trusted suppliers.</p>
                <p>Fashion items including footwear, clothing, wallets, sandals, and similar accessories are <strong>premium Vietnam and Chinese quality products</strong> inspired by popular international designs and styles. These items are not claimed to be officially manufactured, licensed, or authorized by the original global brands unless explicitly stated.</p>
                <p>Brand names mentioned on the website are used only for descriptive and style reference purposes where applicable.</p>
            </>
        ),
    },
    {
        num: '09',
        title: 'Customer Rights',
        content: (
            <>
                <p>Customers may:</p>
                <ul>
                    <li>Request correction of personal information</li>
                    <li>Request deletion of account information where applicable</li>
                    <li>Opt out of promotional communications</li>
                </ul>
                <p>Requests may be submitted through our customer support channels.</p>
            </>
        ),
    },
    {
        num: '10',
        title: 'Data Protection',
        content: (
            <p>We implement reasonable administrative, technical, and security measures to help protect customer information against unauthorized access, loss, misuse, or alteration. However, no online transmission or electronic storage method can be guaranteed as completely secure.</p>
        ),
    },
    {
        num: '11',
        title: "Children's Privacy",
        content: (
            <p>Wavway services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors.</p>
        ),
    },
    {
        num: '12',
        title: 'Policy Updates',
        content: (
            <p>Wavway may update or modify this Privacy Policy at any time without prior notice. Updated policies will be posted on this page with the revised effective date.</p>
        ),
    },
    {
        num: '13',
        title: 'Contact Us',
        content: (
            <div className="legal-contact-block">
                <p className="legal-contact-brand">Wavway</p>
                <a href="mailto:wavwayofficial@gmail.com" className="legal-contact-row">
                    <span className="legal-contact-label">Email</span>
                    <span>wavwayofficial@gmail.com</span>
                </a>
                <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer" className="legal-contact-row">
                    <span className="legal-contact-label">WhatsApp</span>
                    <span>+91 97448 11272</span>
                </a>
            </div>
        ),
    },
];

const PrivacyPolicy = () => {
    useMeta('Privacy Policy', 'Read the Wavway Privacy Policy — how we collect, use, and protect your information.');

    return (
        <div className="legal-page">
            {/* Hero */}
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Legal</span>
                    <h1 className="legal-hero-title">Privacy Policy</h1>
                    <p className="legal-hero-sub">Last updated: <strong>May 10, 2026</strong></p>
                </div>
            </div>

            <div className="legal-layout">
                {/* Sticky sidebar TOC */}
                <aside className="legal-toc">
                    <p className="legal-toc-label">Contents</p>
                    <nav>
                        {SECTIONS.map(s => (
                            <a key={s.num} href={`#section-${s.num}`} className="legal-toc-link">
                                <span className="legal-toc-num">{s.num}</span>
                                {s.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Body */}
                <main className="legal-body">
                    <p className="legal-intro">
                        Welcome to Wavway. We value your privacy and are committed to protecting your personal information.
                        This Privacy Policy explains how Wavway collects, uses, stores, and safeguards your information when
                        you visit or make a purchase from our website. By accessing or using our website, you agree to the
                        terms outlined in this Privacy Policy.
                    </p>

                    {SECTIONS.map(s => (
                        <section key={s.num} id={`section-${s.num}`} className="legal-section">
                            <div className="legal-section-head">
                                <span className="legal-section-num">{s.num}</span>
                                <h2 className="legal-section-title">{s.title}</h2>
                            </div>
                            <div className="legal-section-body">
                                {s.content}
                            </div>
                        </section>
                    ))}

                    <div className="legal-footer-note">
                        <Link to="/" className="legal-back-btn">← Back to Store</Link>
                        <p>© {new Date().getFullYear()} Wavway. All rights reserved.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
