import React from 'react';
import '../styles/testimonials.css';

const REVIEWS = [
    {
        stars: 5,
        quote: "The shoes are super comfortable and look even better in person. I wore them all day without any pain. Best purchase I've made this year!",
        name: "Vishnu Nair",
        tag: "Verified Buyer — Premium Sneakers",
    },
    {
        stars: 5,
        quote: "The perfume lasts all day — I applied it in the morning and still got compliments at 10 pm. Packaging was beautiful too. Definitely buying more!",
        name: "Athira Menon",
        tag: "Verified Buyer — Oud Noir Perfume",
        featured: true,
    },
];

const Stars = ({ count }) => (
    <div className="tes-stars" aria-label={`${count} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                fill={i < count ? '#c9a84c' : 'none'}
                stroke={i < count ? '#c9a84c' : '#ccc'}
                strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

const TestimonialsSection = () => (
    <section className="tes-section">
        <div className="tes-inner">

            <div className="tes-header">
                <span className="tes-eyebrow">Testimonials</span>
                <h2 className="tes-title">Real Results, Real People</h2>
            </div>

            <div className="tes-grid">
                {REVIEWS.map((r, i) => (
                    <div key={i} className={`tes-card${r.featured ? ' tes-card--featured' : ''}`}>
                        <Stars count={r.stars} />
                        <p className="tes-quote">"{r.quote}"</p>
                        <div className="tes-reviewer">
                            <span className="tes-name">{r.name}</span>
                            <span className="tes-tag">{r.tag}</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    </section>
);

export default TestimonialsSection;
