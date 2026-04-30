import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getHeroImages } from '../api/settings';
import heroShoeUpdated from '../assets/hero-shoe-updated.png';
import heroShoe3 from '../assets/hero-shoe-3.png';
import newHeroShoes from '../assets/new-hero-shoes.png';
import '../styles/hero.css';

const fallbackImages = [heroShoeUpdated, heroShoe3, newHeroShoes];

const addVersion = (url, version) => {
    if (!version) return url;
    return url.includes('?') ? `${url}&v=${version}` : `${url}?v=${version}`;
};

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const heroRef     = useRef(null);
    const imgWrapRef  = useRef(null);

    const { data: heroConfig } = useQuery({
        queryKey: ['hero-images'],
        queryFn: getHeroImages,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const version = heroConfig?.updatedAt ? new Date(heroConfig.updatedAt).getTime() : null;
    const configuredImages = Array.isArray(heroConfig?.images) && heroConfig.images.length > 0
        ? heroConfig.images.map((url) => addVersion(url, version))
        : fallbackImages;
    const images = configuredImages.length > 0 ? configuredImages : fallbackImages;

    // Auto-rotate images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [images.length]);

    // Parallax: shoe image drifts up gently as user scrolls past hero
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(imgWrapRef.current, {
                y: 50,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                },
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <header ref={heroRef} className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <p className="hero-eyebrow">New Collection 2026</p>
                    <motion.h1 className="hero-title">
                        <motion.span
                            className="block"
                            style={{ color: 'var(--color-black)' }}
                            whileHover={{ x: 10, color: '#6b7280' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            Step Into
                        </motion.span>
                        <motion.span
                            className="block"
                            style={{ color: 'var(--color-black)' }}
                            whileHover={{ x: 10, color: '#6b7280' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            Luxury
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Handcrafted footwear designed for the modern journey.
                        Comfort meets uncompromising style.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <Link to="/collections" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Shop Now</Link>
                    </motion.div>
                </div>

                <div ref={imgWrapRef} className="hero-image-wrapper">
                    {images.map((src, i) => (
                        <img
                            key={src}
                            src={src}
                            alt="Hero Shoes"
                            className="hero-image"
                            style={{
                                opacity: i === currentImageIndex ? 1 : 0,
                                transform: i === currentImageIndex ? 'scale(1)' : 'scale(0.94)',
                                transition: 'opacity 0.7s ease, transform 0.7s ease',
                                willChange: 'opacity, transform',
                            }}
                        />
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Hero;
