import React from 'react';
import '../../styles/skeleton.css';

const SkeletonProductDetail = () => (
    <div className="skeleton-detail" aria-hidden="true" aria-busy="true">
        {/* Left: image placeholder */}
        <div className="skeleton skeleton-detail-img" />

        {/* Right: text placeholders */}
        <div className="skeleton-detail-info">
            <div className="skeleton skeleton-detail-title" />
            <div className="skeleton skeleton-detail-price" />
            <div className="skeleton skeleton-detail-desc" />
            <div className="skeleton skeleton-detail-desc" style={{ width: '80%' }} />
            <div className="skeleton skeleton-detail-desc" style={{ width: '60%' }} />
            <div className="skeleton skeleton-detail-btn" />
            <div className="skeleton skeleton-detail-btn" style={{ opacity: 0.6 }} />
        </div>
    </div>
);

export default SkeletonProductDetail;
