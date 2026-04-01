import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
<<<<<<< HEAD
import CollectionSection from '../components/CollectionSection';
import FeaturedSection from '../components/FeaturedSection';
import LookbookSection from '../components/LookbookSection';
=======
import LookbookSection from '../components/LookbookSection';
import FeaturedSection from '../components/FeaturedSection';
import RegisterNudge from '../components/RegisterNudge';
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
import { pageTransition } from '../utils/animations';

const Home = () => {
    return (
<<<<<<< HEAD
        <motion.div
            {...pageTransition}
        >
            <Hero />
            <ProductGrid />
            <LookbookSection />
            <CollectionSection />
            <FeaturedSection />
=======
        <motion.div {...pageTransition}>
            <Hero />
            <ProductGrid />
            <LookbookSection />
            <FeaturedSection />
            <RegisterNudge />
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
        </motion.div>
    );
};

export default Home;
