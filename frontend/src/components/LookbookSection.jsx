import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuery } from '@tanstack/react-query';
import { getHomepageBanners } from '../api/settings';
import '../styles/lookbook.css';

const LookbookSection = () => {
    const sectionRef  = useRef(null);
    const heroRef     = useRef(null);
    const textRef     = useRef(null);

    const { data: banners } = useQuery({
        queryKey: ['homepage-banners'],
        queryFn: getHomepageBanners,
        staleTime: 5 * 60 * 1000,
    });

    const lookbookImage = banners?.lookbook;

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (textRef.current) {
                gsap.from(Array.from(textRef.current.children), {
                    y: 28,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.14,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top 80%',
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Only render the section if lookbook image exists, or always render it without the image?
    // Let's always render the section so the text is visible, but just skip the image if none is set.
    return (
        <section ref={sectionRef} style={{ background: '#f4f4f2', overflow: 'hidden' }}>

            {/* ═══════════════════════════════════════════
                CINEMATIC HERO — product + title overlay
            ═══════════════════════════════════════════ */}
            <div
                ref={heroRef}
                className="lb-hero"
                style={{
                    position: 'relative',
                    minHeight: 'clamp(420px, 60vw, 700px)',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    background: 'radial-gradient(ellipse 120% 80% at 70% 50%, #ffffff 0%, #f4f4f2 62%)',
                }}
            >
                {/* Subtle grain texture overlay */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                    background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat', backgroundSize: '256px',
                }} />

                {/* Gold atmospheric glow behind product */}
                {lookbookImage && (
                    <div className="lb-glow" style={{
                        position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)',
                        width: '65%', height: '120%',
                        background: 'radial-gradient(ellipse, rgba(180,150,90,0.18) 0%, transparent 65%)',
                        filter: 'blur(40px)', zIndex: 2, pointerEvents: 'none',
                    }} />
                )}

                {/* Left: Text content */}
                <div
                    ref={textRef}
                    className="lb-text"
                    style={{
                        position: 'relative', zIndex: 10,
                        flex: '0 0 auto', width: 'clamp(280px, 42%, 520px)',
                        padding: 'clamp(32px, 5vw, 72px) clamp(20px, 4vw, 64px)',
                    }}
                >
                    <span style={{
                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em',
                        textTransform: 'uppercase', color: '#6f5f3d',
                        display: 'block', marginBottom: '20px',
                    }}>
                        Signature Collection
                    </span>

                    <h2 className="lb-hero-title" style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(42px, 6vw, 90px)',
                        lineHeight: 0.88,
                        margin: '0 0 16px',
                        color: '#111111',
                        fontWeight: 700,
                    }}>
                        Urban
                        <br />
                        <span style={{
                            fontStyle: 'italic', fontWeight: 300,
                            color: '#555555',
                        }}>
                            Essentials
                        </span>
                    </h2>

                    <p style={{
                        fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: '#666666', marginBottom: '20px',
                    }}>
                        Spring / Summer 2026
                    </p>

                    <p className="lb-hero-desc" style={{
                        fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.65,
                        color: '#333333', maxWidth: '340px',
                        marginBottom: '36px',
                    }}>
                        Curated aesthetics for the modern minimalist. Discover pieces that define specific moments in time.
                    </p>

                    <Link
                        to="/collections/all"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
                            textTransform: 'uppercase', color: '#111111',
                            textDecoration: 'none',
                            borderBottom: '1px solid rgba(17,17,17,0.35)',
                            paddingBottom: '4px',
                            transition: 'color 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.borderColor = '#000000';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = '#111111';
                            e.currentTarget.style.borderColor = 'rgba(17,17,17,0.35)';
                        }}
                    >
                        View Lookbook <ArrowUpRight size={14} />
                    </Link>
                </div>

                {/* Right: Product Image — large, overlapping */}
                {lookbookImage && (
                    <div
                        className="lb-watch"
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
                            src={lookbookImage}
                            alt="Signature Lookbook Product"
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 24px 52px rgba(0,0,0,0.16))',
                                willChange: 'transform',
                                display: 'block',
                                transformOrigin: 'center center',
                            }}
                        />
                    </div>
                )}

                {/* Bottom fade into product strip */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
                    background: 'linear-gradient(to top, #f4f4f2 0%, transparent 100%)',
                    zIndex: 9, pointerEvents: 'none',
                }} />
            </div>
        </section>
    );
};

export default LookbookSection;
