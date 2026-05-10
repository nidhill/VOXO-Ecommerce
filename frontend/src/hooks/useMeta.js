import { useEffect } from 'react';

const SITE_NAME    = 'WAVWAY';
const DEFAULT_DESC = 'WAVWAY — premium streetwear and lifestyle products. Shop clothing, footwear and accessories.';
const DEFAULT_IMG  = '/og-default.jpg'; // place a 1200×630 image in frontend/public/

const setMetaTag = (attr, key, content) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

/**
 * useMeta — sets <title>, meta description, Open Graph and Twitter Card tags.
 *
 * @param {string} title        Page title (appended with "| WAVWAY")
 * @param {string} description  Meta / OG description
 * @param {string} [image]      Absolute URL or path to OG image
 * @param {string} [url]        Canonical URL (defaults to current href)
 */
const useMeta = (title, description, image, url) => {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
        const desc    = description || DEFAULT_DESC;
        const ogImage = image || DEFAULT_IMG;
        const ogUrl   = url   || window.location.href;

        // <title>
        document.title = fullTitle;

        // Standard meta
        setMetaTag('name', 'description', desc);

        // Open Graph
        setMetaTag('property', 'og:title',       fullTitle);
        setMetaTag('property', 'og:description',  desc);
        setMetaTag('property', 'og:image',        ogImage);
        setMetaTag('property', 'og:url',          ogUrl);
        setMetaTag('property', 'og:type',         'website');
        setMetaTag('property', 'og:site_name',    SITE_NAME);

        // Twitter Card
        setMetaTag('name', 'twitter:card',        'summary_large_image');
        setMetaTag('name', 'twitter:title',       fullTitle);
        setMetaTag('name', 'twitter:description', desc);
        setMetaTag('name', 'twitter:image',       ogImage);
    }, [title, description, image, url]);
};

export default useMeta;
