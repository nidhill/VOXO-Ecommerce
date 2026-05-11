import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';

const SizeGuide = ({ isOpen, onClose, category }) => {
    if (!isOpen) return null;

    const isFootwear = ['Shoes', 'Slippers', 'Sandals'].includes(category);
    const isApparel = ['Shirts', 'Jackets', 'T-Shirts', 'Pants', 'Joggers', 'Clothing', 'Apparel'].includes(category);

    return (
        <AnimatePresence>
            <div className="sg-overlay" onClick={onClose}>
                <motion.div 
                    className="sg-modal"
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="sg-header">
                        <div className="sg-title-wrap">
                            <Ruler size={20} className="sg-title-icon" />
                            <h2 className="sg-title">Size Guide</h2>
                        </div>
                        <button className="sg-close" onClick={onClose} aria-label="Close">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="sg-content">
                        {isFootwear && <FootwearChart />}
                        {isApparel && <ApparelChart />}
                        {!isFootwear && !isApparel && (
                            <div className="sg-empty">
                                <p>Standard sizing applies to this category. If you have specific questions about fit, please contact our support.</p>
                            </div>
                        )}

                        <div className="sg-footer">
                            <p><strong>Note:</strong> These measurements are a general guide. Fits may vary slightly by style or brand.</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .sg-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
                    backdrop-filter: blur(8px); z-index: 2000;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                }
                .sg-modal {
                    background: #fff; border-radius: 24px; width: 100%; max-width: 600px;
                    max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                }
                .sg-header {
                    padding: 24px 32px; border-bottom: 1px solid #f0f0f0;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .sg-title-wrap { display: flex; align-items: center; gap: 12px; }
                .sg-title-icon { color: #111; }
                .sg-title { font-size: 20px; font-weight: 800; color: #111; margin: 0; letter-spacing: -0.5px; }
                .sg-close { 
                    background: #f5f5f5; border: none; width: 36px; height: 36px; 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #666; transition: all 0.2s;
                }
                .sg-close:hover { background: #eee; color: #111; transform: rotate(90deg); }
                
                .sg-content { padding: 32px; overflow-y: auto; }
                
                .sg-table-wrap { margin-bottom: 24px; overflow-x: auto; border: 1.5px solid #f0f0f0; border-radius: 16px; }
                .sg-table { width: 100%; border-collapse: collapse; min-width: 450px; }
                .sg-table th { 
                    background: #fafafa; padding: 14px 16px; text-align: left; 
                    font-size: 11px; font-weight: 700; text-transform: uppercase; 
                    letter-spacing: 1px; color: #888; border-bottom: 1px solid #f0f0f0;
                }
                .sg-table td { padding: 14px 16px; font-size: 14px; font-weight: 600; color: #111; border-bottom: 1px solid #f8f8f8; }
                .sg-table tr:last-child td { border-bottom: none; }
                .sg-table tr:hover td { background: #fafafa; }
                
                .sg-section-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 12px; display: block; }
                .sg-footer { margin-top: 32px; padding: 20px; background: #f9f9f9; border-radius: 16px; }
                .sg-footer p { font-size: 13px; color: #666; margin: 0; line-height: 1.6; }
                
                @media (max-width: 480px) {
                    .sg-header { padding: 20px 24px; }
                    .sg-content { padding: 24px; }
                }
            `}</style>
        </AnimatePresence>
    );
};

const FootwearChart = () => (
    <>
        <span className="sg-section-title">Footwear Conversion (Men/Unisex)</span>
        <div className="sg-table-wrap">
            <table className="sg-table">
                <thead>
                    <tr>
                        <th>UK / India</th>
                        <th>EU / Euro</th>
                        <th>US (Men)</th>
                        <th>CM (Length)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>6</td><td>40</td><td>7</td><td>25.4</td></tr>
                    <tr><td>7</td><td>41</td><td>8</td><td>26.2</td></tr>
                    <tr><td>8</td><td>42</td><td>9</td><td>27.1</td></tr>
                    <tr><td>9</td><td>43</td><td>10</td><td>27.9</td></tr>
                    <tr><td>10</td><td>44</td><td>11</td><td>28.8</td></tr>
                    <tr><td>11</td><td>45</td><td>12</td><td>29.6</td></tr>
                </tbody>
            </table>
        </div>
    </>
);

const ApparelChart = () => (
    <>
        <span className="sg-section-title">Apparel Sizing (Standard)</span>
        <div className="sg-table-wrap">
            <table className="sg-table">
                <thead>
                    <tr>
                        <th>Size</th>
                        <th>Chest (in)</th>
                        <th>Waist (in)</th>
                        <th>Shoulder (in)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>S</td><td>36-38</td><td>30-32</td><td>17.0</td></tr>
                    <tr><td>M</td><td>39-41</td><td>33-35</td><td>17.5</td></tr>
                    <tr><td>L</td><td>42-44</td><td>36-38</td><td>18.5</td></tr>
                    <tr><td>XL</td><td>45-47</td><td>39-41</td><td>19.5</td></tr>
                    <tr><td>XXL</td><td>48-50</td><td>42-44</td><td>20.5</td></tr>
                </tbody>
            </table>
        </div>
    </>
);

export default SizeGuide;
