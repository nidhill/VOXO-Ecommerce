import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { Search, X, Menu, ShoppingBag, LogOut, User, Package, ChevronDown } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api/axios';
import { getCategories } from '../api/categories';
import { getHomepageBanners } from '../api/settings';

import '../styles/navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const { cartCount } = useCart();
    const auth = useAuth() || {};
    const { user = null, isGuest = false, logout = async () => {} } = auth;
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const megaCloseTimerRef = useRef(null);
    const profileRef = useRef(null);

    const { data: dbCategories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000,
    });

    const { data: banners } = useQuery({
        queryKey: ['homepage-banners'],
        queryFn: getHomepageBanners,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 50);
            if (currentY > lastScrollY.current && currentY > 120) {
                setNavHidden(true);
            } else {
                setNavHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu or search is open + close on Escape
    useEffect(() => {
        if (mobileMenuOpen || searchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
                setSearchOpen(false);
                setSearchQuery('');
                setShowSuggestions(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen, searchOpen]);

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

    useEffect(() => {
        return () => {
            if (megaCloseTimerRef.current) {
                clearTimeout(megaCloseTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
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

    const openMegaMenu = (menu) => {
        if (megaCloseTimerRef.current) {
            clearTimeout(megaCloseTimerRef.current);
            megaCloseTimerRef.current = null;
        }
        setActiveMegaMenu(menu);
    };

    const closeMegaMenu = () => {
        if (megaCloseTimerRef.current) {
            clearTimeout(megaCloseTimerRef.current);
            megaCloseTimerRef.current = null;
        }
        setActiveMegaMenu(null);
    };

    const scheduleMegaMenuClose = () => {
        if (megaCloseTimerRef.current) {
            clearTimeout(megaCloseTimerRef.current);
        }
        megaCloseTimerRef.current = setTimeout(() => {
            setActiveMegaMenu(null);
            megaCloseTimerRef.current = null;
        }, 180);
    };

    const handleMobileNavClick = (path) => {
        navigate(path);
        closeMobileMenu();
    };

    // Helper to split categories into two columns for the mega menu
    const midIndex = Math.ceil(dbCategories.length / 2);
    const categoriesCol1 = dbCategories.slice(0, midIndex);
    const categoriesCol2 = dbCategories.slice(midIndex);

    return (
        <>
            {activeMegaMenu && <button className="mega-menu-backdrop" aria-label="Close menu" onClick={closeMegaMenu} />}

            <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${navHidden ? 'nav-hidden' : ''}`}>
                <div className="container navbar-container">
                    {/* Left — desktop: nav links | mobile: hamburger */}
                    <div className="navbar-left">
                        {/* Mobile hamburger — shown only on mobile via CSS */}
                        <button
                            className="hamburger-btn"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>

                        <Link to="/collections/all" className="nav-link desktop-only">Shop</Link>

                        {/* ── MEN ── */}
                        <div
                            className="nav-item-group desktop-only"
                            onMouseEnter={() => openMegaMenu('men')}
                            onMouseLeave={scheduleMegaMenuClose}
                        >
                            <Link to="/collections/men" className="nav-link">Men</Link>
                            <div
                                className={`mega-menu ${activeMegaMenu === 'men' ? 'active' : ''}`}
                                onMouseEnter={() => openMegaMenu('men')}
                                onMouseLeave={scheduleMegaMenuClose}
                            >
                                <div className="mega-menu-container">
                                    <div className="mega-menu-column">
                                        <Link to="/collections/men" className="mega-col-heading">Men's Collection</Link>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Categories</div>
                                            {categoriesCol1.map(cat => (
                                                <Link key={cat._id} to={`/collections/men?category=${encodeURIComponent(cat.name)}`} className="mega-link">{cat.name}</Link>
                                            ))}
                                            {dbCategories.length === 0 && <span className="mega-link" style={{opacity: 0.5}}>No categories found</span>}
                                        </div>
                                        <Link to="/collections/men" className="mega-shop-all">Shop All Men</Link>
                                    </div>
                                    <div className="mega-menu-column">
                                        <div className="mega-sub-group" style={{ marginTop: '28px' }}>
                                            {categoriesCol2.map(cat => (
                                                <Link key={cat._id} to={`/collections/men?category=${encodeURIComponent(cat.name)}`} className="mega-link">{cat.name}</Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mega-menu-column" />
                                    {banners?.men && (
                                        <Link to="/collections/men" className="mega-menu-featured">
                                            <img src={banners.men} alt="Men's Collection" />
                                            <span className="featured-badge">Featured</span>
                                            <div className="featured-text">
                                                <p>Men's Drop</p>
                                                <small>Shop the latest styles</small>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── WOMEN ── */}
                        <div
                            className="nav-item-group desktop-only"
                            onMouseEnter={() => openMegaMenu('women')}
                            onMouseLeave={scheduleMegaMenuClose}
                        >
                            <Link to="/collections/women" className="nav-link">Women</Link>
                            <div
                                className={`mega-menu ${activeMegaMenu === 'women' ? 'active' : ''}`}
                                onMouseEnter={() => openMegaMenu('women')}
                                onMouseLeave={scheduleMegaMenuClose}
                            >
                                <div className="mega-menu-container">
                                    <div className="mega-menu-column">
                                        <Link to="/collections/women" className="mega-col-heading">Women's Collection</Link>
                                        <div className="mega-sub-group">
                                            <div className="mega-sub-label">Categories</div>
                                            {categoriesCol1.map(cat => (
                                                <Link key={cat._id} to={`/collections/women?category=${encodeURIComponent(cat.name)}`} className="mega-link">{cat.name}</Link>
                                            ))}
                                            {dbCategories.length === 0 && <span className="mega-link" style={{opacity: 0.5}}>No categories found</span>}
                                        </div>
                                        <Link to="/collections/women" className="mega-shop-all">Shop All Women</Link>
                                    </div>
                                    <div className="mega-menu-column">
                                        <div className="mega-sub-group" style={{ marginTop: '28px' }}>
                                            {categoriesCol2.map(cat => (
                                                <Link key={cat._id} to={`/collections/women?category=${encodeURIComponent(cat.name)}`} className="mega-link">{cat.name}</Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mega-menu-column" />
                                    {banners?.women && (
                                        <Link to="/collections/women" className="mega-menu-featured">
                                            <img src={banners.women} alt="Women's Collection" />
                                            <span className="featured-badge">Featured</span>
                                            <div className="featured-text">
                                                <p>Women's Drop</p>
                                                <small>Shop the latest styles</small>
                                            </div>
                                        </Link>
                                    )}
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
                        <button className="nav-icon" onClick={() => setSearchOpen(true)} aria-label="Search">
                            <Search size={20} />
                        </button>

                        {user ? (
                            <div className="nav-profile-wrap" ref={profileRef}>
                                <button
                                    className="nav-icon"
                                    onClick={() => setProfileOpen(v => !v)}
                                    aria-label="Profile menu"
                                >
                                    <User size={19} />
                                </button>

                                {profileOpen && (
                                    <div className="nav-profile-dropdown">
                                        <div className="nav-profile-top">
                                            <span className="nav-profile-name">{user.name}</span>
                                            <span className="nav-profile-email">{user.email}</span>
                                        </div>
                                        <div className="nav-profile-links">
                                            <Link to="/profile" className="nav-profile-link" onClick={() => setProfileOpen(false)}>
                                                <User size={13} /> My Profile
                                            </Link>
                                            <Link to="/orders" className="nav-profile-link" onClick={() => setProfileOpen(false)}>
                                                <Package size={13} /> My Orders
                                            </Link>
                                        </div>
                                        <button className="nav-profile-logout" onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}>
                                            <LogOut size={13} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="nav-icon" onClick={() => navigate('/auth')} aria-label="Sign in">
                                <User size={19} />
                            </button>
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
                                    background: '#111111', color: '#ffffff',
                                    fontSize: 8, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ===== Fullscreen Search Overlay ===== */}
            {searchOpen && (
                <div className="search-overlay">
                    <button
                        className="search-overlay-close"
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); setShowSuggestions(false); }}
                        aria-label="Close search"
                    >
                        <X size={24} />
                    </button>
                    <div className="search-overlay-inner">
                        <form onSubmit={handleSearchSubmit} className="search-overlay-form" ref={searchRef}>
                            <input
                                type="text"
                                className="search-overlay-input"
                                placeholder="Search products…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                autoComplete="off"
                            />
                            <p className="search-overlay-hint">Press Enter to search</p>

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="search-overlay-suggestions">
                                    {suggestions.map((product) => (
                                        <div
                                            key={product._id}
                                            className="search-overlay-suggestion"
                                            onClick={() => handleSuggestionClick(product)}
                                        >
                                            {product.image && (
                                                <img src={product.image} alt={product.name} className="search-sugg-img" />
                                            )}
                                            <div className="search-sugg-info">
                                                <span className="search-sugg-name">{product.name}</span>
                                                <span className="search-sugg-price">₹{product.price?.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

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
                        {dbCategories.map(cat => (
                            <Link key={cat._id} to={`/collections/men?category=${encodeURIComponent(cat.name)}`} className="mobile-nav-sub-link" onClick={closeMobileMenu}>{cat.name}</Link>
                        ))}
                    </div>

                    <div className="mobile-nav-section">
                        <div className="mobile-nav-section-title">Women</div>
                        {dbCategories.map(cat => (
                            <Link key={cat._id} to={`/collections/women?category=${encodeURIComponent(cat.name)}`} className="mobile-nav-sub-link" onClick={closeMobileMenu}>{cat.name}</Link>
                        ))}
                    </div>

                    <Link to="/orders" className="mobile-nav-link" onClick={closeMobileMenu}>Orders</Link>
                    <Link to="/checkout" className="mobile-nav-link" onClick={closeMobileMenu}>
                        Cart ({cartCount})
                    </Link>
                </nav>
            </div>
        </>
    );
};

export default Navbar;
