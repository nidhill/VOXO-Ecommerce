import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'Acceptance of Terms',
        content: (
            <p>
                By accessing or using the Wavway website (wavway.in), you agree to be bound by these Terms and
                Conditions. If you do not agree to these terms, please do not use our website or services. We
                reserve the right to update these terms at any time, and continued use of the site constitutes
                acceptance of any changes.
            </p>
        ),
    },
    {
        num: '02',
        title: 'Products & Pricing',
        content: (
            <>
                <p>All products listed on Wavway are subject to availability. We reserve the right to:</p>
                <ul>
                    <li>Modify or discontinue any product without prior notice</li>
                    <li>Correct pricing errors at any time before order confirmation</li>
                    <li>Limit quantities available for purchase</li>
                    <li>Refuse or cancel orders at our discretion</li>
                </ul>
                <p>
                    All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless
                    stated otherwise.
                </p>
            </>
        ),
    },
    {
        num: '03',
        title: 'Orders & Payment',
        content: (
            <>
                <p>When you place an order on Wavway:</p>
                <ul>
                    <li>You confirm that all information provided is accurate and complete</li>
                    <li>Your order is subject to acceptance and availability</li>
                    <li>We will send an order confirmation to your registered email</li>
                    <li>Payment must be completed before your order is processed</li>
                </ul>
                <p>
                    We accept payments via UPI, credit/debit cards, net banking, and other supported payment
                    methods. All transactions are secured using industry-standard encryption.
                </p>
            </>
        ),
    },
    {
        num: '04',
        title: 'Shipping & Delivery',
        content: (
            <>
                <p>
                    We ship across India. Estimated delivery times are 5–10 business days depending on your
                    location. Wavway is not responsible for delays caused by:
                </p>
                <ul>
                    <li>Incorrect shipping addresses provided by customers</li>
                    <li>Courier or logistics delays beyond our control</li>
                    <li>Natural disasters, strikes, or other force majeure events</li>
                    <li>Customs or regulatory delays</li>
                </ul>
                <p>
                    Free shipping is available on orders above ₹3,000. Shipping charges for other orders will
                    be displayed at checkout.
                </p>
            </>
        ),
    },
    {
        num: '05',
        title: 'Returns & Exchanges',
        content: (
            <>
                <p>
                    We want you to be satisfied with your purchase. Returns are accepted within 7 days of
                    delivery, provided the item is:
                </p>
                <ul>
                    <li>Unused and in its original condition</li>
                    <li>In original packaging with all tags intact</li>
                    <li>Accompanied by the original invoice or order confirmation</li>
                </ul>
                <p>
                    Items that are damaged, used, or missing original packaging will not be eligible for
                    return. To initiate a return, contact us via WhatsApp or email. Refunds will be processed
                    within 7–10 business days after the returned item is received and inspected.
                </p>
            </>
        ),
    },
    {
        num: '06',
        title: 'Intellectual Property',
        content: (
            <p>
                All content on this website — including images, text, logos, graphics, and product
                descriptions — is the property of Wavway and is protected under applicable intellectual
                property laws. You may not reproduce, distribute, modify, or use any content without our
                prior written permission. Unauthorised use of our content may result in legal action.
            </p>
        ),
    },
    {
        num: '07',
        title: 'User Conduct',
        content: (
            <>
                <p>You agree not to:</p>
                <ul>
                    <li>Use the website for any unlawful or fraudulent purpose</li>
                    <li>Attempt to gain unauthorised access to our systems</li>
                    <li>Transmit any harmful, offensive, or disruptive content</li>
                    <li>Engage in any activity that disrupts the website's functionality</li>
                    <li>Scrape, copy, or misuse our product data or pricing information</li>
                </ul>
            </>
        ),
    },
    {
        num: '08',
        title: 'Limitation of Liability',
        content: (
            <p>
                Wavway shall not be liable for any indirect, incidental, or consequential damages arising
                from the use of our products or services, including but not limited to loss of profits, data,
                or goodwill. Our maximum liability in any case shall be limited to the amount paid for the
                specific order in question.
            </p>
        ),
    },
    {
        num: '09',
        title: 'Governing Law',
        content: (
            <p>
                These Terms and Conditions are governed by the laws of India. Any disputes arising from the
                use of this website or purchase of our products shall be subject to the exclusive jurisdiction
                of the courts in Kerala, India.
            </p>
        ),
    },
    {
        num: '10',
        title: 'Contact Us',
        content: (
            <>
                <p>For any questions regarding these Terms and Conditions, please reach out to us:</p>
                <ul>
                    <li>WhatsApp: <a href="https://wa.me/918848041999" target="_blank" rel="noopener noreferrer">+91 88480 41999</a></li>
                    <li>Instagram: <a href="https://www.instagram.com/wavway.in/" target="_blank" rel="noopener noreferrer">@wavway.in</a></li>
                    <li>Email: support@wavway.in</li>
                </ul>
            </>
        ),
    },
];

const TermsAndConditions = () => {
    useMeta('Terms & Conditions', 'Read the terms and conditions governing your use of Wavway and purchase of our products.');

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Legal</span>
                    <h1 className="legal-title">Terms &amp; Conditions</h1>
                    <p className="legal-subtitle">
                        Please read these terms carefully before using our website or placing an order.
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
                <Link to="/privacy-policy" className="legal-nav-link">← Privacy Policy</Link>
                <Link to="/cookie-policy" className="legal-nav-link">Cookie Policy →</Link>
            </div>
        </div>
    );
};

export default TermsAndConditions;
