import React from 'react';
import { Link } from 'react-router-dom';
import useMeta from '../hooks/useMeta';
import '../styles/legal.css';

const SECTIONS = [
    {
        num: '01',
        title: 'General Information',
        content: (
            <>
                <p>Wavway is an online fashion and lifestyle store offering footwear, clothing, wallets, accessories, and perfumes for men and women.</p>
                <p>By using this website, you confirm that:</p>
                <ul>
                    <li>You are at least 18 years old or using the website under parental supervision.</li>
                    <li>The information provided by you is accurate and complete.</li>
                    <li>You agree not to misuse the website or engage in fraudulent activities.</li>
                </ul>
            </>
        ),
    },
    {
        num: '02',
        title: 'Products & Descriptions',
        content: (
            <>
                <p>
                    Wavway strives to provide accurate product descriptions, images, pricing, and availability information. 
                    However, slight variations in color, texture, appearance, or packaging may occur due to photography, 
                    lighting, screen settings, or manufacturing differences.
                </p>
                <p>We reserve the right to:</p>
                <ul>
                    <li>Modify product pricing at any time</li>
                    <li>Update product details without prior notice</li>
                    <li>Discontinue products without liability</li>
                </ul>
            </>
        ),
    },
    {
        num: '03',
        title: 'Product Authenticity',
        content: (
            <>
                <p>All perfumes sold on Wavway are 100% authentic and genuine products.</p>
                <p>
                    Fashion products including footwear, clothing, wallets, sandals, and accessories are premium Vietnam 
                    and Chinese quality products inspired by international fashion trends and styles. Unless explicitly 
                    stated, these products are not claimed to be officially manufactured, licensed, or endorsed by the 
                    original global brands.
                </p>
                <p>Any brand names used are for style or reference purposes only.</p>
            </>
        ),
    },
    {
        num: '04',
        title: 'Orders & Acceptance',
        content: (
            <>
                <p>All orders placed on Wavway are subject to availability and confirmation.</p>
                <p>Wavway reserves the right to:</p>
                <ul>
                    <li>Cancel or refuse any order</li>
                    <li>Limit quantities purchased</li>
                    <li>Reject suspicious or fraudulent transactions</li>
                    <li>Request additional verification before processing an order</li>
                </ul>
                <p>Customers will receive confirmation notifications once orders are successfully placed.</p>
            </>
        ),
    },
    {
        num: '05',
        title: 'Pricing & Payments',
        content: (
            <>
                <p>All prices displayed on the website are subject to change without prior notice.</p>
                <p>Payments must be completed through approved payment methods available on the website.</p>
                <p>Wavway is not responsible for:</p>
                <ul>
                    <li>Payment gateway failures</li>
                    <li>Banking issues</li>
                    <li>Transaction delays caused by third-party providers</li>
                </ul>
            </>
        ),
    },
    {
        num: '06',
        title: 'Shipping & Delivery',
        content: (
            <>
                <p>Wavway offers shipping across India and selected international destinations. Worldwide shipping is available where applicable.</p>
                <p>Estimated delivery times may vary depending on:</p>
                <ul>
                    <li>Customer location</li>
                    <li>Courier partner availability</li>
                    <li>Customs clearance</li>
                    <li>Public holidays or unforeseen delays</li>
                </ul>
                <p>International customers may be responsible for customs duties, taxes, or import charges imposed by their country.</p>
                <p>Wavway is not liable for delays caused by courier services, customs authorities, natural events, or circumstances beyond our control.</p>
            </>
        ),
    },
    {
        num: '07',
        title: 'Return & Refund Policy',
        content: (
            <>
                <p>Returns or refunds are accepted only if:</p>
                <ul>
                    <li>The customer receives a damaged product, or</li>
                    <li>The customer receives an incorrect or changed product.</li>
                </ul>
                <p>To qualify for a return or refund request, customers must provide:</p>
                <ul>
                    <li>A complete 360-degree unboxing video</li>
                    <li>The video must be recorded continuously from opening the sealed package until the product is fully shown</li>
                    <li>The damage or incorrect item must be clearly visible in the same video</li>
                    <li>No cuts, edits, pauses, filters, or modifications are permitted</li>
                </ul>
                <p>Claims submitted without a valid continuous unboxing video may be rejected.</p>
                <p>Products that are used, damaged after delivery, or returned without proper evidence will not be eligible for refund or replacement.</p>
                <p>Wavway reserves the right to inspect and verify all claims before approving any return, refund, or replacement request.</p>
            </>
        ),
    },
    {
        num: '08',
        title: 'Intellectual Property',
        content: (
            <>
                <p>All website content including logos, images, text, graphics, designs, and layout are the property of Wavway unless otherwise stated.</p>
                <p>Unauthorized copying, reproduction, resale, or misuse of website content is strictly prohibited.</p>
            </>
        ),
    },
    {
        num: '09',
        title: 'User Conduct',
        content: (
            <>
                <p>Users agree not to:</p>
                <ul>
                    <li>Use the website for any illegal activities</li>
                    <li>Attempt unauthorized access to systems</li>
                    <li>Upload malicious software or harmful content</li>
                    <li>Interfere with website functionality</li>
                    <li>Submit false or misleading information</li>
                </ul>
                <p>Violation of these terms may result in account suspension or legal action.</p>
            </>
        ),
    },
    {
        num: '10',
        title: 'Limitation of Liability',
        content: (
            <>
                <p>Wavway shall not be held liable for:</p>
                <ul>
                    <li>Indirect or incidental damages</li>
                    <li>Delays in delivery</li>
                    <li>Product misuse by customers</li>
                    <li>Temporary website interruptions</li>
                    <li>Third-party service failures</li>
                </ul>
                <p>Customers use the website and products at their own discretion and risk.</p>
            </>
        ),
    },
    {
        num: '11',
        title: 'Third-Party Services',
        content: (
            <p>The website may use third-party services including payment gateways, courier providers, analytics tools, and marketing services. Wavway is not responsible for the policies or actions of third-party providers.</p>
        ),
    },
    {
        num: '12',
        title: 'Privacy',
        content: (
            <p>Customer information collected through the website is handled according to our Privacy Policy. By using the website, you consent to the collection and use of information as described in the Privacy Policy.</p>
        ),
    },
    {
        num: '13',
        title: 'Changes to Terms',
        content: (
            <p>Wavway reserves the right to modify or update these Terms & Conditions at any time without prior notice. Continued use of the website after updates constitutes acceptance of the revised terms.</p>
        ),
    },
    {
        num: '14',
        title: 'Governing Law',
        content: (
            <p>These Terms & Conditions shall be governed and interpreted in accordance with the laws applicable in India. Any disputes arising from the use of the website shall be subject to the jurisdiction of the appropriate courts in India.</p>
        ),
    },
    {
        num: '15',
        title: 'Contact Information',
        content: (
            <>
                <p>For support or inquiries, contact:</p>
                <ul>
                    <li><strong>Wavway</strong></li>
                    <li>Email: <a href="mailto:wavwayofficial@gmail.com">wavwayofficial@gmail.com</a></li>
                    <li>Phone/WhatsApp: <a href="https://wa.me/919744811272" target="_blank" rel="noopener noreferrer">+91 97448 11272</a></li>
                    <li>Address: Calicut, India</li>
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
                        Last updated: May 10, 2026.
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
