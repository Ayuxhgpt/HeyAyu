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
    const [activeTab, setActiveTab] = useState('fonts'); // fonts, glitch, decorations, kaomoji
    const [favorites, setFavorites] = useState(new Set());
    const [baseGlitchAmount, setBaseGlitchAmount] = useState(20);
    const [toast, setToast] = useState(null);
    const [styles, setStyles] = useState(fontEngine.getStyles()); // State for fonts

    useEffect(() => {
        // Load initial favorites
        setFavorites(storageManager.getFavorites());

        // Fetch Fonts from API
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/fonts';
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    console.log("Loaded fonts from API");
                    fontEngine.setFonts(data);
                    setStyles(fontEngine.getStyles()); // Update state to trigger re-render
                }
            })
            .catch(err => {
                console.log("Using local fonts (API offline or error)", err);
            });
    }, []);

    const handleCopy = async (content, styleName) => {
        try {
            await navigator.clipboard.writeText(content);
            setToast('COPIED!');
            setTimeout(() => setToast(null), 2000);
            storageManager.saveHistory(content, styleName, styleName);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const toggleFavorite = (fontName) => {
        const newFavs = new Set(favorites);
        if (newFavs.has(fontName)) {
            newFavs.delete(fontName);
        } else {
            newFavs.add(fontName);
        }
        setFavorites(newFavs);
        storageManager.toggleFavorite(fontName);
    };

    // Derived Data
    const decos = useMemo(() => fontEngine.getDecorations(), []);
    const kaomojis = useMemo(() => fontEngine.getKaomoji(), []);

    // Render Logic
    const renderContent = () => {
        const inputText = text || "Fancy Font";

        if (activeTab === 'fonts') {
            return (
                <div className="results-grid" id="fontsContainer">
                    {styles.map(font => {
                        const transformed = fontEngine.generate(inputText, font.fontName);
                        const safety = validationEngine.analyze(transformed, platform);
                        return (
                            <FontCard
                                key={font.fontName}
                                fontName={font.fontName}
                                transformedText={transformed}
                                isFavorite={favorites.has(font.fontName)}
                                safety={safety}
                                onCopy={handleCopy}
                                onToggleFav={toggleFavorite}
                            />
                        );
                    })}
                </div>
            );
        }

        if (activeTab === 'glitch') {
            const glitchText = fontEngine.generateZalgo(inputText, baseGlitchAmount);
            return (
                <div className="tab-content">
                    <div className="control-panel">
                        <label>CHAOS LEVEL: <span>{baseGlitchAmount}</span>%</label>
                        <input
                            type="range"
                            min="0" max="100"
                            value={baseGlitchAmount}
                            onChange={(e) => setBaseGlitchAmount(parseInt(e.target.value))}
                            className="styled-slider"
                        />
                    </div>
                    <div className="result-box large-preview" onClick={() => handleCopy(glitchText, 'Glitch')}>
                        {glitchText}
                    </div>
                    <button className="action-btn" onClick={() => handleCopy(glitchText, 'Glitch')}>COPY GLITCH TEXT</button>
                </div>
            )
        }

        if (activeTab === 'decorations') {
            return (
                <div className="results-grid">
                    {Object.entries(decos).map(([name, deco]) => (
                        <div key={name} className="font-card" onClick={() => handleCopy(`${deco.left} ${inputText} ${deco.right}`, name)}>
                            <span className="card-label">{name}</span>
                            <div className="card-text">{deco.left} {inputText} {deco.right}</div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeTab === 'emoticons') {
            return (
                <div className="results-grid">
                    {Object.entries(kaomojis).flatMap(([cat, list]) =>
                        list.map((k, i) => (
                            <div key={`${cat}-${i}`} className="font-card" onClick={() => handleCopy(k, 'Kaomoji')}>
                                <span className="card-label">{cat}</span>
                                <div className="card-text">{k}</div>
                            </div>
                        ))
                    )}
                </div>
            );
        }
    };

    return (
        <section id="generator" className="saas-tool-section glass-container">
            <div className="tool-header">
                <h3><i className="fa-solid fa-terminal"></i> FANCYFONT_ENGINE_V2.0 (REACT)</h3>
                <div className="window-controls">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                </div>
            </div>

            <nav className="tabs">
                <button className={`tab-btn ${activeTab === 'fonts' ? 'active' : ''}`} onClick={() => setActiveTab('fonts')}><i className="fa-solid fa-font"></i> Styles</button>
                <button className={`tab-btn ${activeTab === 'glitch' ? 'active' : ''}`} onClick={() => setActiveTab('glitch')}><i className="fa-solid fa-bolt"></i> Glitch</button>
                <button className={`tab-btn ${activeTab === 'decorations' ? 'active' : ''}`} onClick={() => setActiveTab('decorations')}><i className="fa-solid fa-wand-magic-sparkles"></i> Deco</button>
                <button className={`tab-btn ${activeTab === 'emoticons' ? 'active' : ''}`} onClick={() => setActiveTab('emoticons')}><i className="fa-regular fa-face-smile"></i> Kaomoji</button>
            </nav>

            <section className="input-area sticky-header">
                <div className="controls-row">
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="platform-select">
                        <option value="">-- No Platform Limit --</option>
                        {Object.entries(PLATFORMS).map(([key, conf]) => (
                            <option key={key} value={key}>{conf.label} (Max {conf.max})</option>
                        ))}
                    </select>
                </div>
                <div className="input-wrapper glow-focus">
                    <input
                        type="text"
                        placeholder="ENTER YOUR TEXT HERE..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    {text && (
                        <button className="icon-btn" onClick={() => setText('')} title="Clear">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>
            </section>

            <div className="tab-content-wrapper">
                {renderContent()}
            </div>

            {toast && (
                <div id="toast" className="toast visible">
                    <i className="fa-solid fa-check"></i> <span>{toast}</span>
                </div>
            )}
        </section>
    );
}
