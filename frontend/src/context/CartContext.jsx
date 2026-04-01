import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cartelle-cart');
        if (savedCart) {
            try {
<<<<<<< HEAD
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart local storage:', e);
=======
                const parsed = JSON.parse(savedCart);
                // Discard any items that have no valid id
                const valid = parsed.filter(item => item._id || item.id);
                setCartItems(valid);
            } catch (e) {
                console.error('Failed to parse cart local storage:', e);
                localStorage.removeItem('cartelle-cart');
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartelle-cart', JSON.stringify(cartItems));
    }, [cartItems]);

<<<<<<< HEAD
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
=======
    const getId = (item) => item._id || item.id;

    const addToCart = (product) => {
        const productId = getId(product);
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => getId(item) === productId);
            if (existingItem) {
                return prevItems.map(item =>
                    getId(item) === productId
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
<<<<<<< HEAD
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
=======
        setCartItems(prevItems => prevItems.filter(item => getId(item) !== productId));
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
<<<<<<< HEAD
                item.id === productId ? { ...item, quantity: newQuantity } : item
=======
                getId(item) === productId ? { ...item, quantity: newQuantity } : item
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Helper to parse price string ("$295") to number (295)
    const getPriceValue = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    };

    const cartTotal = cartItems.reduce((total, item) => {
        return total + (getPriceValue(item.price) * item.quantity);
    }, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
