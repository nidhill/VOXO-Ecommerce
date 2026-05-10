import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb — renders a semantic nav with optional JSON-LD for Google.
 *
 * Usage:
 *   <Breadcrumb crumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Women', href: '/collections/women' },
 *     { label: 'Air Max 90', href: null },   // null = current page, no link
 *   ]} />
 */
export function Breadcrumb({ crumbs = [] }) {
    if (crumbs.length < 2) return null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${window.location.origin}${c.href}` } : {}),
        })),
    };

    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
            <ol style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                gap: '4px', listStyle: 'none', padding: 0, margin: 0,
                fontSize: 'var(--text-xs)', color: 'var(--color-grey-500)',
            }}>
                {crumbs.map((c, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {i > 0 && <span aria-hidden="true" style={{ fontSize: '10px' }}>/</span>}
                        {c.href ? (
                            <Link
                                to={c.href}
                                style={{ color: 'var(--color-grey-500)', textDecoration: 'none' }}
                                aria-label={c.label}
                            >
                                {c.label}
                            </Link>
                        ) : (
                            <span aria-current="page" style={{ color: 'var(--color-black)', fontWeight: 500 }}>
                                {c.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </nav>
    );
}

export default Breadcrumb;
