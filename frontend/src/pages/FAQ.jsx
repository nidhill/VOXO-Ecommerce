import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/faq.css';

const FAQS = [
    {
        category: 'Orders & Payment',
        items: [
            {
                q: 'How do I place an order?',
                a: 'Browse our collections, select your product, and click "Add to Cart". Once you\'re ready, head to checkout, fill in your delivery details, and complete the payment. You\'ll receive an order confirmation on your registered email.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept UPI, credit/debit cards, net banking, and other popular payment methods available at checkout. All transactions are secured with industry-standard encryption.',
            },
            {
                q: 'Can I modify or cancel my order after placing it?',
                a: 'Orders can be modified or cancelled within 12 hours of placement. After that, the order may already be packed and dispatched. Please contact us immediately via WhatsApp at +91 88480 41999 if you need to make changes.',
            },
            {
                q: 'Will I get an invoice for my order?',
                a: 'Yes. An order confirmation with invoice details is sent to your registered email address after successful payment.',
            },
        ],
    },
    {
        category: 'Shipping & Delivery',
        items: [
            {
                q: 'Do you ship all over India?',
                a: 'Yes, we ship to all major cities and towns across India. Delivery typically takes 5–10 business days depending on your location.',
            },
            {
                q: 'Is there free shipping?',
                a: 'Yes! We offer free shipping on all orders above ₹3,000. For orders below this amount, a nominal shipping charge will be applied and shown at checkout.',
            },
            {
                q: 'How can I track my order?',
                a: 'Once your order is dispatched, you can track it from the "My Orders" section on our website. You can also contact us on WhatsApp with your order ID for a quick update.',
            },
            {
                q: 'What if my order is delayed?',
                a: 'Delays can occasionally happen due to courier issues or high demand. If your order hasn\'t arrived within 10 business days, please reach out to us on WhatsApp and we\'ll investigate immediately.',
            },
        ],
    },
    {
        category: 'Returns & Refunds',
        items: [
            {
                q: 'What is your return policy?',
                a: 'We accept returns within 7 days of delivery. Items must be unused, in original packaging, with all tags intact. Items that are worn, damaged, or missing packaging are not eligible for return.',
            },
            {
                q: 'How do I initiate a return?',
                a: 'Contact us on WhatsApp at +91 88480 41999 with your order ID and reason for return. Our team will guide you through the process.',
            },
            {
                q: 'How long does a refund take?',
                a: 'Once we receive and inspect the returned item, refunds are processed within 7–10 business days. The amount will be credited back to your original payment method.',
            },
            {
                q: 'Can I exchange a product?',
                a: 'Yes, exchanges are available for size or colour variations subject to stock availability. Contact us within 7 days of delivery to arrange an exchange.',
            },
        ],
    },
    {
        category: 'Products',
        items: [
            {
                q: 'Are the products original?',
                a: 'We clearly describe the quality and type of each product in the product listing. Please read the product description carefully before purchasing. If you have any doubts, feel free to ask us on WhatsApp before placing your order.',
            },
            {
                q: 'How do I find the right size?',
                a: 'Size information is mentioned in each product listing where applicable. If you\'re unsure, contact us on WhatsApp and we\'ll help you pick the right size based on your measurements.',
            },
            {
                q: 'Are product images accurate?',
                a: 'We make every effort to display product images as accurately as possible. However, slight colour variations may occur due to different screen settings. The actual product may vary slightly from what is displayed.',
            },
        ],
    },
    {
        category: 'Account & Support',
        items: [
            {
                q: 'Do I need an account to place an order?',
                a: 'Yes, creating an account allows you to track your orders, save your address, and enjoy a faster checkout experience. Registration is free and takes less than a minute.',
            },
            {
                q: 'I forgot my password. How do I reset it?',
                a: 'Click "Forgot Password" on the login page and enter your registered email address. You\'ll receive an OTP to reset your password.',
            },
            {
                q: 'How can I contact customer support?',
                a: 'The fastest way to reach us is via WhatsApp at +91 88480 41999. You can also DM us on Instagram @wavway.in. We typically respond within a few hours.',
            },
        ],
    },
];

const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
            <button className="faq-question" onClick={() => setOpen(o => !o)}>
                <span>{q}</span>
                <span className="faq-icon">{open ? '−' : '+'}</span>
            </button>
            {open && <div className="faq-answer"><p>{a}</p></div>}
        </div>
    );
};

const FAQ = () => {
    useMeta('FAQ', 'Frequently asked questions about orders, shipping, returns, products and support at Wavway.');

    return (
        <div className="faq-page">
            <div className="faq-hero">
                <div className="faq-hero-inner">
                    <span className="faq-eyebrow">Help Centre</span>
                    <h1 className="faq-title">Frequently Asked Questions</h1>
                    <p className="faq-subtitle">
                        Everything you need to know about shopping with Wavway.
                        Can't find your answer?{' '}
                        <a href="https://wa.me/918848041999" target="_blank" rel="noopener noreferrer">
                            Chat with us on WhatsApp
                        </a>.
                    </p>
                </div>
            </div>

            <div className="faq-body">
                {FAQS.map(section => (
                    <div key={section.category} className="faq-section">
                        <h2 className="faq-category">{section.category}</h2>
                        <div className="faq-list">
                            {section.items.map(item => (
                                <FAQItem key={item.q} q={item.q} a={item.a} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="faq-cta">
                <p className="faq-cta-text">Still have questions?</p>
                <a href="https://wa.me/918848041999" target="_blank" rel="noopener noreferrer" className="faq-cta-btn">
                    Chat with us on WhatsApp
                </a>
            </div>

            <div className="legal-footer-nav" style={{ maxWidth: '860px', margin: '0 auto' }}>
                <Link to="/privacy-policy" className="legal-nav-link">← Privacy Policy</Link>
                <Link to="/terms" className="legal-nav-link">Terms &amp; Conditions →</Link>
            </div>
        </div>
    );
};

export default FAQ;
