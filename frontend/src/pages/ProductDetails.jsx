import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getProducts } from '../api/products';
import { pageTransition } from '../utils/animations';
import { ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Shield, RotateCcw, Truck, ArrowLeft } from 'lucide-react';
import useMeta from '../hooks/useMeta';
import SkeletonProductDetail from '../components/skeletons/SkeletonProductDetail';
import '../styles/product-details.css';

const ADMIN_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [added, setAdded] = useState(false);

    useMeta(
        product ? product.name : 'Product',
        product ? `${product.name} — ${product.description || 'Shop now on WAVWAY'}` : '',
        product?.images?.[0] || undefined,
        typeof window !== 'undefined' ? window.location.href : undefined
    );

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const all = await getProducts();
                const found = all.find(p => String(p.id) === String(id) || String(p._id) === String(id));
                setProduct(found || null);
            } catch (err) {
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <SkeletonProductDetail />;

    if (!product) return (
        <div className="pd-not-found">
            <h2>Product not found</h2>
            <Link to="/" className="pd-back-btn"><ArrowLeft size={16} /> Back to shop</Link>
        </div>
    );

    const images = product.images || [];
    const mainImage = images[selectedIdx] || '';
    const details = product.details || product.composition || [];
    const salePrice = product.price;
    const originalPrice = product.discountPrice && product.discountPrice > product.price ? product.discountPrice : null;
    const discountPct = originalPrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : null;

    const handlePrev = () => setSelectedIdx(i => (i - 1 + images.length) % images.length);
    const handleNext = () => setSelectedIdx(i => (i + 1) % images.length);

    const handleAddToCart = (e) => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product);
        navigate('/checkout');
    };

    return (
        <motion.div className="pd-page" {...pageTransition}>

            {/* Breadcrumb */}
            <div className="pd-breadcrumb">
                <div className="container pd-breadcrumb-inner">
                    <Link to="/" className="pd-crumb">Home</Link>
                    <span className="pd-crumb-sep">/</span>
                    <Link to={`/collections/${product.gender?.toLowerCase()}`} className="pd-crumb">{product.gender}</Link>
                    <span className="pd-crumb-sep">/</span>
                    <span className="pd-crumb pd-crumb-active">{product.name}</span>
                </div>
            </div>

            <div className="container pd-grid">

                {/* ── Gallery Column ── */}
                <div className="pd-gallery">

                    {/* Vertical thumbnails (desktop) */}
                    {images.length > 1 && (
                        <div className="pd-thumbs">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    className={`pd-thumb ${selectedIdx === i ? 'active' : ''}`}
                                    onClick={() => setSelectedIdx(i)}
                                >
                                    <img src={img} alt={`${product.name} — view ${i + 1}`} loading="lazy" decoding="async" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main image */}
                    <div className="pd-main-img-wrap">
                        {product.tag && <span className="pd-img-tag">{product.tag}</span>}
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedIdx}
                                src={mainImage}
                                alt={product.name}
                                className="pd-main-img"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/700x700/f4f4f4/999?text=No+Image'; }}
                            />
                        </AnimatePresence>
                        {images.length > 1 && (
                            <div className="pd-img-arrows">
                                <button className="pd-arrow" onClick={handlePrev}><ChevronLeft size={18} /></button>
                                <span className="pd-img-count">{selectedIdx + 1} / {images.length}</span>
                                <button className="pd-arrow" onClick={handleNext}><ChevronRight size={18} /></button>
                            </div>
                        )}
                    </div>

                    {/* Horizontal thumbnails (mobile) */}
                    {images.length > 1 && (
                        <div className="pd-thumbs-mobile">
                            {images.map((img, i) => (
                                <button key={i} className={`pd-thumb ${selectedIdx === i ? 'active' : ''}`} onClick={() => setSelectedIdx(i)}>
                                    <img src={img} alt={`${product.name} — view ${i + 1}`} loading="lazy" decoding="async" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Info Column ── */}
                <motion.div
                    className="pd-info"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/* Chips */}
                    <div className="pd-chips">
                        {product.gender && <span className="pd-chip pd-chip-gender">{product.gender}</span>}
                        {product.category && <span className="pd-chip pd-chip-cat">{product.category}</span>}
                    </div>

                    <h1 className="pd-name">{product.name}</h1>

                    {/* Price row */}
                    <div className="pd-price-row">
                        <span className="pd-price">₹{salePrice?.toLocaleString()}</span>
                        {originalPrice && <span className="pd-price-old">₹{originalPrice.toLocaleString()}</span>}
                        {discountPct && <span className="pd-save-chip">{discountPct}% OFF</span>}
                    </div>

                    <div className="pd-line" />

                    {product.description && (
                        <p className="pd-desc">{product.description}</p>
                    )}

                    {details.length > 0 && (
                        <div className="pd-details">
                            <p className="pd-details-title">Details</p>
                            <ul>
                                {details.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="pd-cta">
                        <button className="pd-btn-whatsapp" onClick={handleBuyNow}>
                            <MessageCircle size={18} />
                            Buy Now via WhatsApp
                        </button>
                        <button className={`pd-btn-cart ${added ? 'added' : ''}`} onClick={handleAddToCart}>
                            <ShoppingBag size={16} />
                            {added ? 'Added ✓' : 'Add to Cart'}
                        </button>
                    </div>

                    {/* Trust strip */}
                    <div className="pd-trust">
                        <div className="pd-trust-item">
                            <Truck size={14} />
                            <span>Free Delivery</span>
                        </div>
                        <div className="pd-trust-item">
                            <RotateCcw size={14} />
                            <span>Easy Returns</span>
                        </div>
                        <div className="pd-trust-item">
                            <Shield size={14} />
                            <span>100% Authentic</span>
                        </div>
                    </div>

                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProductDetails;
