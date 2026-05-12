import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = '';
        if (window.lenis) {
            window.lenis.start();
            window.lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
