import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getHeroImages } from '../api/settings';
import heroShoeUpdated from '../assets/hero-shoe-updated.png';
import heroShoe3 from '../assets/hero-shoe-3.png';
import heroNewBalance from '../assets/hero-new-balance.png';
import newHeroShoes from '../assets/new-hero-shoes.png';
import '../styles/hero.css';

const fallbackImages = [heroShoeUpdated, heroShoe3, heroNewBalance, newHeroShoes];

const addVersion = (url, version) => {
    if (!version) return url;
    return url.includes('?') ? `${url}&v=${version}` : `${url}?v=${version}`;
};

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { data: heroConfig } = useQuery({
        queryKey: ['hero-images'],
        queryFn: getHeroImages,
        retry: 1,
    });

    const version = heroConfig?.updatedAt ? new Date(heroConfig.updatedAt).getTime() : null;
    const configuredImages = Array.isArray(heroConfig?.images) && heroConfig.images.length > 0
        ? heroConfig.images.map((url) => addVersion(url, version))
        : fallbackImages;
    const images = configuredImages.length > 0 ? configuredImages : fallbackImages;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [images.length]);

    const lineVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
        }
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <header className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <motion.h1
                        className="hero-title"
                    >
                        <motion.span
                            className="block"
                            style={{ color: 'var(--color-black)' }}
                            whileHover={{ x: 10, color: "#6b7280" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Step Into
                        </motion.span>
                        <motion.span
                            className="block"
                            style={{ color: 'var(--color-black)' }}
                            whileHover={{ x: 10, color: "#6b7280" }}
                            transition={{ type: "spring", stiffness: 300 }}
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
                        <Link to="/collections/shoes" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Shop Shoes</Link>
                        <Link to="/collections/sandals" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>Shop Sandals</Link>
                    </motion.div>
                </div>
                <div className="hero-image-wrapper">
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
