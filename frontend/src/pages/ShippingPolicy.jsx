import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'Shipping Availability',
        content: (
            <>
                <p>Wavway offers shipping across India and selected international destinations. Worldwide shipping is available where applicable.</p>
                <p>Shipping availability may vary depending on:</p>
                <ul>
                    <li>Customer location</li>
                    <li>Courier service coverage</li>
                    <li>Customs regulations</li>
                    <li>Product restrictions in certain countries</li>
                </ul>
            </>
        ),
    },
    {
        num: '02',
        title: 'Order Processing Time',
        content: (
            <>
                <p>Orders are generally processed within 1–5 business days after successful payment confirmation.</p>
                <p>Processing times may vary during high order volume periods, promotional sales, public holidays, or unforeseen operational delays.</p>
                <p>Customers will receive order confirmation and shipping updates through email, SMS, or WhatsApp where applicable.</p>
            </>
        ),
    },
    {
        num: '03',
        title: 'Delivery Time',
        content: (
            <>
                <p>Estimated delivery timelines:</p>
                <h4>India Orders</h4>
                <ul>
                    <li>Standard Delivery: Approximately 3–10 business days</li>
                </ul>
                <h4>International Orders</h4>
                <ul>
                    <li>Estimated Delivery: Approximately 7–21 business days depending on destination country and customs clearance</li>
                </ul>
                <p>Delivery timelines are estimates only and may vary due to courier delays, customs inspections, weather conditions, or remote area delivery limitations.</p>
                <p>Wavway is not responsible for delays caused by third-party courier services or customs authorities.</p>
            </>
        ),
    },
    {
        num: '04',
        title: 'Shipping Charges',
        content: (
            <p>Shipping charges may vary depending on delivery location, product weight/dimensions, shipping method, or promotional offers. Any applicable fees will be displayed during checkout before payment confirmation.</p>
        ),
    },
    {
        num: '05',
        title: 'Free Shipping',
        content: (
            <p>Wavway may offer free shipping promotions on selected orders, products, or regions. These offers may be modified or withdrawn at any time without prior notice.</p>
        ),
    },
    {
        num: '06',
        title: 'International Customs & Duties',
        content: (
            <>
                <p>For international shipments, customers may be responsible for customs duties, import taxes, VAT/GST charges, or clearance fees imposed by the destination country.</p>
                <p>These charges are determined by local customs authorities and are the responsibility of the customer. Wavway is not responsible for customs delays, rejected imports, or additional government charges.</p>
            </>
        ),
    },
    {
        num: '07',
        title: 'Address Accuracy',
        content: (
            <p>Customers are responsible for providing accurate and complete shipping information. Wavway is not responsible for delays, failed deliveries, or additional charges resulting from incorrect addresses. If an order is returned due to address errors, re-shipping charges may apply.</p>
        ),
    },
    {
        num: '08',
        title: 'Tracking Information',
        content: (
            <p>Tracking details will be shared once the order has been shipped. Customers can use the provided information to monitor delivery status through the courier provider.</p>
        ),
    },
    {
        num: '09',
        title: 'Lost, Stolen, or Delayed Packages',
        content: (
            <p>Once an order has been handed over to the courier partner, delivery responsibility is transferred to the shipping provider. Wavway is not liable for lost or stolen packages after confirmed delivery, or delays caused by courier companies. However, we will reasonably assist customers in resolving shipping-related issues where possible.</p>
        ),
    },
    {
        num: '10',
        title: 'Damaged Packages',
        content: (
            <p>If a package appears visibly damaged during delivery, customers are advised to record a proper unboxing video immediately. Damage claims must comply with our Return & Refund Policy requirements. Failure to provide valid proof may result in claim rejection.</p>
        ),
    },
    {
        num: '11',
        title: 'Contact Information',
        content: (
            <>
                <p>For shipping-related support or inquiries, contact:</p>
                <ul>
                    <li><strong>Wavway</strong></li>
                    <li>Email: <a href="mailto:wavwayofficial@gmail.com">wavwayofficial@gmail.com</a></li>
                    <li>Phone/WhatsApp: <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer">+91 97448 11272</a></li>
                </ul>
            </>
        ),
    },
];

const ShippingPolicy = () => {
    useMeta('Shipping Policy', 'Read Wavway’s Shipping Policy — information on delivery times, international shipping, and customs.');

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <div className="legal-hero-inner">
                    <span className="legal-eyebrow">Legal</span>
                    <h1 className="legal-title">Shipping Policy</h1>
                    <p className="legal-subtitle">
                        How orders are processed, shipped, and delivered.
                        Last updated: May 10, 2026.
                    </p>
                </div>
            </div>

            <div className="legal-body">
                <div className="legal-intro" style={{ marginBottom: '40px', color: '#555555' }}>
                    <p>Thank you for shopping with Wavway. This Shipping Policy explains how orders are processed, shipped, and delivered through our website.</p>
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
                <Link to="/return-refund" className="legal-nav-link">← Return &amp; Refund Policy</Link>
                <Link to="/contact" className="legal-nav-link">Contact Us →</Link>
            </div>
        </div>
    );
};

export default ShippingPolicy;
