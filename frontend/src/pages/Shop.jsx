<<<<<<< HEAD
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import { pageTransition } from '../utils/animations'; // Assuming this exists or define inline
import '../styles/shop.css';
import '../styles/product-grid.css'; // Reuse product grid styles

const Shop = () => {
    const { category: genderParam } = useParams(); // URL param is actually gender (men/women)
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const { addToCart } = useCart();
=======
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import { pageTransition } from '../utils/animations';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
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
    const [filtersOpen, setFiltersOpen] = useState(!categoryFilter);
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)

    const { data: fetchedProducts, isLoading } = useQuery({
        queryKey: ['products', genderParam, categoryFilter, searchQuery],
        queryFn: () => getProducts({
<<<<<<< HEAD
            gender: genderParam === 'men' ? 'Men' : genderParam === 'women' ? 'Women' : undefined,
=======
            gender: genderParam === 'men' ? 'Men' : genderParam === 'women' ? 'Women' : genderParam === 'unisex' ? 'Unisex' : undefined,
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
            category: categoryFilter,
            search: searchQuery
        })
    });

    const products = fetchedProducts || [];

<<<<<<< HEAD
    // Filter products if category exists (handled by API, but safe fallback)
    const filteredProducts = products;

    let title = genderParam
        ? genderParam.charAt(0).toUpperCase() + genderParam.slice(1)
        : 'All Collections';

    if (categoryFilter) {
        title += ` - ${categoryFilter}`;
    }

    if (searchQuery) {
        title = `Search Results for "${searchQuery}"`;
    }

    return (
        <motion.div
            {...pageTransition}
            className="shop-page"
        >
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <h1 className="shop-title">{title}</h1>
                <p className="shop-subtitle">
                    {filteredProducts.length} items found. Curated footwear for every occasion.
                </p>

                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <motion.div
                            key={product.id}
                            className="product-card"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            {/* Debug logging for image URLs */}
                            {console.log(`Product: ${product.name}, Image URL:`, product.images && product.images[0])}
                            <div className="product-image-wrapper">
                                {product.tag && <span className="product-tag">{product.tag}</span>}
                                <Link to={`/product/${product.id || product._id}`}>
                                    <img
                                        src={
                                            product.images && product.images.length > 0
                                                ? (product.images[0].startsWith('http') ? product.images[0] : product.images[0])
                                                : '/placeholder-shoe.png'
                                        }
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            // Fallback to a safe placeholder if the main image fails
                                            e.target.src = 'https://placehold.co/300x400?text=No+Image';
                                        }}
                                    />
                                </Link>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                            <div className="product-info">
                                <Link to={`/product/${product.id || product._id}`} className="product-name">{product.name}</Link>
                                <span className="product-price">{product.formattedPrice}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-grey-500)' }}>
                        No products found in this category.
=======
    let title = genderParam && genderParam !== 'all'
        ? genderParam.charAt(0).toUpperCase() + genderParam.slice(1)
        : 'All Collections';
    if (searchQuery) title = `Results for "${searchQuery}"`;

    const handleGenderTab = (val) => {
        searchParams.delete('category');
        setSearchParams(searchParams);
        setFiltersOpen(true);
        if (val === '') navigate('/collections/all');
        else navigate(`/collections/${val}`);
    };

    const handleCategoryChip = (cat) => {
        if (categoryFilter === cat) {
            searchParams.delete('category');
            setFiltersOpen(true);
        } else {
            searchParams.set('category', cat);
            setFiltersOpen(false);
        }
        setSearchParams(searchParams);
    };

    const clearFilter = () => {
        searchParams.delete('category');
        setSearchParams(searchParams);
        setFiltersOpen(true);
    };

    const activeGender = GENDER_TABS.find(t => t.value === (genderParam || '')) || GENDER_TABS[0];

    return (
        <motion.div {...pageTransition} className="shop-page" style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh' }}>
            <div className="container" style={{ paddingTop: 'clamp(90px, 15vw, 120px)', paddingBottom: '60px' }}>

                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <h1 className="shop-title" style={{ marginBottom: '4px' }}>{title}</h1>
                    <p style={{ fontSize: '13px', color: 'var(--color-grey-500)' }}>
                        {isLoading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>

                {/* Gender tabs */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {GENDER_TABS.map(tab => {
                        const isActive = (tab.value === '' && (!genderParam || genderParam === 'all'))
                            || tab.value === genderParam;
                        return (
                            <button key={tab.value} onClick={() => handleGenderTab(tab.value)} style={{
                                padding: '10px 18px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                                cursor: 'pointer', letterSpacing: '0.5px', textTransform: 'uppercase',
                                border: isActive ? '1.5px solid var(--color-black)' : '1.5px solid var(--color-grey-200)',
                                background: isActive ? 'var(--color-black)' : 'transparent',
                                color: isActive ? 'var(--color-white)' : 'var(--color-grey-500)',
                                transition: 'all 0.2s', minHeight: '44px',
                            }}>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Filter bar — collapsed state */}
                {!filtersOpen && categoryFilter ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-grey-500)', textTransform: 'uppercase', letterSpacing: '1px' }}>Filtered:</span>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '5px 12px', borderRadius: '999px',
                            background: 'var(--color-black)', color: 'var(--color-white)',
                            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                            {categoryFilter}
                            <button onClick={clearFilter} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', padding: 0 }}>
                                <X size={12} />
                            </button>
                        </span>
                        <button onClick={() => setFiltersOpen(true)} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '5px 12px', borderRadius: '999px',
                            border: '1.5px solid var(--color-grey-200)', background: 'transparent',
                            fontSize: '11px', fontWeight: 600, color: 'var(--color-grey-500)',
                            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                            <SlidersHorizontal size={11} /> Filters <ChevronDown size={11} />
                        </button>
                    </div>
                ) : (
                    /* Filter panel — open state */
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', marginBottom: '32px' }}
                        >
                            <div style={{
                                padding: '20px', borderRadius: '16px',
                                border: '1.5px solid var(--color-grey-100)',
                                background: 'var(--color-grey-50)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <SlidersHorizontal size={13} style={{ color: 'var(--color-grey-500)' }} />
                                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-grey-500)' }}>Filter by Category</span>
                                </div>
                                {CATEGORY_GROUPS.map(({ group, items }) => (
                                    <div key={group} style={{ marginBottom: '14px' }}>
                                        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-grey-500)', marginBottom: '8px' }}>{group}</p>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {items.map(cat => {
                                                const isActive = categoryFilter === cat;
                                                return (
                                                    <button key={cat} onClick={() => handleCategoryChip(cat)} style={{
                                                        padding: '6px 14px', borderRadius: '8px',
                                                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                                        border: isActive ? '1.5px solid var(--color-black)' : '1.5px solid var(--color-grey-200)',
                                                        background: isActive ? 'var(--color-black)' : 'var(--color-white)',
                                                        color: isActive ? 'var(--color-white)' : 'var(--color-black)',
                                                        transition: 'all 0.15s',
                                                        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                                                        minHeight: '44px',
                                                    }}>
                                                        {cat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Products */}
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{ width: '32px', height: '32px', border: '2.5px solid var(--color-grey-200)', borderTopColor: 'var(--color-black)', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-black)', marginBottom: '8px' }}>Not Available</h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-grey-500)', marginBottom: '20px' }}>
                            {categoryFilter
                                ? `No products found in "${categoryFilter}" category.`
                                : 'No products found.'}
                        </p>
                        {categoryFilter && (
                            <button onClick={clearFilter} style={{
                                padding: '10px 24px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                                background: 'var(--color-black)', color: 'var(--color-white)', border: 'none', cursor: 'pointer',
                            }}>
                                Clear Filter
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
                                viewport={{ once: true, margin: "0px" }}
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
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Shop;
