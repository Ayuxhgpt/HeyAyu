import React from 'react';

export default function Header() {
    return (
        <nav className="navbar">
            <div className="logo-area">
                <div className="logo-icon">✨</div>
                <span className="brand-name">Fancy<span className="gradient-text">Font</span> PRO</span>
            </div>
            <div className="nav-links">
                <a href="#features">Features</a>
                <a href="#generator">Generator</a>
                <a href="#" className="cta-small">Get Pro</a>
            </div>
        </nav>
    );
}
