import React from 'react';
import { ShieldCheck, Award, Zap } from 'lucide-react';
import '../styles/tester-advantage.css';

const TesterAdvantageSection = () => (
    <section className="ta-section">
        <div className="container ta-inner">
            <div className="ta-grid">
                <div className="ta-content">
                    <span className="ta-eyebrow">Our Philosophy</span>
                    <h2 className="ta-title">The Tester Advantage</h2>
                    <p className="ta-text">
                        "We believe luxury is about the essence, not the packaging. Our fragrances are 100% genuine, authentic designer tester perfumes. They contain the exact same original liquid you would find in a luxury boutique. The only difference? They are supplied without the commercial retail box or cap. This allows us to provide you with uncompromising, authentic scents at a truly accessible price point."
                    </p>
                </div>
                <div className="ta-features">
                    <div className="ta-feature">
                        <div className="ta-icon-wrap">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="ta-feat-info">
                            <h4>100% Authentic</h4>
                            <p>Guaranteed genuine designer fragrance liquid.</p>
                        </div>
                    </div>
                    <div className="ta-feature">
                        <div className="ta-icon-wrap">
                            <Award size={20} />
                        </div>
                        <div className="ta-feat-info">
                            <h4>Designer Quality</h4>
                            <p>Same premium essence found in boutiques.</p>
                        </div>
                    </div>
                    <div className="ta-feature">
                        <div className="ta-icon-wrap">
                            <Zap size={20} />
                        </div>
                        <div className="ta-feat-info">
                            <h4>Accessible Luxury</h4>
                            <p>Premium scents without the retail markup.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default TesterAdvantageSection;
