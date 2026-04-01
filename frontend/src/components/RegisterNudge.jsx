import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/register-nudge.css';

const STORAGE_KEY = 'wavway_nudge_dismissed';
const SHOW_DELAY = 4000; // show after 4s

const RegisterNudge = () => {
    const { user, isGuest, openAuthModal } = useAuth();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Don't show if already logged in, guest, or dismissed before
        if (user || isGuest) return;
        if (sessionStorage.getItem(STORAGE_KEY)) return;

        const t = setTimeout(() => setVisible(true), SHOW_DELAY);
        return () => clearTimeout(t);
    }, [user, isGuest]);

    const dismiss = () => {
        sessionStorage.setItem(STORAGE_KEY, '1');
        setVisible(false);
    };

    const handleJoin = () => {
        dismiss();
        openAuthModal();
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="rn-wrap"
                    initial={{ opacity: 0, y: 32, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.96 }}
                    transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                >
                    {/* Close */}
                    <button className="rn-close" onClick={dismiss} aria-label="Close">
                        <X size={13} />
                    </button>

                    {/* Top accent */}
                    <div className="rn-accent" />

                    {/* Content */}
                    <div className="rn-body">
                        <div className="rn-icon-wrap">
                            <Gift size={22} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="rn-eyebrow">Members only</p>
                            <h3 className="rn-title">Join WAVWAY</h3>
                            <p className="rn-sub">
                                Create a free account and get exclusive deals, early access to new drops &amp; faster checkout.
                            </p>
                        </div>
                    </div>

                    {/* Perks */}
                    <div className="rn-perks">
                        <div className="rn-perk">
                            <Zap size={11} />
                            Early access to new drops
                        </div>
                        <div className="rn-perk">
                            <ShieldCheck size={11} />
                            Order tracking &amp; history
                        </div>
                    </div>

                    {/* CTA */}
                    <button className="rn-cta" onClick={handleJoin}>
                        Create Free Account
                    </button>
                    <button className="rn-skip" onClick={dismiss}>
                        No thanks, I'll browse as guest
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RegisterNudge;
