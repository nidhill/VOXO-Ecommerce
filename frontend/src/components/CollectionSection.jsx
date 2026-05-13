import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getHomepageBanners } from '../api/settings';
import '../styles/collection-section.css';

const CollectionSection = () => {
    const { data: banners } = useQuery({
        queryKey: ['homepage-banners'],
        queryFn: getHomepageBanners,
        staleTime: 5 * 60 * 1000,
    });

    const collections = [
        {
            id: 1,
            title: 'Men',
            subtitle: 'Bold essentials for the modern man.',
            image: banners?.men || '',
            link: '/collections/men',
        },
        {
            id: 2,
            title: 'Women',
            subtitle: 'Effortless style, curated for her.',
            image: banners?.women || '',
            link: '/collections/women',
        },
    ];

    return (
        <section className="collection-section">
            <div className="container">
                <div className="collection-header">
                    <div className="header-left">
                        <span className="collection-eyebrow">Explore Our DNA</span>
                        <h2 className="collection-main-title">Shop by Collection</h2>
                    </div>
                    <Link to="/collections/all" className="collection-view-all">
                        View All Collections <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="collection-grid-premium">
                    {collections.map(collection => (
                        <div key={collection.id} className="collection-item">
                            <Link to={collection.link} className="collection-card-premium">
                                <div className="collection-img-wrap">
                                    {collection.image && (
                                        <img src={collection.image} alt={collection.title} className="collection-img" />
                                    )}
                                </div>
                                <div className="collection-info-premium">
                                    <h3 className="collection-card-title">{collection.title}</h3>
                                    <p className="collection-card-sub">{collection.subtitle}</p>
                                    <span className="collection-cta">
                                        Shop Now <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CollectionSection;
