import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, Tag, CheckCircle2, Lock, ShoppingBag, Truck, ArrowLeft, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { validateCoupon } from '../api/coupons';
import { createOrder } from '../api/orders';
import '../styles/checkout.css';
import '../styles/checkout-mobile-enhancements.css';
import '../styles/mobile-responsive-fixes.css';

const ADMIN_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const Checkout = () => {
    const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(0); // 0 = bag, 1 = delivery
    const [couponInput, setCouponInput] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        zip: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const coupon = await validateCoupon(couponInput.trim());
            const amt = (cartTotal * coupon.discountPercentage) / 100;
            setDiscount(amt);
            setCouponCode(couponInput.trim());
            setCouponSuccess(`${coupon.discountPercentage}% off applied`);
        } catch (err) {
            setCouponError(err.response?.data?.msg || 'Invalid coupon code');
            setDiscount(0);
            setCouponCode('');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setDiscount(0); setCouponCode(''); setCouponInput('');
        setCouponSuccess(''); setCouponError('');
    };

    const finalTotal = cartTotal - discount;

    const handleWhatsAppCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createOrder({
                customerName: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                zip: formData.zip,
                items: cartItems.map(item => ({
                    productId: item._id || item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: finalTotal,
                couponCode: discount > 0 ? couponCode : null,
                discount,
                status: 'Incomplete',
            });
        } catch (err) {
            console.error('Order log failed', err);
        }

        let msg = `*New Order from WAVWAY* 🛍️\n\n`;
        msg += `*Customer:* ${formData.name}\n*Phone:* ${formData.phone}\n`;
        msg += `*Address:* ${formData.address}, ${formData.city} - ${formData.zip}\n\n*Items:*\n`;
        cartItems.forEach(i => { msg += `• ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toFixed(0)}\n`; });
        msg += `\n*Subtotal:* ₹${cartTotal.toFixed(0)}\n`;
        if (discount > 0) msg += `*Discount (${couponCode}):* -₹${discount.toFixed(0)}\n`;
        msg += `*Total:* ₹${finalTotal.toFixed(0)}`;

        window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
        clearCart();
        setLoading(false);
        navigate('/orders');
    };

    // ── Empty cart ────────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <div className="bag-page">
                <BagNav user={user} logout={logout} navigate={navigate} cartCount={0} />
                <div className="bag-empty">
                    <ShoppingBag size={52} strokeWidth={0.8} />
                    <h2 className="bag-empty-title">Your bag is empty</h2>
                    <p className="bag-empty-sub">Discover pieces from the collection.</p>
                    <Link to="/collections/all" className="bag-empty-cta">Explore Collections</Link>
                </div>
            </div>
        );
    }

    const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

    return (
        <div className="bag-page">
            <BagNav user={user} logout={logout} navigate={navigate} cartCount={itemCount} />

            <main className="bag-main">
                {/* ── Header ───────────────────────────────── */}
                <header className="bag-header">
                    <h1 className="bag-title">Your Bag</h1>
                    <p className="bag-subtitle">Review your selection from the Digital Atelier</p>
                </header>

                <div className="bag-layout">
                    {/* ── LEFT: Items or Form ──────────────── */}
                    <section className="bag-left">
                        <AnimatePresence mode="wait">
                            {step === 0 ? (
                                <motion.div key="bag"
                                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}
                                >
                                    {/* Cart items */}
                                    <div className="bag-items">
                                        {cartItems.map((item, idx) => {
                                            const itemId = item.id || item._id;
                                            return (
                                                <article key={itemId} className="bag-item">
                                                    <div className="bag-item-img-wrap">
                                                        <img
                                                            src={item.images?.[0] || item.image || 'https://placehold.co/300x400?text=?'}
                                                            alt={item.name}
                                                            className="bag-item-img"
                                                            onError={e => { e.target.src = 'https://placehold.co/300x400?text=?'; }}
                                                        />
                                                        <span className="bag-item-num">
                                                            {String(idx + 1).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    <div className="bag-item-body">
                                                        <div className="bag-item-top">
                                                            <div>
                                                                <h2 className="bag-item-name">{item.name}</h2>
                                                                <p className="bag-item-meta">
                                                                    {item.category && `${item.category}`}
                                                                    {item.gender && ` — ${item.gender}`}
                                                                </p>
                                                            </div>
                                                            <span className="bag-item-price">
                                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                            </span>
                                                        </div>

                                                        <div className="bag-item-attrs">
                                                            {item.size && (
                                                                <div className="bag-attr">
                                                                    <span className="bag-attr-label">Size</span>
                                                                    <span className="bag-attr-val">{item.size}</span>
                                                                </div>
                                                            )}
                                                            {item.color && (
                                                                <div className="bag-attr">
                                                                    <span className="bag-attr-label">Color</span>
                                                                    <span className="bag-attr-val">{item.color}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="bag-item-actions">
                                                            <div className="bag-qty">
                                                                <button className="bag-qty-btn" type="button"
                                                                    onClick={() => updateQuantity(itemId, item.quantity - 1)}>
                                                                    <Minus size={12} />
                                                                </button>
                                                                <span className="bag-qty-num">{item.quantity}</span>
                                                                <button className="bag-qty-btn" type="button"
                                                                    onClick={() => updateQuantity(itemId, item.quantity + 1)}>
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>
                                                            <button className="bag-remove" type="button"
                                                                onClick={() => removeFromCart(itemId)}>
                                                                <X size={13} /> Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>

                                    {/* Trust badges */}
                                    <div className="bag-trust">
                                        <div className="bag-trust-item">
                                            <Lock size={14} />
                                            <span>Secure Encrypted Checkout</span>
                                        </div>
                                        <div className="bag-trust-item">
                                            <Truck size={14} />
                                            <span>Free Express Delivery &amp; Returns</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="form"
                                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.25 }}
                                >
                                    {/* Delivery form */}
                                    <button className="bag-back-step" type="button" onClick={() => setStep(0)}>
                                        <ArrowLeft size={14} /> Back to bag
                                    </button>
                                    <h2 className="bag-form-title">Delivery Details</h2>

                                    <form id="bag-form" className="bag-form" onSubmit={handleWhatsAppCheckout}>
                                        <div className="bag-field-group">
                                            <div className="bag-field-row">
                                                <div className="bag-field">
                                                    <label className="bag-label">Full Name</label>
                                                    <input className="bag-input" type="text" name="name"
                                                        placeholder="Your full name" defaultValue={formData.name}
                                                        onChange={handleChange} required />
                                                </div>
                                                <div className="bag-field">
                                                    <label className="bag-label">Phone</label>
                                                    <input className="bag-input" type="tel" name="phone"
                                                        placeholder="+91 98765 43210" defaultValue={formData.phone}
                                                        onChange={handleChange} required />
                                                </div>
                                            </div>
                                            <div className="bag-field">
                                                <label className="bag-label">
                                                    Email <span className="bag-label-note">for order confirmation</span>
                                                </label>
                                                <input className="bag-input" type="email" name="email"
                                                    placeholder="you@example.com" defaultValue={formData.email}
                                                    onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="bag-field-group-label">Delivery Address</div>
                                        <div className="bag-field-group">
                                            <div className="bag-field">
                                                <label className="bag-label">Street Address</label>
                                                <input className="bag-input" type="text" name="address"
                                                    placeholder="House / Flat / Road / Area"
                                                    onChange={handleChange} required />
                                            </div>
                                            <div className="bag-field-row">
                                                <div className="bag-field">
                                                    <label className="bag-label">City</label>
                                                    <input className="bag-input" type="text" name="city"
                                                        placeholder="City" onChange={handleChange} required />
                                                </div>
                                                <div className="bag-field">
                                                    <label className="bag-label">PIN Code</label>
                                                    <input className="bag-input" type="text" name="zip"
                                                        placeholder="6-digit PIN" onChange={handleChange} required />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile submit */}
                                        <button type="submit" className="bag-wa-btn bag-wa-mobile" disabled={loading}>
                                            {loading ? <span className="bag-spinner" />
                                                : <><WhatsAppIcon /> Order via WhatsApp · ₹{finalTotal.toLocaleString('en-IN')}</>}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* ── RIGHT: Order Summary ──────────────── */}
                    <aside className="bag-sidebar">
                        <div className="bag-sidebar-inner">
                            <h3 className="bag-sidebar-label">Order Summary</h3>

                            {/* Mini items */}
                            <div className="bag-mini-items">
                                {cartItems.map(item => {
                                    const itemId = item.id || item._id;
                                    return (
                                        <div key={itemId} className="bag-mini-item">
                                            <div className="bag-mini-img-wrap">
                                                <img
                                                    src={item.images?.[0] || item.image || 'https://placehold.co/60x80?text=?'}
                                                    alt={item.name}
                                                    className="bag-mini-img"
                                                    onError={e => { e.target.src = 'https://placehold.co/60x80?text=?'; }}
                                                />
                                                <span className="bag-mini-qty">{item.quantity}</span>
                                            </div>
                                            <div className="bag-mini-info">
                                                <p className="bag-mini-name">{item.name}</p>
                                                {item.category && <p className="bag-mini-cat">{item.category}</p>}
                                            </div>
                                            <span className="bag-mini-price">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Coupon */}
                            <div className="bag-coupon">
                                {couponSuccess ? (
                                    <div className="bag-coupon-applied">
                                        <CheckCircle2 size={13} />
                                        <span>{couponSuccess} — <strong>{couponCode}</strong></span>
                                        <button type="button" onClick={removeCoupon} className="bag-coupon-x"><X size={11} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bag-coupon-row">
                                            <Tag size={12} className="bag-coupon-icon" />
                                            <input
                                                className="bag-coupon-input"
                                                type="text"
                                                value={couponInput}
                                                onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                                placeholder="COUPON CODE"
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                                            />
                                            <button type="button" className="bag-coupon-apply"
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponInput.trim()}>
                                                {couponLoading ? '…' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && <p className="bag-coupon-err">{couponError}</p>}
                                    </>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="bag-totals">
                                <div className="bag-total-row">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="bag-total-row">
                                    <span>Shipping</span>
                                    <span className="bag-complimentary">Complimentary</span>
                                </div>
                                {discount > 0 && (
                                    <div className="bag-total-row bag-discount-row">
                                        <span>Discount ({couponCode})</span>
                                        <span>−₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="bag-grand-total">
                                    <span>Total</span>
                                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* CTAs */}
                            {step === 0 ? (
                                <>
                                    <button className="bag-cta-primary" type="button" onClick={() => setStep(1)}>
                                        Proceed to Checkout
                                    </button>
                                    <Link to="/collections/all" className="bag-cta-secondary">
                                        Continue Shopping
                                    </Link>
                                </>
                            ) : (
                                <button type="submit" form="bag-form" className="bag-wa-btn" disabled={loading}>
                                    {loading ? <span className="bag-spinner" />
                                        : <><WhatsAppIcon /> Order via WhatsApp · ₹{finalTotal.toLocaleString('en-IN')}</>}
                                </button>
                            )}

                            <p className="bag-sidebar-note">
                                Checkout via WhatsApp. No payment online. Our team will confirm your order.
                            </p>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="bag-footer">
                <div className="bag-footer-left">
                    <span className="bag-footer-brand">WAVWAY</span>
                    <div className="bag-footer-links">
                        <a href="#">Shipping &amp; Returns</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact</a>
                    </div>
                </div>
                <span className="bag-footer-copy">© 2024 WAVWAY ATELIER. ALL RIGHTS RESERVED.</span>
            </footer>
        </div>
    );
};

const BagNav = ({ user, logout, navigate, cartCount }) => (
    <nav className="bag-nav">
        <div className="bag-nav-left">
            <Link to="/" className="bag-nav-brand">WAVWAY</Link>
            <div className="bag-nav-links">
                <Link to="/collections/all">Collections</Link>
                <Link to="/collections/men">Men</Link>
                <Link to="/collections/women">Women</Link>
            </div>
        </div>
        <div className="bag-nav-right">
            <div className="bag-nav-cart-icon">
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="bag-nav-cart-dot">{cartCount}</span>}
            </div>
            {user ? (
                <div className="bag-nav-user">
                    <User size={16} />
                    <span>{user.name.split(' ')[0]}</span>
                    <button onClick={() => { logout(); navigate('/auth'); }}><LogOut size={14} /></button>
                </div>
            ) : (
                <Link to="/auth" className="bag-nav-login">Login</Link>
            )}
        </div>
    </nav>
);

export default Checkout;
