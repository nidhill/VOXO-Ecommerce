import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, ChevronDown, Package } from 'lucide-react';
import useMeta from '../hooks/useMeta';
import { EmptyState } from '../components/EmptyState';
import '../styles/orders.css';

const ITEMS_PER_PAGE = 5;

const STATUS_LABEL = {
    Processing:        { text: 'Processing',        cls: 'ord-badge-processing' },
    Shipped:           { text: 'In Transit',         cls: 'ord-badge-transit'    },
    'Out for Delivery':{ text: 'Out for Delivery',   cls: 'ord-badge-delivery'   },
    Delivered:         { text: 'Delivered',           cls: 'ord-badge-delivered'  },
    Incomplete:        { text: 'Pending',             cls: 'ord-badge-pending'    },
};

const Orders = () => {
    useMeta('My Orders', 'Track and manage your WAVWAY orders.');
    const { orders } = useOrder();
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(ITEMS_PER_PAGE);

    const shown = orders.slice(0, visible);
    const hasMore = visible < orders.length;

    return (
        <div className="ord-page">
            {/* ── Nav ─────────────────────────────────── */}
            <nav className="ord-nav">
                <div className="ord-nav-left">
                    <Link to="/" className="ord-nav-brand">WAVWAY</Link>
                    <div className="ord-nav-links">
                        <Link to="/collections/all">Collections</Link>
                        <Link to="/collections/men">Men</Link>
                        <Link to="/collections/women">Women</Link>
                        <Link to="/orders" className="ord-nav-active">Orders</Link>
                    </div>
                </div>
                <div className="ord-nav-right">
                    <Link to="/checkout" className="ord-nav-icon">
                        <ShoppingBag size={18} />
                        {cartCount > 0 && <span className="ord-nav-dot">{cartCount}</span>}
                    </Link>
                    {user ? (
                        <div className="ord-nav-user">
                            <User size={15} />
                            <span>{user.name.split(' ')[0]}</span>
                            <button onClick={() => { logout(); navigate('/auth'); }}><LogOut size={13} /></button>
                        </div>
                    ) : (
                        <Link to="/auth" className="ord-nav-login">Login</Link>
                    )}
                </div>
            </nav>

            {/* ── Main ────────────────────────────────── */}
            <main className="ord-main">
                <header className="ord-header">
                    <h1 className="ord-title">Order History</h1>
                    <p className="ord-subtitle">Past Acquisitions &amp; Pending Shipments.</p>
                </header>

                {orders.length === 0 ? (
                    <EmptyState type="orders" />
                ) : (
                    <>
                        <div className="ord-list">
                            {shown.map((order, idx) => {
                                const badge = STATUS_LABEL[order.status] || { text: order.status, cls: 'ord-badge-pending' };
                                const items = order.items || [];
                                const previewItems = items.slice(0, 2);
                                const overflow = items.length - 2;
                                const dateStr = order.date
                                    ? new Date(order.timestamp || order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).toUpperCase()
                                    : '—';

                                return (
                                    <motion.article
                                        key={order.id}
                                        className="ord-row"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    >
                                        {/* Left: ID + status + date */}
                                        <div className="ord-row-left">
                                            <div className="ord-row-id">
                                                #{order.id?.replace('ORD-', 'WW-') || `WW-${order.id}`}
                                            </div>
                                            <span className={`ord-badge ${badge.cls}`}>{badge.text}</span>
                                            <div className="ord-row-date">{dateStr}</div>
                                        </div>

                                        {/* Middle: product thumbnails */}
                                        <div className="ord-row-thumbs">
                                            {previewItems.map((item, i) => (
                                                <div key={i} className="ord-thumb">
                                                    <img
                                                        src={item.image || item.images?.[0] || 'https://placehold.co/60x80?text=?'}
                                                        alt={item.name}
                                                        onError={e => { e.target.src = 'https://placehold.co/60x80?text=?'; }}
                                                    />
                                                </div>
                                            ))}
                                            {overflow > 0 && (
                                                <div className="ord-thumb ord-thumb-more">+{overflow}</div>
                                            )}
                                        </div>

                                        {/* Right: total + CTA */}
                                        <div className="ord-row-right">
                                            <div className="ord-row-total-label">Total</div>
                                            <div className="ord-row-total">
                                                ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>

                                        <Link to={`/order-tracking/${order.id}`} className="ord-view-btn">
                                            View Details
                                        </Link>
                                    </motion.article>
                                );
                            })}
                        </div>

                        {hasMore && (
                            <button className="ord-load-more" onClick={() => setVisible(v => v + ITEMS_PER_PAGE)}>
                                Load More
                                <ChevronDown size={14} />
                            </button>
                        )}
                    </>
                )}
            </main>

            {/* ── Footer ──────────────────────────────── */}
            <footer className="ord-footer">
                <div className="ord-footer-inner">
                    <span className="ord-footer-brand">WAVWAY</span>
                    <div className="ord-footer-links">
                        <a href="#">Sustainability</a>
                        <a href="#">Shipping &amp; Returns</a>
                        <a href="#">Privacy</a>
                    </div>
                    <span className="ord-footer-copy">© 2024 WAVWAY. All Rights Reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default Orders;
