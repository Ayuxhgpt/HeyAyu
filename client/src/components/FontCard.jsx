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

    // Simplified Safety/Trait logic ("DNA")
    const getDnaBadges = () => {
        const badges = [];
        if (safety?.level === 'danger') badges.push({ icon: 'fa-triangle-exclamation', color: 'var(--danger)', title: 'Glitch Risk' });
        if (safety?.level === 'warning') badges.push({ icon: 'fa-eye-slash', color: 'var(--warning)', title: 'Hard to read' });
        if (fontName.includes('Zalgo') || fontName.includes('Glitch')) badges.push({ icon: 'fa-bolt', color: 'var(--accent)', title: 'Chaotic' });
        if (fontName.includes('Bold') || fontName.includes('Heavy')) badges.push({ icon: 'fa-dumbbell', color: 'var(--text-main)', title: 'Bold' });
        return badges;
    };

    const dnaBadges = getDnaBadges();

    return (
        <motion.div
            className={`font-card ${justCopied ? 'copied' : ''}`}
            onClick={handleCopy}
            role="button"
            tabIndex={0}
            layout
            whileHover={{
                scale: 1.02,
                y: -4,
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="card-header">
                <span className="font-name">{fontName}</span>
                <div className="card-meta" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {dnaBadges.map((badge, i) => (
                        <i
                            key={i}
                            className={`fa-solid ${badge.icon}`}
                            style={{ color: badge.color, fontSize: '0.7em', opacity: 0.8 }}
                            title={badge.title}
                        ></i>
                    ))}
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
