import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'Conditions for Returns',
        content: (
            <>
                <p>Returns or refunds are accepted only if:</p>
                <ul>
                    <li>The customer receives a damaged product, or</li>
                    <li>The customer receives an incorrect or changed product.</li>
                </ul>
            </>
        ),
    },
    {
        num: '02',
        title: 'Unboxing Video Requirement',
        content: (
            <>
                <p>To qualify for a return or refund request, customers must provide:</p>
                <ul>
                    <li>A complete 360-degree unboxing video</li>
                    <li>The video must be recorded continuously from opening the sealed package until the product is fully shown</li>
                    <li>The damage or incorrect item must be clearly visible in the same video</li>
                    <li>No cuts, edits, pauses, filters, or modifications are permitted</li>
                </ul>
                <p>Claims submitted without a valid continuous unboxing video may be rejected.</p>
            </>
        ),
    },
    {
        num: '03',
        title: 'Eligibility',
        content: (
            <p>Products that are used, damaged after delivery, or returned without proper evidence will not be eligible for refund or replacement. Wavway reserves the right to inspect and verify all claims before approving any return, refund, or replacement request.</p>
        ),
    },
];

const ReturnRefund = () => {
    useMeta('Return & Refund Policy', 'Learn about our return and refund policies, including the unboxing video requirement.');

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Legal</span>
                    <h1 className="legal-title">Return &amp; Refund Policy</h1>
                    <p className="legal-subtitle">
                        Important information regarding returns, refunds, and replacements.
                        Last updated: May 10, 2026.
                    </p>
                </div>
            </div>

            <div className="legal-body">
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
