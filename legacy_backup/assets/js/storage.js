/**
 * @fileoverview StorageManager - Safe persistence abstraction.
 * Handles LocalStorage interactions with error handling and data integrity checks.
 */

import { HISTORY_LIMIT, STORAGE_KEYS } from './constants.js';

export class StorageManager {
    constructor() {
        this._historyCache = null;
        this._favoritesCache = null;
    }

    /**
     * Safe read from localStorage
     * @param {string} key 
     * @param {*} fallback 
     */
    _read(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            console.error("Storage Read Error:", e);
            return fallback;
        }
    }

    /**
     * Safe write to localStorage
     * @param {string} key 
     * @param {*} value 
     */
    _write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("Storage Write Error:", e);
        }
    }

    getHistory() {
        if (!this._historyCache) {
            this._historyCache = this._read(STORAGE_KEYS.HISTORY, []);
        }
        return this._historyCache;
    }

    /**
     * Save generated text to history.
     * Deduplicates and enforces LIFO/Limit.
     */
    saveHistory(text, styleId, styleName) {
        if (!text) return;

        const history = this.getHistory();
        const newItem = {
            text,
            styleId,
            styleName,
            timestamp: Date.now()
        };

        // Remove if exists (move to top)
        const existingIdx = history.findIndex(item => item.text === text && item.styleId === styleId);
        if (existingIdx !== -1) {
            history.splice(existingIdx, 1);
        }

        // Add to front
        history.unshift(newItem);

        // Cap limit
        if (history.length > HISTORY_LIMIT) {
            history.pop();
        }

        this._historyCache = history;
        this._write(STORAGE_KEYS.HISTORY, history);
    }

    getFavorites() {
        if (!this._favoritesCache) {
            this._favoritesCache = new Set(this._read(STORAGE_KEYS.FAVORITES, []));
        }
        return this._favoritesCache;
    }

    toggleFavorite(styleId) {
        const favs = this.getFavorites();
        if (favs.has(styleId)) {
            favs.delete(styleId);
        } else {
            favs.add(styleId);
        }

        this._favoritesCache = favs;
        this._write(STORAGE_KEYS.FAVORITES, Array.from(favs));
        return favs.has(styleId);
    }

    isFavorite(styleId) {
        return this.getFavorites().has(styleId);
    }
}
