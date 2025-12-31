import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MagneticWrapper from './ui/MagneticWrapper';

export default function Hero() {
    const [text, setText] = useState('');
    const fullText = "Stop posting boring text. Command attention with the world's most aggressive font engine.";

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(timer);
        }, 30);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="hero-section">
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="hero-title">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        DOMINATE
                    </motion.div>
                    <motion.span
                        className="gradient-text"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        YOUR FEED
                    </motion.span>
                </h1>

                <p className="hero-subtitle">
                    {text}<span className="typing-cursor">|</span>
                </p>

                <div className="hero-buttons">
                    <MagneticWrapper strength={0.3}>
                        <a href="#generator" className="cta-button primary">
                            LAUNCH GENERATOR <i className="fa-solid fa-rocket"></i>
                        </a>
                    </MagneticWrapper>
                    <MagneticWrapper strength={0.3}>
                        <a href="#features" className="cta-button secondary">Explore Features</a>
                    </MagneticWrapper>
                </div>
            </motion.div>

            {/* Stats Ticker */}
            <motion.div
                className="stats-ticker glass-panel"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <div className="stat-item">
                    <span className="stat-num">10k+</span>
                    <span className="stat-label">Alpha Creators</span>
                </div>
                <div className="stat-item">
                    <span className="stat-num">80+</span>
                    <span className="stat-label">Premium Styles</span>
                </div>
                <div className="stat-item">
                    <span className="stat-num">1M+</span>
                    <span className="stat-label">Texts Generated</span>
                </div>
            </motion.div>
        </header>
    );
}
