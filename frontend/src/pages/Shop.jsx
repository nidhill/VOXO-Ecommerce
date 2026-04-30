import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import { pageTransition } from '../utils/animations';
import { X } from 'lucide-react';
import useMeta from '../hooks/useMeta';
import SkeletonGrid from '../components/skeletons/SkeletonGrid';
import '../styles/shop.css';
import '../styles/product-grid.css';

const GENDER_TABS = [
    { label: 'All', value: '' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
];

const CATEGORY_GROUPS = [
    { group: 'Footwear', items: ['Shoe', 'Slipper', 'Sandal', 'Socks'] },
    { group: 'Clothing', items: ['Shirt', 'Tshirt', 'Jacket', 'Pants', 'Joggers'] },
    { group: 'Accessories', items: ['Watch', 'Perfume', 'Belt', 'Sunglasses'] },
];

const Shop = () => {
    const { category: genderParam } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useMeta('Collections', "Browse WAVWAY's full collection — clothing, footwear and accessories for men, women and unisex.");

    const { data: fetchedProducts, isLoading } = useQuery({
        queryKey: ['products', genderParam, categoryFilter, searchQuery],
        queryFn: () => getProducts({
            gender: genderParam === 'men' ? 'Men' : genderParam === 'women' ? 'Women' : genderParam === 'unisex' ? 'Unisex' : undefined,
            category: categoryFilter,
            search: searchQuery,
        }),
    });

    const products = fetchedProducts || [];

    let title = genderParam && genderParam !== 'all'
        ? genderParam.charAt(0).toUpperCase() + genderParam.slice(1)
        : 'All Collections';
    if (searchQuery) title = `"${searchQuery}"`;

    const handleGenderTab = (val) => {
        searchParams.delete('category');
        setSearchParams(searchParams);
        if (val === '') navigate('/collections/all');
        else navigate(`/collections/${val}`);
    };

    const handleCategoryChip = (cat) => {
        if (categoryFilter === cat) {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    const clearFilter = () => {
        searchParams.delete('category');
        setSearchParams(searchParams);
    };

    return (
        <motion.div {...pageTransition} className="shop-page">

            {/* ── Editorial Header ─────────────────────────────────────── */}
            <div className="shop-hero">
                <div className="container">
                    <p className="shop-eyebrow">Collections</p>
                    <div className="shop-hero-row">
                        <h1 className="shop-editorial-title">{title}</h1>
                        <span className="shop-count">
                            {isLoading ? '—' : `${products.length} item${products.length !== 1 ? 's' : ''}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Sticky Filter Bar ──────────────────────────────────────── */}
            <div className="shop-filter-bar-wrap">
                <div className="container">

                    {/* Gender tabs */}
                    <div className="shop-gender-tabs">
                        {GENDER_TABS.map(tab => {
                            const isActive = (tab.value === '' && (!genderParam || genderParam === 'all'))
                                || tab.value === genderParam;
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => handleGenderTab(tab.value)}
                                    className={`shop-gender-tab${isActive ? ' active' : ''}`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}

                        <div className="shop-tab-divider" />

                        {/* Category chips */}
                        <div className="shop-chips-scroll">
                            {CATEGORY_GROUPS.map(({ group, items }, gIdx) => (
                                <React.Fragment key={group}>
                                    {gIdx > 0 && <div className="shop-chip-sep" />}
                                    <span className="shop-chip-group">{group}</span>
                                    {items.map(cat => {
                                        const isActive = categoryFilter === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => handleCategoryChip(cat)}
                                                className={`shop-chip${isActive ? ' active' : ''}`}
                                            >
                                                {isActive && <X size={9} strokeWidth={3} />}
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Products ──────────────────────────────────────────────── */}
            <div className="container shop-products-wrap">
                {isLoading ? (
                    <SkeletonGrid count={8} />
                ) : products.length === 0 ? (
                    <div className="shop-empty">
                        <p className="shop-empty-title">Nothing here yet</p>
                        <p className="shop-empty-sub">
                            {categoryFilter
                                ? `No products in "${categoryFilter}".`
                                : 'No products found.'}
                        </p>
                        {categoryFilter && (
                            <button onClick={clearFilter} className="shop-empty-clear">
                                Clear filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <motion.div
                                key={product._id || product.id}
                                className="product-card"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '0px' }}
                                transition={{ duration: 0.25 }}
                                style={{ willChange: 'opacity, transform' }}
                            >
                                <div className="product-image-wrapper">
                                    {product.tag && <span className="product-tag">{product.tag}</span>}
                                    <Link to={`/product/${product._id || product.id}`}>
                                        <img
                                            src={product.images?.[0] || 'https://placehold.co/300x400?text=No+Image'}
                                            alt={product.name}
                                            className="product-image"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x400?text=No+Image'; }}
                                        />
                                    </Link>
                                    <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </button>
                                </div>
                                <div className="product-info">
                                    <Link to={`/product/${product._id || product.id}`} className="product-name">{product.name}</Link>
                                    <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

        </motion.div>
    );
};

export default Shop;
