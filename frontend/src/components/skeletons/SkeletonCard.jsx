import React from 'react';
import '../../styles/skeleton.css';

const SkeletonCard = () => (
    <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton skeleton-img" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-btn" />
    </div>
);

export default SkeletonCard;
