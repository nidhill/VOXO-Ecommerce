import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/collection-section.css';

const collections = [
    {
        id: 1,
        title: 'New Balance 550',
        image: 'https://images.unsplash.com/photo-1695459468644-717c8ae17eed?q=80&w=800&auto=format&fit=crop', // White/Green 550
    },
    {
        id: 2,
        title: 'New Balance 9060',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop', // Chunky runner style
    },
    {
        id: 3,
        title: 'Made in USA 990',
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop', // Classic aesthetic
    },
    {
        id: 4,
        title: 'New Balance 327',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop', // Retro style
    },
    {
        id: 5,
        title: 'Fresh Foam Running',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop', // Performance
    }
];

const CollectionSection = () => {
    return (
        <section className="section collection-section">
            <div className="container">
                <div className="collection-grid-new">
                    {collections.map(collection => (
                        <Link to={`/collections/${collection.title.toLowerCase().replace(/ /g, '-')}`} key={collection.id} className="collection-card-new">
                            <div className="collection-image-wrapper-new">
                                <img src={collection.image} alt={collection.title} className="collection-image-new" />
                            </div>
                            <h3 className="collection-title-new">
                                {collection.title}
                                <span className="underline"></span>
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CollectionSection;
