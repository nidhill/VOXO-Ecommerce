import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { notify } from '../lib/toast';

const LOCAL_KEY = 'wavway_wishlist';

/**
 * useWishlist — guest-friendly wishlist.
 * - Logged-in users: persisted to server (stubs provided; wire up API routes when ready).
 * - Guest users: persisted in localStorage.
 * - On login: local items are merged with server items.
 */
export function useWishlist() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);

    // Load on mount / user change
    useEffect(() => {
        if (user) {
            // TODO: replace stub with real API call once backend wishlist route exists
            // api.get('/wishlist').then(res => setItems(res.data)).catch(() => {});
            const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
            setItems(local); // fallback until API is wired
        } else {
            const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
            setItems(saved);
        }
    }, [user]);

    const toggle = (product) => {
        const id = product._id || product.id;
        const exists = items.some(i => (i._id || i.id) === id);

        const updated = exists
            ? items.filter(i => (i._id || i.id) !== id)
            : [...items, product];

        setItems(updated);
        exists ? notify.wishlistRemove() : notify.wishlistAdd();

        // Persist
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    };

    /**
     * Call this after a successful login to merge any locally-saved wishlist
     * items with the user's existing server wishlist.
     */
    const mergeOnLogin = () => {
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
        if (local.length === 0) return;
        setItems(prev => {
            const merged = [
                ...prev,
                ...local.filter(l => !prev.some(s => (s._id || s.id) === (l._id || l.id))),
            ];
            localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
            return merged;
        });
    };

    const isWishlisted = (id) => items.some(i => (i._id || i.id) === id);

    return { items, toggle, mergeOnLogin, isWishlisted };
}
