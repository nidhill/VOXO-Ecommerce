import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LookbookSection = () => {
    return (
        <section className="py-24 transition-colors duration-300" style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-black)' }}>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Content & Small Image */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <span className="font-semibold tracking-wider uppercase text-sm" style={{ color: 'var(--color-grey-500)' }}>Spring / Summer 2026</span>
                            <h2 className="text-5xl md:text-7xl font-bold mt-2 mb-6 font-serif leading-[0.9]" style={{ color: 'var(--color-black)' }}>
                                Urban <br />
                                <span className="italic font-light" style={{ color: 'var(--color-grey-500)' }}>Essentials</span>
                            </h2>
                            <p className="text-lg max-w-md leading-relaxed" style={{ color: 'var(--color-grey-500)' }}>
                                Curated aesthetics for the modern minimalist. Discover pieces that define specific moments in time.
                            </p>

                            <Link to="/collections/urban" className="mt-8 inline-flex items-center gap-2 font-bold tracking-wide uppercase pb-1 transition-colors" style={{ color: 'var(--color-black)', borderBottom: '2px solid var(--color-black)' }}>
                                View Lookbook <ArrowUpRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="relative w-full h-[300px] rounded-3xl overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop"
                                alt="Models walking"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                    </div>

                    {/* Right: Large Vertical Image */}
                    <div className="relative h-[600px] lg:h-[700px] rounded-[2.5rem] overflow-hidden ml-0 lg:ml-12 group">
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                            alt="Fashion portrait"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl max-w-xs">
                            <p className="font-serif text-2xl italic mb-2 text-black">"Style is a way to say who you are without having to speak."</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-black/60">— Rachel Zoe</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LookbookSection;
