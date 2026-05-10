import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../styles/collection-section.css';

const collections = [
    {
        id: 1,
        title: 'Men',
        subtitle: 'Bold essentials for the modern man.',
        image: '/images/misc/Gemini_Generated_Image_ywl6c9ywl6c9ywl6.png',
        link: '/collections/all?gender=Men',
    },
    {
        id: 2,
        title: 'Women',
        subtitle: 'Effortless style, curated for her.',
        image: '/images/misc/for woman.webp',
        link: '/collections/all?gender=Women',
    },
];

const CollectionSection = () => {
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
                                    <img src={collection.image} alt={collection.title} className="collection-img" />
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
