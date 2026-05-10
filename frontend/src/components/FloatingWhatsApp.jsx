import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/floating-whatsapp.css';

const ADMIN_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
const MESSAGE = 'Hi WAVWAY, I need help with shopping.';

const FloatingWhatsApp = () => {
    const href = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(MESSAGE)}`;

    return (
        <a
            className="floating-whatsapp"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with WAVWAY on WhatsApp"
        >
            <FaWhatsapp aria-hidden="true" />
        </a>
    );
};

export default FloatingWhatsApp;
