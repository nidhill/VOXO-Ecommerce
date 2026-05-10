import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, Package, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/register-nudge.css';

const SESSION_KEY = 'wavway_nudge_seen';
const SCROLL_THRESHOLD = 0.30; // 30% scroll depth
const TIMER_DELAY = 9000;      // 9s fallback if user doesn't scroll

const PERKS = [
    { icon: <Package size={15} />, text: 'Track your orders in real-time' },
    { icon: <Star size={15} />,    text: 'Early access to new arrivals & drops' },
    { icon: <Zap size={15} />,     text: 'Faster checkout every time' },
];

const RegisterNudge = () => {
    const { user, isGuest, openAuthModal } = useAuth();
    const [visible, setVisible] = useState(false);

    const shouldShow = useCallback(() => {
        if (user || isGuest) return false;
        if (sessionStorage.getItem(SESSION_KEY)) return false;
        return true;
    }, [user, isGuest]);

    const show = useCallback(() => {
        if (!shouldShow()) return;
        setVisible(true);
    }, [shouldShow]);

    const dismiss = () => {
        sessionStorage.setItem(SESSION_KEY, '1');
        setVisible(false);
    };

    const handleSignUp = () => {
        dismiss();
        openAuthModal('signup');
    };

    const handleSignIn = () => {
        dismiss();
        openAuthModal('login');
    };

    useEffect(() => {
        if (!shouldShow()) return;

        // Trigger on scroll
        const onScroll = () => {
            const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            if (scrolled >= SCROLL_THRESHOLD) {
                show();
                window.removeEventListener('scroll', onScroll);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // Fallback timer
        const timer = setTimeout(show, TIMER_DELAY);

        return () => {
            window.removeEventListener('scroll', onScroll);
            clearTimeout(timer);
        };
    }, [shouldShow, show]);

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="rn-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={dismiss}
                    />

                    {/* Modal — centering wrapper + animated inner */}
                    <div className="rn-modal-outer" role="dialog" aria-modal="true" aria-label="Join WAVWAY">
                    <motion.div
                        className="rn-modal"
                        initial={{ opacity: 0, scale: 0.93, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 16 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    >
                        {/* Close */}
                        <button className="rn-close" onClick={dismiss} aria-label="Close">
                            <X size={14} />
                        </button>

                        {/* Top stripe */}
                        <div className="rn-stripe" />

                        {/* Badge */}
                        <div className="rn-badge">
                            <ShoppingBag size={14} />
                            Members Only
                        </div>

                        {/* Headline */}
                        <h2 className="rn-title">
                            Join <em>WAVWAY</em>
                        </h2>
                        <p className="rn-sub">
                            Create a free account and unlock exclusive benefits, order tracking, and faster checkout.
                        </p>

                        {/* Perks */}
                        <ul className="rn-perks">
                            {PERKS.map((p, i) => (
                                <li key={i} className="rn-perk">
                                    <span className="rn-perk-icon">{p.icon}</span>
                                    {p.text}
                                </li>
                            ))}
                        </ul>

                        {/* CTAs */}
                        <div className="rn-actions">
                            <button className="rn-btn-primary" onClick={handleSignUp}>
                                Create Free Account
                            </button>
                            <button className="rn-btn-secondary" onClick={handleSignIn}>
                                Sign In
                            </button>
                        </div>

                        {/* Skip */}
                        <button className="rn-skip" onClick={dismiss}>
                            No thanks, continue browsing
                        </button>
                    </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RegisterNudge;
