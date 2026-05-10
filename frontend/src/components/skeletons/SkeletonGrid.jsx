import React from 'react';
import SkeletonCard from './SkeletonCard';

const SkeletonGrid = ({ count = 8 }) => (
    <div className="product-grid" aria-busy="true" aria-label="Loading products…">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

export default SkeletonGrid;
