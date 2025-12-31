import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FontCard = ({ fontName, transformedText, isFavorite, safety, onCopy, onToggleFav }) => {
    const [justCopied, setJustCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        onCopy(transformedText, fontName);
        setJustCopied(true);

        // Trigger haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(20);

        setTimeout(() => setJustCopied(false), 300);
    };

    // Map validation level to CSS class
    const safetyClass = {
        'safe': 'safety-safe',
        'warning': 'safety-warn',
        'danger': 'safety-danger'
    }[safety?.level || 'safe'] || 'safety-safe';

    return (
        <motion.div
            className={`font-card ${justCopied ? 'copied' : ''}`}
            onClick={handleCopy}
            role="button"
            tabIndex={0}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
                scale: 1.02,
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.96 }}
        >
            <div className="card-header">
                <span className="font-name">{fontName}</span>
                <div className="card-meta" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                        className={`safety-indicator ${safetyClass}`}
                        title={safety?.reasons?.join('\n') || 'Safe for most platforms'}
                    ></span>
                    <button
                        className="fav-btn"
                        onClick={(e) => { e.stopPropagation(); onToggleFav(fontName); }}
                        style={{ color: isFavorite ? 'var(--warning)' : 'var(--border-subtle)' }}
                    >
                        <i className={`fa-star ${isFavorite ? 'fa-solid' : 'fa-regular'}`}></i>
                    </button>
                </div>
            </div>

            <div className="card-preview">
                {transformedText || "Fancy Text"}
            </div>

            <div className="copy-overlay">
                <span className="copy-badge">
                    <i className="fa-regular fa-copy"></i> COPY
                </span>
            </div>
        </motion.div>
    );
};

export default FontCard;
