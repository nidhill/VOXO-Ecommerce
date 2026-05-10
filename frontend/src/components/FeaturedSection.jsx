import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHomepageBanners } from '../api/settings';
import '../styles/featured-section.css';

const FeaturedSection = () => {
    const { data: banners } = useQuery({
        queryKey: ['homepage-banners'],
        queryFn: getHomepageBanners,
        retry: 1,
    });

    const version = banners?.updatedAt ? `?v=${new Date(banners.updatedAt).getTime()}` : '';
    const menBanner = banners?.men ? `${banners.men}${version}` : null;
    const womenBanner = banners?.women ? `${banners.women}${version}` : null;

    if (!menBanner && !womenBanner) return null;

    return (
        <section className="featured-section">
            <div className="featured-section-header">
                <span className="featured-eyebrow">Shop by Category</span>
                <h2 className="featured-title">Explore the Collection</h2>
            </div>

            <div className="featured-categories-grid">

                {menBanner && (
                    <Link to="/collections/men" className="featured-category-card men-card">
                        <div className="featured-img-wrap">
                            <img src={menBanner} alt="Men's Collection" className="bg-image" />
                        </div>
                        <div className="category-content">
                            <div className="category-content-left">
                                <span className="category-label">Collection</span>
                                <h3 className="category-title">Men</h3>
                            </div>
                            <span className="btn-shop" aria-label="Shop Men">→</span>
                        </div>
                    </Link>
                )}

                {womenBanner && (
                    <Link to="/collections/women" className="featured-category-card women-card">
                        <div className="featured-img-wrap">
                            <img src={womenBanner} alt="Women's Collection" className="bg-image" />
                        </div>
                        <div className="category-content">
                            <div className="category-content-left">
                                <span className="category-label">Collection</span>
                                <h3 className="category-title">Women</h3>
                            </div>
                            <span className="btn-shop" aria-label="Shop Women">→</span>
                        </div>
                    </Link>
                )}

            </div>
        </section>
    );
};

export default FeaturedSection;
