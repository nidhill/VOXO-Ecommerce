import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useSmoothScroll = () => {
    const location  = useLocation();
    const lenisRef  = useRef(null);

    const excluded = location.pathname.startsWith('/admin') ||
        location.pathname === '/auth' ||
        location.pathname === '/forgot-password' ||
        location.pathname === '/reset-password' ||
        location.pathname === '/checkout' ||
        location.pathname === '/orders';

    useEffect(() => {
        if (excluded) return;

        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.8,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Bridge Lenis virtual scroll into GSAP ScrollTrigger so that
        // scroll-triggered animations track the smoothed position.
        lenis.on('scroll', ScrollTrigger.update);

        const ticker = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(ticker);
            lenis.off('scroll', ScrollTrigger.update);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [excluded]);
};

export default useSmoothScroll;
