import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import LookbookSection from '../components/LookbookSection';
import FeaturedSection from '../components/FeaturedSection';
import RegisterNudge from '../components/RegisterNudge';
import { pageTransition } from '../utils/animations';

const Home = () => {
    return (
        <motion.div {...pageTransition}>
            <Hero />
            <ProductGrid />
            <LookbookSection />
            <FeaturedSection />
            <RegisterNudge />
        </motion.div>
    );
};

export default Home;
