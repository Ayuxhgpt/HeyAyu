import React, { useState, useMemo, useEffect } from 'react';
import { FontEngine } from '../utils/fontEngine';
import { ValidationEngine } from '../utils/validation';
import { StorageManager } from '../utils/storage';
import { PLATFORMS } from '../utils/constants';
import FontCard from './FontCard';

// Instantiate outside component to avoid re-creation
const fontEngine = new FontEngine();
const validationEngine = new ValidationEngine();
const storageManager = new StorageManager();



export default function Generator() {
    const [text, setText] = useState('');
    const [platform, setPlatform] = useState('');
    // "Modes" now refers to essentially different tools (Fonts vs Kaomoji)
    const [activeMode, setActiveMode] = useState('fonts');

    // Modifiers (Applied to all fonts)
    const [activeDecoration, setActiveDecoration] = useState(null); // Key of decoration
    const [isGlitchActive, setIsGlitchActive] = useState(false);

    const [favorites, setFavorites] = useState(new Set());
    const [toast, setToast] = useState(null);
    const [styles, setStyles] = useState(fontEngine.getStyles());

    useEffect(() => {
        setFavorites(storageManager.getFavorites());
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/fonts';
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    fontEngine.setFonts(data);
                    setStyles(fontEngine.getStyles());
                }
            })
            .catch(err => console.log("Using local fonts", err));
    }, []);

    const handleCopy = async (content, styleName) => {
        try {
            await navigator.clipboard.writeText(content);
            // Visual flash handled by FontCard internal state
            // Logic for storage
            storageManager.saveHistory(content, styleName, styleName);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const toggleFavorite = (fontName) => {
        const newFavs = new Set(favorites);
        if (newFavs.has(fontName)) newFavs.delete(fontName);
        else newFavs.add(fontName);
        setFavorites(newFavs);
        storageManager.toggleFavorite(fontName);
    };

    const decorations = useMemo(() => fontEngine.getDecorations(), []);
    const kaomojis = useMemo(() => fontEngine.getKaomoji(), []);

    const processText = (baseText, fontName) => {
        let result = fontEngine.generate(baseText || "Fancy Font", fontName);

        if (isGlitchActive) {
            result = fontEngine.generateZalgo(result, 20); // 20% chaos default
        }

        if (activeDecoration && decorations[activeDecoration]) {
            const { left, right } = decorations[activeDecoration];
            result = `${left}${result}${right}`;
        }

        return result;
    };

    const renderModifiers = () => (
        <div className="modifier-bar">
            <button
                className={`modifier-btn ${!activeDecoration && !isGlitchActive ? 'active' : ''}`}
                onClick={() => { setActiveDecoration(null); setIsGlitchActive(false); }}
            >
                <i className="fa-solid fa-ban"></i> NORMAL
            </button>

            <button
                className={`modifier-btn ${isGlitchActive ? 'active' : ''}`}
                onClick={() => setIsGlitchActive(!isGlitchActive)}
            >
                <i className="fa-solid fa-bolt"></i> GLITCH
            </button>

            <div style={{ width: 1, background: 'var(--border-subtle)', margin: '0 0.5rem' }}></div>

            {Object.keys(decorations).map(decoKey => (
                <button
                    key={decoKey}
                    className={`modifier-btn ${activeDecoration === decoKey ? 'active' : ''}`}
                    onClick={() => setActiveDecoration(activeDecoration === decoKey ? null : decoKey)}
                >
                    {decoKey}
                </button>
            ))}
        </div>
    );

    const renderContent = () => {
        if (activeMode === 'kaomoji') {
            return (
                <div className="font-grid">
                    {Object.entries(kaomojis).flatMap(([cat, list]) =>
                        list.map((k, i) => (
                            <FontCard
                                key={`${cat}-${i}`}
                                fontName={`Kaomoji • ${cat}`}
                                transformedText={k}
                                isFavorite={false} // Kaomoji favs not implemented yet
                                safety={{ level: 'safe' }}
                                onCopy={handleCopy}
                                onToggleFav={() => { }}
                            />
                        ))
                    )}
                </div>
            );
        }

        // Fonts Mode
        return (
            <div className="font-grid">
                {styles.map(font => {
                    const transformed = processText(text, font.fontName);
                    const safety = validationEngine.analyze(transformed, platform);

                    // Simple map for now, logic in validation.js returns 'safe', 'warning', 'danger'
                    if (safety.safetyLevel === 'safe') safety.level = 'safe'; // adapter if needed

                    return (
                        <FontCard
                            key={font.fontName}
                            fontName={font.fontName}
                            transformedText={transformed}
                            isFavorite={favorites.has(font.fontName)}
                            safety={{
                                level: safety.safetyLevel,
                                reasons: safety.reasons
                            }}
                            onCopy={handleCopy}
                            onToggleFav={toggleFavorite}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <section className="app-container">
            <header className="app-header">
                <h3>FANCYFONT <span style={{ color: 'var(--accent)' }}>PRO</span></h3>
                <div className="brand-badge">
                    <i className="fa-solid fa-check-circle"></i> V2.0 SYSTEM ONLINE
                </div>
            </header>

            <div className="input-hero">
                <input
                    className="main-input"
                    type="text"
                    placeholder="Type something epic..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {activeMode === 'fonts' && renderModifiers()}
            </div>

            {/* Simple Mode Toggle */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                    className={`tab-btn ${activeMode === 'fonts' ? 'active' : ''}`}
                    onClick={() => setActiveMode('fonts')}
                >
                    STYLES
                </button>
                <button
                    className={`tab-btn ${activeMode === 'kaomoji' ? 'active' : ''}`}
                    onClick={() => setActiveMode('kaomoji')}
                >
                    KAOMOJI
                </button>
            </div>

            {renderContent()}

            {toast && (
                <div className="toast visible">
                    <span>{toast}</span>
                </div>
            )}
        </section>
    );
}
