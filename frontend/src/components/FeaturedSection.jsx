import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/featured-section.css';

<<<<<<< HEAD
const featuredItems = [
    {
        id: 1,
        title: 'Caring for your leather bag',
        excerpt: 'Essential tips to keep your leather accessories looking pristine for years to come.',
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop', // Leather care/fashion
        date: 'Jan 10, 2026'
    },
    {
        id: 2,
        title: 'Spring Collection Preview',
        excerpt: 'Get an exclusive first look at our upcoming spring collection featuring vibrant colors.',
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop', // Fashion model
        date: 'Jan 8, 2026'
    }
];

const FeaturedSection = () => {
    return (
        <section className="section featured-section">
            <div className="container">
                <h2 className="section-title">Featured</h2>

                <div className="featured-grid">
                    {featuredItems.map(item => (
                        <article key={item.id} className="featured-card">
                            <div className="featured-image-wrapper">
                                <img src={item.image} alt={item.title} className="featured-image" />
                            </div>
                            <div className="featured-content">
                                <span className="featured-date">{item.date}</span>
                                <h3 className="featured-title">{item.title}</h3>
                                <p className="featured-excerpt">{item.excerpt}</p>
                                <Link to="/collections" className="read-more">Read More →</Link>
                            </div>
                        </article>
                    ))}
=======
const FeaturedSection = () => {
    return (
        <section className="section featured-section">
            <div className="container-fluid p-0"> {/* Use full width container if preferred, or standard container */}
                <div className="featured-categories-grid">

                    {/* MEN'S CATEGORY */}
                    <div className="featured-category-card men-card">
                        <div className="collection-overlay"></div>
                        <img
                            src="/images/banners/men-featured.png"
                            alt="Men's Collection"
                            className="bg-image"
                        />
                        <div className="category-content">
                            <h2 className="category-title">MEN</h2>
                            <Link to="/collections/men" className="btn-shop">SHOP MEN</Link>
                        </div>
                    </div>

                    {/* WOMEN'S CATEGORY */}
                    <div className="featured-category-card women-card">
                        <div className="collection-overlay"></div>
                        <img
                            src="/images/banners/women-featured.png"
                            alt="Women's Collection"
                            className="bg-image"
                        />
                        <div className="category-content">
                            <h2 className="category-title">WOMEN</h2>
                            <Link to="/collections/women" className="btn-shop">SHOP WOMEN</Link>
                        </div>
                    </div>

>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
