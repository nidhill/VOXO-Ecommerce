import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import LookbookSection from '../components/LookbookSection';
import FeaturedSection from '../components/FeaturedSection';
import TesterAdvantageSection from '../components/TesterAdvantageSection';
import { pageTransition } from '../utils/animations';
import useMeta from '../hooks/useMeta';

const Home = () => {
    useMeta('', 'WAVWAY — premium streetwear and lifestyle products. Shop the latest drops in clothing, footwear and accessories.');
    return (
        <motion.div {...pageTransition}>
            <Hero />
            <ProductGrid />
            <LookbookSection />
            <FeaturedSection />
            <TesterAdvantageSection />
        </motion.div>
    );
};

export default Home;
