import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

const useSmoothScroll = () => {
    const location = useLocation();
    const lenisRef = useRef(null);

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

        let raf;
        const animate = (time) => {
            lenis.raf(time);
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [excluded]);
};

export default useSmoothScroll;
