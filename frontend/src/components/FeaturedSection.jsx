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
    const menBanner = `${banners?.men || '/images/banners/men-featured.png'}${version}`;
    const womenBanner = `${banners?.women || '/images/banners/women-featured.png'}${version}`;

    return (
        <section className="section featured-section">
            <div className="container-fluid p-0"> {/* Use full width container if preferred, or standard container */}
                <div className="featured-categories-grid">

                    {/* MEN'S CATEGORY */}
                    <div className="featured-category-card men-card">
                        <div className="collection-overlay"></div>
                        <img
                            src={menBanner}
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
                            src={womenBanner}
                            alt="Women's Collection"
                            className="bg-image"
                        />
                        <div className="category-content">
                            <h2 className="category-title">WOMEN</h2>
                            <Link to="/collections/women" className="btn-shop">SHOP WOMEN</Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
