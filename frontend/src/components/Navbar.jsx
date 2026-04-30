import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, X, Menu, ShoppingBag, LogOut } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api/axios';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import heroShoeUpdated from '../assets/hero-shoe-updated.png';
import heroShoe3 from '../assets/hero-shoe-3.png';
import newHeroShoes from '../assets/new-hero-shoes.png';
import '../styles/navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
    const { cartCount } = useCart();
    const auth = useAuth() || {};
    const { user = null, isGuest = false, logout = async () => {} } = auth;
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keep --navbar-height CSS var in sync so the mega-menu top aligns perfectly
    useEffect(() => {
        const updateHeight = () => {
            if (navRef.current) {
                document.documentElement.style.setProperty(
                    '--navbar-height',
                    `${navRef.current.offsetHeight}px`
                );
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [scrolled]);

    // Lock body scroll when mobile menu is open + close on Escape
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        const handleKeyDown = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen]);

    // Search Suggestions Logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(searchQuery)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/collections/all?search=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery('');
            setShowSuggestions(false);
        }
    };

    const handleMobileSearchSubmit = (e) => {
        e.preventDefault();
        if (mobileSearchQuery.trim()) {
            navigate(`/collections/all?search=${encodeURIComponent(mobileSearchQuery)}`);
            setMobileMenuOpen(false);
            setMobileSearchQuery('');
        }
    };

    const handleSuggestionClick = (product) => {
        navigate(`/product/${product._id}`);
        setSearchOpen(false);
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleMobileNavClick = (path) => {
        navigate(path);
        closeMobileMenu();
    };

    return (
        <>
            <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    {/* Desktop Left Nav */}
                    <div className="navbar-left">

                        {/* ── MEN ── */}
                        <div className="nav-item-group">
                            <Link to="/collections/men" className="nav-link">Men</Link>
                            <div className="mega-menu">
                                <div className="mega-menu-container">
                                    <div className="mega-menu-column">
                                        <Link to="/collections/men" className="mega-col-heading">Men's Collection</Link>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Footwear</div>
                                            <Link to="/collections/men?category=Shoe" className="mega-link">Shoes</Link>
                                            <Link to="/collections/men?category=Sandal" className="mega-link">Sandals</Link>
                                            <Link to="/collections/men?category=Slipper" className="mega-link">Slippers</Link>
                                        </div>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Clothing</div>
                                            <Link to="/collections/men?category=Shirt" className="mega-link">Shirts</Link>
                                            <Link to="/collections/men?category=Tshirt" className="mega-link">T-Shirts</Link>
                                        </div>
                                        <Link to="/collections/men" className="mega-shop-all">Shop All Men</Link>
                                    </div>
                                    <div className="mega-menu-column">
                                        <Link to="/collections/men" className="mega-col-heading">Accessories</Link>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Style</div>
                                            <Link to="/collections/men?category=Watch" className="mega-link">Watches</Link>
                                            <Link to="/collections/men?category=Belt" className="mega-link">Belts</Link>
                                            <Link to="/collections/men?category=Perfume" className="mega-link">Perfumes</Link>
                                        </div>
                                    </div>
                                    <div className="mega-menu-column" />
                                    <Link to="/collections/men" className="mega-menu-featured">
                                        <img src={heroShoeUpdated} alt="Men's Collection" />
                                        <div className="featured-text">
                                            <span className="featured-badge">New</span>
                                            <p>Men's Drop</p>
                                            <small>Shop the latest styles</small>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── WOMEN ── */}
                        <div className="nav-item-group">
                            <Link to="/collections/women" className="nav-link">Women</Link>
                            <div className="mega-menu">
                                <div className="mega-menu-container">
                                    <div className="mega-menu-column">
                                        <Link to="/collections/women" className="mega-col-heading">Women's Collection</Link>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Footwear</div>
                                            <Link to="/collections/women?category=Shoe" className="mega-link">Shoes</Link>
                                            <Link to="/collections/women?category=Sandal" className="mega-link">Sandals</Link>
                                            <Link to="/collections/women?category=Slipper" className="mega-link">Slippers</Link>
                                        </div>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Clothing</div>
                                            <Link to="/collections/women?category=Shirt" className="mega-link">Shirts</Link>
                                            <Link to="/collections/women?category=Tshirt" className="mega-link">T-Shirts</Link>
                                        </div>
                                        <Link to="/collections/women" className="mega-shop-all">Shop All Women</Link>
                                    </div>
                                    <div className="mega-menu-column">
                                        <Link to="/collections/women" className="mega-col-heading">Accessories</Link>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Style</div>
                                            <Link to="/collections/women?category=Watch" className="mega-link">Watches</Link>
                                            <Link to="/collections/women?category=Belt" className="mega-link">Belts</Link>
                                            <Link to="/collections/women?category=Perfume" className="mega-link">Perfumes</Link>
                                        </div>
                                    </div>
                                    <div className="mega-menu-column" />
                                    <Link to="/collections/women" className="mega-menu-featured">
                                        <img src={heroShoe3} alt="Women's Collection" />
                                        <div className="featured-text">
                                            <span className="featured-badge">New</span>
                                            <p>Women's Drop</p>
                                            <small>Shop the latest styles</small>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── ACCESSORIES ── */}
                        <div className="nav-item-group">
                            <Link to="/collections/all" className="nav-link">Accessories</Link>
                            <div className="mega-menu">
                                <div className="mega-menu-container">
                                    <div className="mega-menu-column">
                                        <Link to="/collections/all" className="mega-col-heading">All Accessories</Link>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Categories</div>
                                            <Link to="/collections/all?category=Watch" className="mega-link">Watches</Link>
                                            <Link to="/collections/all?category=Perfume" className="mega-link">Perfumes</Link>
                                            <Link to="/collections/all?category=Belt" className="mega-link">Belts</Link>
                                        </div>
                                        <Link to="/collections/all" className="mega-shop-all">Shop All Accessories</Link>
                                    </div>
                                    <div className="mega-menu-column" />
                                    <div className="mega-menu-column" />
                                    <Link to="/collections/all" className="mega-menu-featured">
                                        <img src={newHeroShoes} alt="Accessories" />
                                        <div className="featured-text">
                                            <span className="featured-badge">Featured</span>
                                            <p>Accessories</p>
                                            <small>Complete your look</small>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Center Logo */}
                    <div className="navbar-center">
                        <Link to="/" className="logo">Wavway</Link>
                    </div>

                    {/* Desktop Right Nav */}
                    <div className="navbar-right">
                        {searchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="search-bar-active" ref={searchRef}>
                                <div className="search-container">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="search-input"
                                    />
                                    {showSuggestions && (
                                        <div className="search-suggestions">
                                            {suggestions.length > 0 ? (
                                                suggestions.map((product) => (
                                                    <div
                                                        key={product._id}
                                                        className="suggestion-item"
                                                        onClick={() => handleSuggestionClick(product)}
                                                    >
                                                        {product.image && (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="suggestion-image"
                                                            />
                                                        )}
                                                        <div className="suggestion-info">
                                                            <span className="suggestion-name">{product.name}</span>
                                                            <span className="suggestion-price">₹{product.price?.toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="suggestion-item">
                                                    <span className="suggestion-name" style={{ color: 'var(--color-grey-500)', fontStyle: 'italic' }}>
                                                        No products found
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button type="button" onClick={() => setSearchOpen(false)} className="nav-icon">
                                    <X size={20} />
                                </button>
                            </form>
                        ) : (
                            <button className="nav-icon" onClick={() => setSearchOpen(true)} aria-label="Search">
                                <Search size={20} />
                            </button>
                        )}

                        <Link to="/orders" className="nav-link">Orders</Link>

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1a1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {user.name.split(' ')[0]}
                                </span>
                                <button className="nav-icon" onClick={() => { logout(); navigate('/auth'); }} title="Logout" style={{ display: 'flex', alignItems: 'center' }}>
                                    <LogOut size={15} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/auth" className="nav-link">Login</Link>
                        )}

                        <button
                            className="nav-icon cart-btn"
                            onClick={() => navigate('/checkout')}
                            aria-label="Cart"
                            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                        >
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -6, right: -8,
                                    width: 14, height: 14, borderRadius: '50%',
                                    background: '#c6c6c7', color: '#0e0e0e',
                                    fontSize: 8, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <ThemeToggle className="desktop-theme-toggle" />

                        {/* Mobile Hamburger — visible only on mobile via CSS */}
                        <button
                            className="hamburger-btn"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ===== Mobile Menu Overlay ===== */}
            <div
                className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
            />

            {/* ===== Mobile Menu Drawer ===== */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu">
                    <X size={24} />
                </button>

                {/* Mobile Search */}
                <form onSubmit={handleMobileSearchSubmit} className="mobile-search-bar">
                    <Search size={18} style={{ color: 'var(--color-grey-500)', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={mobileSearchQuery}
                        onChange={(e) => setMobileSearchQuery(e.target.value)}
                    />
                </form>

                {/* Mobile Nav Links */}
                <nav className="mobile-nav-links">
                    <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>Home</Link>
                    <Link to="/collections/all" className="mobile-nav-link" onClick={closeMobileMenu}>All Products</Link>

                    <div className="mobile-nav-section">
                        <div className="mobile-nav-section-title">Men</div>
                        <Link to="/collections/men?category=Shoe" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Shoes</Link>
                        <Link to="/collections/men?category=Sandal" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Sandals</Link>
                        <Link to="/collections/men?category=Slipper" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Slippers</Link>
                        <Link to="/collections/men?category=Shirt" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Shirts</Link>
                        <Link to="/collections/men?category=Tshirt" className="mobile-nav-sub-link" onClick={closeMobileMenu}>T-Shirts</Link>
                    </div>

                    <div className="mobile-nav-section">
                        <div className="mobile-nav-section-title">Women</div>
                        <Link to="/collections/women?category=Shoe" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Shoes</Link>
                        <Link to="/collections/women?category=Sandal" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Sandals</Link>
                        <Link to="/collections/women?category=Slipper" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Slippers</Link>
                        <Link to="/collections/women?category=Shirt" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Shirts</Link>
                        <Link to="/collections/women?category=Tshirt" className="mobile-nav-sub-link" onClick={closeMobileMenu}>T-Shirts</Link>
                    </div>

                    <div className="mobile-nav-section">
                        <div className="mobile-nav-section-title">Accessories</div>
                        <Link to="/collections/all?category=Watch" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Watches</Link>
                        <Link to="/collections/all?category=Perfume" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Perfumes</Link>
                        <Link to="/collections/all?category=Belt" className="mobile-nav-sub-link" onClick={closeMobileMenu}>Belts</Link>
                    </div>

                    <Link to="/orders" className="mobile-nav-link" onClick={closeMobileMenu}>Orders</Link>
                    <Link to="/checkout" className="mobile-nav-link" onClick={closeMobileMenu}>
                        Cart ({cartCount})
                    </Link>
                </nav>

                <div className="mobile-nav-actions">
                    <ThemeToggle />
                </div>
            </div>
        </>
    );
};

export default Navbar;
