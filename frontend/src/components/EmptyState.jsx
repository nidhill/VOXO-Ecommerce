import React from 'react';
import { Link } from 'react-router-dom';

const configs = {
    search: {
        icon: '🔍',
        title: (q) => q ? `No results for "${q}"` : 'No products found',
        sub:  'Try a different keyword or browse all products.',
        cta:  'Browse all products',
        href: '/collections/all',
    },
    cart: {
        icon: '🛒',
        title: () => 'Your bag is empty',
        sub:  "Looks like you haven't added anything yet.",
        cta:  'Start shopping',
        href: '/collections/all',
    },
    wishlist: {
        icon: '♡',
        title: () => 'Nothing saved yet',
        sub:  'Tap the heart on any product to save it here.',
        cta:  'Explore products',
        href: '/collections/all',
    },
    orders: {
        icon: '📦',
        title: () => 'No orders yet',
        sub:  'Your order history will appear here.',
        cta:  'Shop now',
        href: '/collections/all',
    },
};

export function EmptyState({ type = 'search', query }) {
    const c = configs[type] || configs.search;
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '64px 24px', textAlign: 'center',
            color: 'var(--color-black)',
        }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', lineHeight: 1 }}>{c.icon}</div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '8px' }}>
                {c.title(query)}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-grey-500)', marginBottom: '24px', maxWidth: '320px' }}>
                {c.sub}
            </p>
            <Link
                to={c.href}
                style={{
                    display: 'inline-block',
                    padding: '12px 28px',
                    background: 'var(--color-black)',
                    color: 'var(--color-white)',
                    borderRadius: '999px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                }}
            >
                {c.cta}
            </Link>
        </div>
    );
}

export default EmptyState;
