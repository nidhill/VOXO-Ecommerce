import React from 'react';
import '../styles/testimonials.css';

const REVIEWS = [
    {
        stars: 5,
        quote: "The watch quality is absolutely insane. Feels premium on the wrist and gets compliments every single day. Already ordered a second one.",
        name: "Arjun M.",
        tag: "Verified Buyer — Classic Black Watch",
    },
    {
        stars: 5,
        quote: "The perfume lasts all day — I applied it in the morning and still got compliments at 10 pm. Packaging was beautiful too.",
        name: "Sneha K.",
        tag: "Verified Buyer — Oud Noir Perfume",
        featured: true,
    },
    {
        stars: 5,
        quote: "The leather belt is so clean and minimal. Fits perfectly and the buckle feels solid. This is my go-to belt now.",
        name: "Rahul T.",
        tag: "Verified Buyer — Premium Leather Belt",
    },
    {
        stars: 5,
        quote: "Fast shipping, beautiful packaging, and the product was exactly as shown. WAVWAY has become my go-to store for accessories.",
        name: "Meera R.",
        tag: "Verified Buyer — Sunglasses",
    },
    {
        stars: 5,
        quote: "Bought the sunglasses and everyone keeps asking where I got them from. Sleek design, premium feel, perfect fit.",
        name: "Kiran L.",
        tag: "Verified Buyer — Aviator Sunglasses",
    },
    {
        stars: 5,
        quote: "Love the minimalist watch design. Clean, versatile, and goes with everything. Highly recommend to anyone looking for quality.",
        name: "Divya W.",
        tag: "Verified Buyer — Mesh Strap Watch",
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
