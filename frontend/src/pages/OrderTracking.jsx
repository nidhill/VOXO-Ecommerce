import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { motion } from 'framer-motion';
import '../styles/orders.css';

const OrderTracking = () => {
    const { id } = useParams();
    const { getOrder } = useOrder();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const foundOrder = getOrder(id);
        setOrder(foundOrder);
    }, [id, getOrder]);

    if (!order) {
        return (
            <div className="section container">
                <p>Order not found.</p>
                <Link to="/orders" className="btn-secondary">Back to Orders</Link>
            </div>
        );
    }

    const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0; // Default to 0 for demo

    return (
        <div className="tracking-page section container">
            <div className="tracking-header">
                <Link to="/orders" className="back-link">← Back to Orders</Link>
                <h2>Track Order <span className="highlight-id">{order.id}</span></h2>
                <p>Expected Delivery: {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}</p>
            </div>

            <div className="tracking-timeline">
                <div className="progress-bar-bg">
                    <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                </div>
                <div className="steps-container">
                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step} className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="step-circle">
                                    {isCompleted && (
                                        <motion.svg
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.8 + (index * 0.2) }}
                                            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </motion.svg>
                                    )}
                                </div>
                                <span className="step-label">{step}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="tracking-details">
                <h3>Order Items</h3>
                <div className="tracking-items">
                    {order.items.map(item => (
                        <div key={item.id} className="tracking-item">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h4>{item.name}</h4>
                                <p>Qty: {item.quantity}</p>
                            </div>
                            <span className="item-price">${item.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
