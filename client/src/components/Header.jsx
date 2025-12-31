import React from 'react';
import { motion } from 'framer-motion';
import MagneticWrapper from './ui/MagneticWrapper';

export default function Header() {
    return (
        <motion.nav
            className="navbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
            <div className="logo-area">
                <motion.div
                    className="logo-icon"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    ✨
                </motion.div>
                <span className="brand-name">Fancy<span className="gradient-text">Font</span> PRO</span>
            </div>

            <div className="nav-links">
                <MagneticWrapper>
                    <a href="#features">Features</a>
                </MagneticWrapper>
                <MagneticWrapper>
                    <a href="#generator">Generator</a>
                </MagneticWrapper>
                <MagneticWrapper>
                    <a href="#" className="cta-small">Get Pro</a>
                </MagneticWrapper>
            </div>
        </motion.nav>
    );
}
