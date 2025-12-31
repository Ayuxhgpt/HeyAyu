/**
 * @fileoverview UIManager - The brain of the frontend.
 * Coordinates DOM updates, events, and service interaction.
 */

import { PLATFORMS } from './constants.js';

export class UIManager {
    constructor({ storage, fontEngine, validation }) {
        this.storage = storage;
        this.fontEngine = fontEngine;
        this.validation = validation;

        this.state = {
            activePlatform: null,
            activeTab: 'fonts',
            inputText: ''
        };

        // Cache DOM Elements
        this.dom = {
            textInput: document.getElementById('textInput'),
            clearBtn: document.getElementById('clearBtn'),
            platformSelect: document.getElementById('platformMode'), // Need to add to HTML
            fontsContainer: document.getElementById('fontsContainer'),
            decoContainer: document.getElementById('decoContainer'),
            kaoContainer: document.getElementById('kaoContainer'),
            glitchInput: document.getElementById('glitchRange'),
            glitchVal: document.getElementById('glitchVal'),
            glitchResult: document.getElementById('glitchResult'),
            copyGlitchBtn: document.querySelector('.copy-glitch-btn'),
            tabs: document.querySelectorAll('.tab-btn'), // Need to update selector logic for side panel tabs if any
            toast: document.getElementById('toast'),
            sidePanel: {
                el: document.getElementById('sidePanel'),
                toggleBtn: document.getElementById('togglePanelBtn'),
                listContainer: document.getElementById('sideListContainer'),
                tabs: document.querySelectorAll('.panel-tab')
            }
        };

        this.init();
    }

    init() {
        this.renderPlatformOptions();
        this.bindEvents();
        this.renderAll();
        // Initial render of side panel content based on default tab
        this.renderSidePanel('history');
    }

    bindEvents() {
        // Input
        this.dom.textInput.addEventListener('input', (e) => {
            this.state.inputText = e.target.value;
            this.renderAll();
        });

        this.dom.clearBtn.addEventListener('click', () => {
            this.state.inputText = '';
            this.dom.textInput.value = '';
            this.renderAll();
            this.dom.textInput.focus();
        });

        // Platform Select
        if (this.dom.platformSelect) {
            this.dom.platformSelect.addEventListener('change', (e) => {
                this.state.activePlatform = e.target.value;
                this.validateAndRenderSafety();
            });
        }

        // Tabs (Main Nav)
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                // Determine if this is a main tab or side tab (simple check)
                const target = tab.getAttribute('data-tab');
                if (!target) return; // Might be side panel tab handled separately

                this.switchTab(target);
            });
        });

        // Glitch
        if (this.dom.glitchInput) {
            this.dom.glitchInput.addEventListener('input', (e) => {
                if (this.dom.glitchVal) this.dom.glitchVal.innerText = e.target.value;
                this.renderGlitch();
            });
        }

        if (this.dom.copyGlitchBtn) {
            this.dom.copyGlitchBtn.addEventListener('click', () => {
                this.handleCopy(this.dom.glitchResult.innerText, 'Glitch', 'zalgo');
            });
        }

        // Side Panel Toggle
        if (this.dom.sidePanel.toggleBtn) {
            this.dom.sidePanel.toggleBtn.addEventListener('click', () => {
                this.dom.sidePanel.el.classList.toggle('collapsed');
            });
        }

        // Side Panel Tabs
        this.dom.sidePanel.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.dom.sidePanel.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.getAttribute('data-target');
                this.renderSidePanel(target);
            });
        });
    }

    renderAll() {
        if (this.state.activeTab === 'fonts') this.renderFonts();
        if (this.state.activeTab === 'decorations') this.renderDecorations();
        if (this.state.activeTab === 'glitch') this.renderGlitch();
        // Emoticons are static mostly, but good to refresh if needed
    }

    renderPlatformOptions() {
        if (!this.dom.platformSelect) return;

        let html = `<option value="">-- No Platform Limit --</option>`;
        Object.entries(PLATFORMS).forEach(([key, config]) => {
            html += `<option value="${key}">${config.label} (Max ${config.max})</option>`;
        });
        this.dom.platformSelect.innerHTML = html;
    }

    renderFonts() {
        const text = this.state.inputText || "Fancy Font";
        const container = this.dom.fontsContainer;
        if (!container) return;

        container.innerHTML = "";

        const styles = this.fontEngine.getStyles();
        styles.forEach((font, idx) => {
            const transformed = this.fontEngine.generate(text, font.fontName);
            const isFav = this.storage.isFavorite(font.fontName);

            // Safety Check
            const safety = this.validation.analyze(transformed, this.state.activePlatform);
            const safetyClass = safety.safetyLevel; // safe, warning, danger

            const card = document.createElement('div');
            card.className = `font-card ${isFav ? 'favorite' : ''}`;
            card.style.animationDelay = `${Math.min(idx * 0.03, 1.0)}s`;

            card.innerHTML = `
                <div class="card-header">
                    <span class="card-label">${font.fontName}</span>
                    <div class="card-meta">
                        <span class="safety-dot ${safetyClass}" title="${safety.reasons.join(', ') || 'Safe'}"></span>
                        <button class="fav-btn" data-id="${font.fontName}">
                            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                        </button>
                    </div>
                </div>
                <div class="card-text">${transformed}</div>
                ${safety.platformWarning ? `<div class="platform-warn">${safety.platformWarning}</div>` : ''}
                <div class="ripple"></div>
            `;

            // Click to Copy (body)
            card.querySelector('.card-text').addEventListener('click', (e) => {
                this.handleCopy(transformed, font.fontName, 'font');
            });

            // Favorite Toggle
            card.querySelector('.fav-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const newStatus = this.storage.toggleFavorite(font.fontName);
                const icon = e.currentTarget.querySelector('i');
                icon.className = newStatus ? 'fa-solid fa-star' : 'fa-regular fa-star';
                card.classList.toggle('favorite', newStatus);
            });

            container.appendChild(card);
        });
    }

    renderDecorations() {
        // Very similar to fonts but using decorations
        const text = this.state.inputText || "Fancy Font";
        const container = this.dom.decoContainer;
        if (!container) return;

        container.innerHTML = "";
        const decos = this.fontEngine.getDecorations();

        Object.entries(decos).forEach(([name, deco]) => {
            const result = `${deco.left} ${text} ${deco.right}`;

            const card = document.createElement('div');
            card.className = "font-card";
            card.innerHTML = `
                <span class="card-label">${name}</span>
                <div class="card-text">${result}</div>
            `;

            card.addEventListener('click', () => this.handleCopy(result, name, 'deco'));
            container.appendChild(card);
        });
    }

    renderGlitch() {
        if (!this.dom.glitchResult) return;
        const text = this.state.inputText || "Glitch Text";
        const val = this.dom.glitchInput ? this.dom.glitchInput.value : 0;

        const result = this.fontEngine.generateZalgo(text, val);
        this.dom.glitchResult.innerText = result;

        // Update safety indicator for glitch
        const safety = this.validation.analyze(result, this.state.activePlatform);
        // We can render this somewhere if needed, currently just keeping it implicit in the look
    }

    renderSidePanel(type) {
        const container = this.dom.sidePanel.listContainer;
        if (!container) return;

        container.innerHTML = "";

        if (type === 'history') {
            const history = this.storage.getHistory();
            if (history.length === 0) {
                container.innerHTML = `<div class="empty-state">No history yet</div>`;
                return;
            }

            history.forEach(item => {
                const el = document.createElement('div');
                el.className = 'history-item';
                el.innerHTML = `
                    <div class="item-text">${item.text}</div>
                    <div class="item-meta">
                        <span>${item.styleName || 'Custom'}</span>
                        <span>${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                `;
                el.addEventListener('click', () => {
                    this.handleCopy(item.text, item.styleName, 'history');
                });
                container.appendChild(el);
            });
        } else if (type === 'favorites') {
            const favIds = this.storage.getFavorites(); // Set of strings
            if (favIds.size === 0) {
                container.innerHTML = `<div class="empty-state">No favorites yet</div>`;
                return;
            }

            // Need to reverse lookup font object or just store font name?
            // storage.js implementation of favorites stores styleId which is fontName
            const styles = this.fontEngine.getStyles();

            favIds.forEach(id => {
                const font = styles.find(s => s.fontName === id);
                if (!font) return;

                // Show a preview with current input text or sample
                const text = this.state.inputText || "Preview";
                const transformed = this.fontEngine.generate(text, font.fontName);

                const el = document.createElement('div');
                el.className = 'fav-item';
                el.innerHTML = `
                    <div class="item-text">${transformed}</div>
                    <div class="item-meta">
                        <span>${font.fontName}</span>
                        <i class="fa-solid fa-star" style="color: var(--status-warning)"></i>
                    </div>
                `;
                el.addEventListener('click', () => {
                    this.handleCopy(transformed, font.fontName, 'fav');
                });
                container.appendChild(el);
            });
        }
    }

    switchTab(tabId) {
        this.state.activeTab = tabId;

        // UI Updates
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`content-${tabId}`)?.classList.remove('hidden');

        this.renderAll();
    }

    async handleCopy(text, styleName, type) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast();
            // Saving history for all copies
            this.storage.saveHistory(text, styleName, styleName);

            // Refresh Side Panel if History is active
            const activeSideTab = document.querySelector('.panel-tab.active');
            if (activeSideTab && activeSideTab.getAttribute('data-target') === 'history') {
                this.renderSidePanel('history');
            }
        } catch (err) {
            console.error("Copy failed", err);
        }
    }

    showToast() {
        if (!this.dom.toast) return;
        this.dom.toast.classList.add('visible');
        setTimeout(() => this.dom.toast.classList.remove('visible'), 2000);
    }

    validateAndRenderSafety() {
        // Re-render current view to update safety dots
        this.renderAll();
    }
}
