import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/hero.css';

const images = [
    '/images/hero/nb1.png',
    '/images/hero/nb2.png',
    '/images/hero/nb3.png',
    '/images/hero/nb4.png',
];

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4500);

        return () => clearInterval(interval);
    }, []);

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
