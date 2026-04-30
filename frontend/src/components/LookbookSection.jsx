import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProducts } from '../api/products';

const FALLBACK_PRODUCTS = [
    { label: 'Signature', name: 'Oud Wood', sub: 'Eau de Parfum', src: '/images/misc/parfum-new.png', link: '/collections/all?category=Perfume', gold: true },
    { label: 'Signature', name: 'Parfum No.2', sub: 'Eau de Parfum', src: '/images/misc/parfum-new.png', link: '/collections/all?category=Perfume' },
    { label: 'Signature', name: 'Oud Intense', sub: 'Eau de Parfum', src: '/images/misc/parfum-new.png', link: '/collections/all?category=Perfume' },
    { label: 'Signature', name: 'Black Orchid', sub: 'Eau de Parfum', src: '/images/misc/parfum-new.png', link: '/collections/all?category=Perfume' },
    { label: 'Signature', name: 'Rose Elixir', sub: 'Eau de Parfum', src: '/images/misc/parfum-new.png', link: '/collections/all?category=Perfume' },
];

const LookbookSection = () => {
    const sectionRef  = useRef(null);
    const heroRef     = useRef(null);
    const watchRef    = useRef(null);
    const textRef     = useRef(null);
    const stripRef    = useRef(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts({ category: 'Perfume' })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data.slice(0, 5).map((p, i) => ({
                        label: 'Signature',
                        name: p.name,
                        sub: 'Eau de Parfum',
                        src: p.images?.[0] || '/images/misc/parfum-new.png',
                        link: `/collections/all?category=Perfume`,
                        gold: i === 0,
                        id: p._id,
                    }));
                    setProducts(mapped);
                } else {
                    setProducts(FALLBACK_PRODUCTS);
                }
            })
            .catch(() => setProducts(FALLBACK_PRODUCTS));
    }, []);

    const displayProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero text fade-in from left
            gsap.from(textRef.current, {
                x: -40,
                opacity: 0,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top 82%',
                    once: true,
                    invalidateOnRefresh: true,
                },
            });

            // Watch slides in from right
            gsap.from(watchRef.current, {
                x: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top 82%',
                    once: true,
                    invalidateOnRefresh: true,
                },
            });

            // Watch subtle float on scroll
            gsap.to(watchRef.current, {
                y: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                },
            });

            // Product strip stagger reveal
            gsap.from('.lb-product-card', {
                y: 30,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: stripRef.current,
                    start: 'top 88%',
                    once: true,
                    invalidateOnRefresh: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} style={{ background: '#080808', overflow: 'hidden' }}>

            {/* ═══════════════════════════════════════════
                CINEMATIC HERO — watch + title overlay
            ═══════════════════════════════════════════ */}
            <div
                ref={heroRef}
                style={{
                    position: 'relative',
                    minHeight: 'clamp(420px, 60vw, 700px)',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    background: 'radial-gradient(ellipse 120% 80% at 70% 50%, #12100d 0%, #080808 60%)',
                }}
            >
                {/* Subtle grain texture overlay */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                    background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat', backgroundSize: '256px',
                }} />

                {/* Gold atmospheric glow behind watch */}
                <div style={{
                    position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)',
                    width: '65%', height: '120%',
                    background: 'radial-gradient(ellipse, rgba(180,150,90,0.08) 0%, transparent 65%)',
                    filter: 'blur(40px)', zIndex: 2, pointerEvents: 'none',
                }} />

                {/* Left: Text content */}
                <div
                    ref={textRef}
                    style={{
                        position: 'relative', zIndex: 10,
                        flex: '0 0 auto', width: 'clamp(280px, 42%, 520px)',
                        padding: 'clamp(32px, 5vw, 72px) clamp(20px, 4vw, 64px)',
                    }}
                >
                    <span style={{
                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em',
                        textTransform: 'uppercase', color: 'rgba(198,167,110,0.7)',
                        display: 'block', marginBottom: '20px',
                    }}>
                        Signature Collection
                    </span>

                    <h2 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(42px, 6vw, 90px)',
                        lineHeight: 0.88,
                        margin: '0 0 16px',
                        color: '#f0ede8',
                        fontWeight: 700,
                    }}>
                        Urban
                        <br />
                        <span style={{
                            fontStyle: 'italic', fontWeight: 300,
                            color: 'rgba(240,237,232,0.55)',
                        }}>
                            Essentials
                        </span>
                    </h2>

                    <p style={{
                        fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)', marginBottom: '20px',
                    }}>
                        Spring / Summer 2026
                    </p>

                    <p style={{
                        fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.65,
                        color: 'rgba(255,255,255,0.45)', maxWidth: '340px',
                        marginBottom: '36px',
                    }}>
                        Curated aesthetics for the modern minimalist. Discover pieces that define specific moments in time.
                    </p>

                    <Link
                        to="/collections/all"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
                            textTransform: 'uppercase', color: '#f0ede8',
                            textDecoration: 'none',
                            borderBottom: '1px solid rgba(240,237,232,0.4)',
                            paddingBottom: '4px',
                            transition: 'color 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'rgba(198,167,110,0.9)';
                            e.currentTarget.style.borderColor = 'rgba(198,167,110,0.5)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = '#f0ede8';
                            e.currentTarget.style.borderColor = 'rgba(240,237,232,0.4)';
                        }}
                    >
                        View Lookbook <ArrowUpRight size={14} />
                    </Link>
                </div>

                {/* Right: Watch — large, overlapping */}
                <div
                    ref={watchRef}
                    style={{
                        position: 'absolute',
                        right: 'clamp(-60px, -4vw, -20px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 'clamp(340px, 54%, 700px)',
                        zIndex: 8,
                        pointerEvents: 'none',
                    }}
                >
                    <img
                        src="/images/misc/watch-bg-removed.png"
                        alt="Patek Philippe Nautilus"
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 24px 80px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(180,150,90,0.12))',
                            willChange: 'transform',
                            display: 'block',
                        }}
                    />
                </div>

                {/* Bottom fade into product strip */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
                    background: 'linear-gradient(to top, #080808 0%, transparent 100%)',
                    zIndex: 9, pointerEvents: 'none',
                }} />
            </div>

            {/* ═══════════════════════════════════════════
                PRODUCT STRIP — signature fragrances row
            ═══════════════════════════════════════════ */}
            <div
                ref={stripRef}
                style={{
                    background: '#080808',
                    padding: 'clamp(20px, 3vw, 48px) clamp(16px, 4vw, 64px) clamp(40px, 5vw, 72px)',
                }}
            >
                {/* Strip header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 'clamp(20px, 2.5vw, 36px)',
                }}>
                    <span style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em',
                        textTransform: 'uppercase', color: 'rgba(198,167,110,0.7)',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <span style={{
                            display: 'inline-block', width: '24px', height: '1px',
                            background: 'rgba(198,167,110,0.5)',
                        }} />
                        Signature Fragrances
                    </span>
                    <Link
                        to="/collections/all?category=Perfume"
                        style={{
                            fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em',
                            textTransform: 'uppercase', color: '#f0ede8',
                            textDecoration: 'none',
                            border: '1px solid rgba(240,237,232,0.2)',
                            padding: '8px 20px',
                            transition: 'background 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.borderColor = 'rgba(240,237,232,0.4)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(240,237,232,0.2)';
                        }}
                    >
                        Shop Now
                    </Link>
                </div>

                {/* Product cards row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 'clamp(8px, 1.2vw, 16px)',
                    alignItems: 'end',
                }}>
                    {displayProducts.map((p, i) => (
                        <Link
                            key={p.id || i}
                            to={p.link}
                            className="lb-product-card"
                            style={{
                                display: 'block', textDecoration: 'none',
                                background: p.gold
                                    ? 'radial-gradient(ellipse at 50% 80%, #2a1a0a 0%, #0f0b07 55%, #080808 100%)'
                                    : 'linear-gradient(160deg, #111 0%, #0c0c0c 100%)',
                                border: p.gold
                                    ? '1px solid rgba(198,167,110,0.18)'
                                    : '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                position: 'relative',
                                aspectRatio: i === 0 ? '3/4' : '3/4',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = p.gold
                                    ? '0 20px 48px rgba(0,0,0,0.5), 0 0 24px rgba(198,167,110,0.12)'
                                    : '0 20px 48px rgba(0,0,0,0.5)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Gold ambient glow for featured */}
                            {p.gold && (
                                <div style={{
                                    position: 'absolute', top: '30%', left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '70%', height: '50%',
                                    background: 'radial-gradient(circle, rgba(198,167,110,0.2) 0%, transparent 70%)',
                                    filter: 'blur(16px)', zIndex: 1, pointerEvents: 'none',
                                }} />
                            )}

                            {/* Product image */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '12% 8% 28%', zIndex: 2,
                            }}>
                                <img
                                    src={p.src}
                                    alt={p.name}
                                    style={{
                                        width: '100%', height: '100%',
                                        objectFit: 'contain',
                                        filter: p.gold
                                            ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.7)) drop-shadow(0 0 16px rgba(198,167,110,0.15))'
                                            : 'drop-shadow(0 8px 24px rgba(0,0,0,0.7))',
                                        transition: 'transform 0.4s ease',
                                    }}
                                />
                            </div>

                            {/* Bottom label */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: '20px 12px 14px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                                zIndex: 3,
                            }}>
                                <p style={{
                                    fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase',
                                    color: p.gold ? 'rgba(198,167,110,0.7)' : 'rgba(255,255,255,0.3)',
                                    margin: '0 0 2px',
                                }}>
                                    {p.label}
                                </p>
                                <p style={{
                                    fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em',
                                    color: 'rgba(240,237,232,0.9)', margin: '0 0 1px',
                                }}>
                                    {p.name}
                                </p>
                                <p style={{
                                    fontSize: '9px', letterSpacing: '0.1em',
                                    color: 'rgba(255,255,255,0.3)', margin: 0,
                                }}>
                                    {p.sub}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LookbookSection;
