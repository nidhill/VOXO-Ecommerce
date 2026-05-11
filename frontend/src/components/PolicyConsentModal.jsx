import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import '../styles/policy-modal.css';

const PolicyConsentModal = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        // Only show if user is logged in AND on the home page
        if (user && location.pathname === '/') {
            const hasConsented = localStorage.getItem(`wavway_consent_${user._id || user.id}`);
            if (!hasConsented) {
                const timer = setTimeout(() => setIsOpen(true), 1200);
                return () => clearTimeout(timer);
            }
        }
    }, [user, location.pathname]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // If using Lenis/Smooth Scroll, we might need to stop it
            if (window.lenis) window.lenis.stop();
        } else {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }
        return () => {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        };
    }, [isOpen]);

    const handleAccept = () => {
        if (!accepted) return;
        
        localStorage.setItem(`wavway_consent_${user._id || user.id}`, 'true');
        setIsOpen(false);
    };

    if (!user || !isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="policy-modal-overlay">
                    <motion.div 
                        className="policy-modal-card"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="policy-modal-header">
                            <div className="policy-icon-wrapper">
                                <ShieldCheck className="policy-icon" />
                            </div>
                            <h2 className="policy-title">Terms of Service</h2>
                            <p className="policy-subtitle">
                                Please review and accept our policies to continue shopping at Wavway.
                            </p>
                        </div>

                        <div className="policy-modal-body">
                            <div className="policy-info-box">
                                <p>We've updated our <strong>Terms & Conditions</strong> and <strong>Privacy Policy</strong> to better serve you and ensure the highest standards of security and transparency.</p>
                            </div>

                            <label className="policy-checkbox-container">
                                <input 
                                    type="checkbox" 
                                    checked={accepted} 
                                    onChange={(e) => setAccepted(e.target.checked)} 
                                />
                                <span className={`policy-custom-checkbox ${accepted ? 'checked' : ''}`}>
                                    {accepted && <Check size={14} />}
                                </span>
                                <span className="policy-checkbox-text">
                                    I have read and agree to the{' '}
                                    <Link to="/terms" target="_blank" className="policy-link">Terms & Conditions</Link>{' '}
                                    and{' '}
                                    <Link to="/privacy-policy" target="_blank" className="policy-link">Privacy Policy</Link>.
                                </span>
                            </label>
                        </div>

                        <div className="policy-modal-footer">
                            <button 
                                className={`policy-accept-btn ${!accepted ? 'disabled' : ''}`}
                                onClick={handleAccept}
                                disabled={!accepted}
                            >
                                Continue to Store
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PolicyConsentModal;
