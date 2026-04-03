import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../api/products';
import SkeletonGrid from './skeletons/SkeletonGrid';
import '../styles/product-grid.css';

const ProductGrid = () => {
    const { addToCart } = useCart();
    const { requireAuth } = useAuth();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['new-arrivals'],
        queryFn: () => getProducts({})
    });

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        requireAuth(() => {
            const btn = e.currentTarget;
            gsap.to(btn, {
                scale: 0.9,
                duration: 0.1,
                ease: "power1.out",
                onComplete: () => {
                    gsap.to(btn, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
                }
            });
            addToCart(product);
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
    };

    if (isLoading) return (
        <section className="section product-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">New Arrivals</h2>
                </div>
                <SkeletonGrid count={4} />
            </div>
        </section>
    );

    if (products.length === 0) return null;

    return (
        <section className="section product-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">New Arrivals</h2>
                    <Link to="/collections" className="view-all-link">View All</Link>
                </div>

                <motion.div
                    className="product-grid"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {products.slice(0, 4).map(product => (
                        <motion.div key={product.id || product._id} className="product-card" variants={item}>
                            <div className="product-image-wrapper">
                                {product.tag && <span className="product-tag">{product.tag}</span>}
                                <Link to={`/product/${product.id || product._id}`}>
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x400?text=No+Image'}
                                        alt={product.name}
                                        className="product-image"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x400?text=No+Image'; }}
                                    />
                                </Link>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={(e) => handleAddToCart(e, product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                            <div className="product-info">
                                <Link to={`/product/${product.id || product._id}`} className="product-name">{product.name}</Link>
                                <span className="product-price">{product.formattedPrice || `₹${product.price?.toLocaleString('en-IN')}`}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProductGrid;
