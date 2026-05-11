import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'Coverage',
        content: (
            <p>Wavway offers shipping across India and selected international destinations. Worldwide shipping is available where applicable.</p>
        ),
    },
    {
        num: '02',
        title: 'Estimated Delivery Times',
        content: (
            <>
                <p>Delivery times may vary depending on:</p>
                <ul>
                    <li>Customer location</li>
                    <li>Courier partner availability</li>
                    <li>Customs clearance</li>
                    <li>Public holidays or unforeseen delays</li>
                </ul>
            </>
        ),
    },
    {
        num: '03',
        title: 'Customs & Duties',
        content: (
            <p>International customers may be responsible for customs duties, taxes, or import charges imposed by their country.</p>
        ),
    },
    {
        num: '04',
        title: 'Liability',
        content: (
            <p>Wavway is not liable for delays caused by courier services, customs authorities, natural events, or circumstances beyond our control.</p>
        ),
    },
];

const ShippingPolicy = () => {
    useMeta('Shipping Policy', 'Information about our shipping rates, timelines, and international delivery.');

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Legal</span>
                    <h1 className="legal-title">Shipping Policy</h1>
                    <p className="legal-subtitle">
                        Everything you need to know about our delivery process.
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
                <Link to="/return-refund" className="legal-nav-link">← Return &amp; Refund Policy</Link>
                <Link to="/contact" className="legal-nav-link">Contact Us →</Link>
            </div>
        </div>
    );
};

export default ShippingPolicy;
