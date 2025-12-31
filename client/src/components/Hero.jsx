import React from 'react';

export default function Hero() {
    return (
        <header className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">
                    DOMINATE<br />
                    <span className="gradient-text">YOUR FEED</span>
                </h1>
                <p className="hero-subtitle">
                    Stop posting boring text. Command attention with the world's most aggressive font engine.
                    <span className="typing-effect"></span>
                </p>
                <div className="hero-buttons">
                    <a href="#generator" className="cta-button primary">LAUNCH GENERATOR <i className="fa-solid fa-rocket"></i></a>
                    <a href="#features" className="cta-button secondary">Explore Features</a>
                </div>
            </div>
            {/* Stats Ticker */}
            <div className="stats-ticker glass-panel">
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
            </div>
        </header>
    );
}
