import React, { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('cartelle_orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartelle_orders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (orderData) => {
        const newOrder = {
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString(),
            timestamp: Date.now(),
            status: 'Processing', // Processing, Shipped, Out for Delivery, Delivered
            ...orderData
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const getOrder = (id) => {
        return orders.find(o => o.id === id);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, getOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
