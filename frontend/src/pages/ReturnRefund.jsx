import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'Eligibility for Returns & Refunds',
        content: (
            <>
                <p>Returns or refunds are accepted only under the following conditions:</p>
                <ul>
                    <li>The customer receives a damaged product, or</li>
                    <li>The customer receives an incorrect or changed product different from the order placed.</li>
                </ul>
                <p>We do not accept returns, refunds, or exchanges for:</p>
                <ul>
                    <li>Change of mind</li>
                    <li>Size issues</li>
                    <li>Personal preference</li>
                    <li>Minor color differences due to lighting or screen settings</li>
                    <li>Used or damaged products after delivery</li>
                </ul>
            </>
        ),
    },
    {
        num: '02',
        title: 'Mandatory Unboxing Video Requirement',
        content: (
            <>
                <p>To request a return, refund, or replacement, customers must provide:</p>
                <ul>
                    <li>A complete 360-degree unboxing video recorded from the beginning of opening the sealed package until the product is fully shown</li>
                    <li>The damage, defect, or incorrect product must be clearly visible in the same video</li>
                    <li>The video must be recorded continuously in a single take</li>
                </ul>
                <p>The following are strictly not accepted:</p>
                <ul>
                    <li>Edited videos, cut or paused recordings</li>
                    <li>Filtered or modified videos</li>
                    <li>Videos recorded after opening the package</li>
                    <li>Incomplete recordings</li>
                </ul>
                <div className="legal-notice" style={{ marginTop: '16px', padding: '16px', background: '#fff5f5', borderLeft: '4px solid #f87171', borderRadius: '4px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#991b1b' }}>
                        <strong>⚠️ Warning:</strong> Claims submitted without a valid continuous unboxing video may be automatically rejected.
                    </p>
                </div>
            </>
        ),
    },
    {
        num: '03',
        title: 'Reporting Time',
        content: (
            <p>Customers must report damaged or incorrect products within <strong>24 hours</strong> of delivery. Requests submitted after the reporting period may not be eligible for review.</p>
        ),
    },
    {
        num: '04',
        title: 'Verification Process',
        content: (
            <>
                <p>Once the return request and unboxing video are received, Wavway will review and verify the claim. Wavway reserves the right to:</p>
                <ul>
                    <li>Approve or reject return requests</li>
                    <li>Request additional proof if necessary</li>
                    <li>Determine whether the product qualifies for refund or replacement</li>
                </ul>
            </>
        ),
    },
    {
        num: '05',
        title: 'Refund Method',
        content: (
            <>
                <p>If approved, refunds will be processed through the original payment method used during checkout. Processing timelines may vary depending on the payment provider, bank processing times, and international systems.</p>
                <p>Shipping charges, customs duties, and handling fees may be non-refundable where applicable.</p>
            </>
        ),
    },
    {
        num: '06',
        title: 'Replacement Policy',
        content: (
            <p>In eligible cases, Wavway may offer product replacement, store credit, or a partial/full refund. The resolution method will be decided after reviewing the claim.</p>
        ),
    },
    {
        num: '07',
        title: 'Non-Returnable Items',
        content: (
            <>
                <p>The following items are generally non-returnable unless received damaged or incorrect:</p>
                <ul>
                    <li>Perfumes that have been opened or used</li>
                    <li>Worn footwear or clothing</li>
                    <li>Used accessories or wallets</li>
                    <li>Products without original packaging</li>
                </ul>
            </>
        ),
    },
    {
        num: '08',
        title: 'International Orders',
        content: (
            <p>For international orders, customers may be responsible for return shipping charges, customs duties, and import/export fees. Delivery delays caused by customs or courier services are beyond Wavway’s control.</p>
        ),
    },
    {
        num: '09',
        title: 'Contact for Returns',
        content: (
            <>
                <p>For return or refund requests, contact:</p>
                <ul>
                    <li><strong>Wavway</strong></li>
                    <li>Email: <a href="mailto:wavwayofficial@gmail.com">wavwayofficial@gmail.com</a></li>
                    <li>Phone/WhatsApp: <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer">+91 97448 11272</a></li>
                </ul>
                <p>Please include your <strong>Order number</strong>, a clear <strong>issue description</strong>, and the <strong>complete unboxing video</strong>.</p>
            </>
        ),
    },
];

const ReturnRefund = () => {
    useMeta('Return & Refund Policy', 'Read our detailed Return & Refund Policy. Learn about unboxing video requirements and eligibility.');

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Legal</span>
                    <h1 className="legal-title">Return &amp; Refund Policy</h1>
                    <p className="legal-subtitle">
                        Please read our policy carefully before making a purchase.
                        Last updated: May 10, 2026.
                    </p>
                </div>
            </div>

            <div className="legal-body">
                <div className="legal-intro" style={{ marginBottom: '40px', color: '#555555' }}>
                    <p>At Wavway, customer satisfaction is important to us. By placing an order on Wavway, you agree to the terms outlined below.</p>
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
                <Link to="/shipping-policy" className="legal-nav-link">Shipping Policy →</Link>
            </div>
        </div>
    );
};

export default ReturnRefund;
