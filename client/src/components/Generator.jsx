import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactWindow from 'react-window';
const Grid = ReactWindow['FixedSizeGrid'] || ReactWindow.default?.['FixedSizeGrid'];
import AutoSizer from 'react-virtualized-auto-sizer';
import { motion, AnimatePresence } from 'framer-motion';
import { FontEngine } from '../utils/fontEngine';
import { ValidationEngine } from '../utils/validation';
import { StorageManager } from '../utils/storage';
import FontCard from './FontCard';
import { useAdaptiveMotion } from '../context/MotionConfigContext';

const fontEngine = new FontEngine();
const validationEngine = new ValidationEngine();
const storageManager = new StorageManager();

export default function Generator() {
    const [text, setText] = useState('');
    const [activeMode, setActiveMode] = useState('fonts'); // 'fonts' | 'kaomoji' | 'preview'
    const [platformPreview, setPlatformPreview] = useState('instagram'); // 'instagram' | 'whatsapp'
    const [showExperimental, setShowExperimental] = useState(false);

    // Modifiers
    const [activeDecoration, setActiveDecoration] = useState(null);
    const [isGlitchActive, setIsGlitchActive] = useState(false);

    const [favorites, setFavorites] = useState(new Set());
    const [styles, setStyles] = useState([]);

    // Formatting for Grid
    const gutterSize = 16;
    const cardHeight = 140;

    // Adaptive Motion Context
    const { intensity } = useAdaptiveMotion();

    useEffect(() => {
        setFavorites(storageManager.getFavorites());
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/fonts';
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data && data.length) {
                    fontEngine.setFonts(data);
                    setStyles(fontEngine.getStyles());
                }
            })
            .catch(() => {
                setStyles(fontEngine.getStyles());
            });
    }, []);

    const processText = (baseText, fontName) => {
        let result = fontEngine.generate(baseText || "Fancy Font", fontName);
        if (isGlitchActive) result = fontEngine.generateZalgo(result, 20);
        if (activeDecoration) {
            const decos = fontEngine.getDecorations();
            if (decos[activeDecoration]) {
                result = `${decos[activeDecoration].left}${result}${decos[activeDecoration].right}`;
            }
        }
        return result;
    };

    const toggleFavorite = (fontName) => {
        const newFavs = new Set(favorites);
        if (newFavs.has(fontName)) newFavs.delete(fontName);
        else newFavs.add(fontName);
        setFavorites(newFavs);
        storageManager.toggleFavorite(fontName);
    };

    // Prepare data for Grid
    const gridData = useMemo(() => {
        if (activeMode === 'kaomoji') {
            const kaomojis = fontEngine.getKaomoji();
            return Object.entries(kaomojis).flatMap(([cat, list]) =>
                list.map(k => ({
                    fontName: `Kaomoji • ${cat}`,
                    transformedText: k,
                    safety: { level: 'safe' }
                }))
            );
        }

        return styles
            .filter(font => showExperimental || !font.isExperimental)
            .map(font => {
                const transformed = processText(text, font.fontName);
                const dynamicSafety = validationEngine.analyze(transformed, 'instagram');
                const staticSafety = font.safety || { level: 'safe' };

                let level = 'safe';
                if (staticSafety.level === 'danger' || dynamicSafety.safetyLevel === 'danger') level = 'danger';
                else if (staticSafety.level === 'warning' || dynamicSafety.safetyLevel === 'warning') level = 'warning';
                else if (staticSafety.level === 'experimental') level = 'experimental';

                return {
                    fontName: font.fontName,
                    transformedText: transformed,
                    safety: { level, reasons: [...(staticSafety.reasons || []), ...(dynamicSafety.reasons || [])] },
                    isExperimental: font.isExperimental
                };
            });
    }, [styles, text, activeMode, showExperimental, activeDecoration, isGlitchActive]);

    const Cell = ({ columnIndex, rowIndex, style, data }) => {
        const { items, columnCount } = data;
        const index = rowIndex * columnCount + columnIndex;
        if (index >= items.length) return null;

        const item = items[index];
        const cellStyle = {
            ...style,
            left: style.left + gutterSize,
            top: style.top + gutterSize,
            width: style.width - gutterSize,
            height: style.height - gutterSize
        };

        return (
            <div style={cellStyle}>
                <FontCard
                    fontName={item.fontName}
                    transformedText={item.transformedText}
                    isFavorite={favorites.has(item.fontName)}
                    safety={item.safety}
                    onCopy={() => { /* Handled in Card */ }}
                    onToggleFav={toggleFavorite}
                />
            </div>
        );
    };

    return (
        <section className="app-container">
            <header className="app-header">
                <h3>FANCYFONT <span style={{ color: 'var(--accent)' }}>PRO</span></h3>
                <div className="brand-badge">
                    <i className="fa-solid fa-check-circle"></i> V5.0 HUMAN-ADAPTIVE
                </div>
            </header>

            <motion.div
                className="input-hero"
                animate={text.length > 0 ? {
                    scale: 1.02,
                    borderColor: 'var(--accent)',
                    boxShadow: '0 0 30px rgba(var(--accent-rgb), 0.2)'
                } : {
                    scale: 1,
                    borderColor: 'var(--border-subtle)',
                    boxShadow: 'none'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <input
                    className="main-input"
                    type="text"
                    placeholder="Type something epic..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {activeMode === 'fonts' && (
                    <div className="modifier-bar">
                        <button className={`modifier-btn ${!activeDecoration && !isGlitchActive ? 'active' : ''}`} onClick={() => { setActiveDecoration(null); setIsGlitchActive(false); }}>NORMAL</button>
                        <button className={`modifier-btn ${isGlitchActive ? 'active' : ''}`} onClick={() => setIsGlitchActive(!isGlitchActive)}>GLITCH</button>
                        <div style={{ width: 1, background: 'var(--border-subtle)', margin: '0 0.5rem' }}></div>
                        {['Wings', 'Sparkle', 'Slashes'].map(deco => (
                            <button
                                key={deco}
                                className={`modifier-btn ${activeDecoration === deco ? 'active' : ''}`}
                                onClick={() => setActiveDecoration(activeDecoration === deco ? null : deco)}
                            >{deco.toUpperCase()}</button>
                        ))}
                    </div>
                )}
            </motion.div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`tab-btn ${activeMode === 'fonts' ? 'active' : ''}`} onClick={() => setActiveMode('fonts')}>STYLES</button>
                    <button className={`tab-btn ${activeMode === 'kaomoji' ? 'active' : ''}`} onClick={() => setActiveMode('kaomoji')}>KAOMOJI</button>
                    <button className={`tab-btn ${activeMode === 'preview' ? 'active' : ''}`} onClick={() => setActiveMode('preview')}>PREVIEW</button>
                </div>

                {activeMode === 'fonts' && (
                    <label className="experimental-toggle">
                        <input
                            type="checkbox"
                            checked={showExperimental}
                            onChange={(e) => setShowExperimental(e.target.checked)}
                        />
                        <span className="toggle-label">EXPERIMENTAL</span>
                    </label>
                )}
            </div>

            {/* Platform Preview Mode */}
            {activeMode === 'preview' ? (
                <div className="platform-previews">
                    {/* Instagram Mockup */}
                    <div className="preview-card instagram">
                        <div className="preview-header"><i className="fa-brands fa-instagram"></i> Instagram Bio</div>
                        <div className="preview-body">
                            <div className="circle-avatar"></div>
                            <div className="bio-lines">
                                <div className="bio-name">Your Name</div>
                                <div className="bio-text">{processText(text || "Fancy Font", 'MathBold')}</div>
                                <div className="bio-text">{processText(text || "Fancy Font", 'MathItalic')}</div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Mockup */}
                    <div className="preview-card whatsapp">
                        <div className="preview-header"><i className="fa-brands fa-whatsapp"></i> WhatsApp Status</div>
                        <div className="preview-body">
                            <div className="message-bubble">
                                {processText(text || "Fancy Font", 'Monospace')}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ height: '60vh', width: '100%', position: 'relative' }}>

                    {/* Ghost Typing Empty State */}
                    <AnimatePresence>
                        {text.length === 0 && activeMode === 'fonts' && (
                            <motion.div
                                className="ghost-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'none',
                                    textAlign: 'center',
                                    zIndex: 0,
                                    color: 'var(--text-muted)'
                                }}
                            >
                                <motion.div
                                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.98, 1.02, 0.98] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <i className="fa-regular fa-keyboard" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                                    <p style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>KINETIC ENGINE READY</p>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Type above to ignite the grid</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AutoSizer>
                        {({ height, width }) => {
                            const columnCount = width > 800 ? 3 : (width > 500 ? 2 : 1);
                            const rowCount = Math.ceil(gridData.length / columnCount);
                            const columnWidth = width / columnCount;

                            return (
                                <Grid
                                    columnCount={columnCount}
                                    columnWidth={columnWidth}
                                    height={height}
                                    rowCount={rowCount}
                                    rowHeight={cardHeight}
                                    width={width}
                                    itemData={{ items: gridData, columnCount }}
                                >
                                    {Cell}
                                </Grid>
                            );
                        }}
                    </AutoSizer>
                </div>
            )}
        </section>
    );
}
