/**
 * @fileoverview ValidationEngine - Safety and Platform Compliance Logic.
 * Analyzes text for potential issues on specific platforms or general stability.
 */

import { PLATFORMS, UNICODE_RANGES } from './constants.js';

export class ValidationEngine {
    constructor() { }

    /**
     * Analyze text for safety and platform compliance
     * @param {string} text 
     * @param {string} platformKey 
     * @returns {Object} Safety Report
     */
    analyze(text, platformKey) {
        if (!text) return { safetyLevel: 'safe', reasons: [], platformWarning: null };

        const reasons = [];
        let safetyLevel = 'safe';
        let platformWarning = null;

        // 1. Zalgo Check (Heuristic: Density of combining marks)
        const combiningMarks = [...text].filter(char => this._isCombiningMark(char)).length;
        const ratio = combiningMarks / text.length;

        if (ratio > 0.6) {
            safetyLevel = 'danger';
            reasons.push("Heavy pseudo-font (Zalgo) detected. May lag devices.");
        } else if (ratio > 0.3) {
            if (safetyLevel !== 'danger') safetyLevel = 'warning';
            reasons.push("Moderate amount of combining marks. May look glitchy.");
        }

        // 2. Math Symbol Check (Separate from Zalgo)
        if (this._containsMathAlphanumeric(text)) {
            if (safetyLevel !== 'danger') safetyLevel = 'warning';
            reasons.push("Uses Mathematical Alphanumeric Symbols. Accessibility screen readers may struggle.");
        }

        // 2. Platform Check
        if (platformKey && PLATFORMS[platformKey]) {
            const limit = PLATFORMS[platformKey].max;
            if (text.length > limit) {
                platformWarning = `Exceeds ${PLATFORMS[platformKey].label} limit (${text.length}/${limit})`;
                if (safetyLevel !== 'danger') safetyLevel = 'warning';
            }
        }

        return {
            safetyLevel,
            reasons,
            platformWarning
        };
    }

    _isCombiningMark(char) {
        // Robust check using Unicode properties (if supported) or expanded ranges
        // Modern browsers support \p{Mark} but we'll use a broad range check for compatibility
        const code = char.codePointAt(0);

        // 1. General Combining Diacritical Marks (U+0300–U+036F)
        if (code >= 0x0300 && code <= 0x036F) return true;

        // 2. Combining Diacritical Marks Supplement (U+1DC0–U+1DFF)
        if (code >= 0x1DC0 && code <= 0x1DFF) return true;

        // 3. Combining Marks for Symbols (U+20D0–U+20FF)
        if (code >= 0x20D0 && code <= 0x20FF) return true;

        // 4. Combining Half Marks (U+FE20–U+FE2F)
        if (code >= 0xFE20 && code <= 0xFE2F) return true;

        // 5. Combining Diacritical Marks Extended (U+1AB0–U+1AFF)
        if (code >= 0x1AB0 && code <= 0x1AFF) return true;

        return false;
    }

    _containsMathAlphanumeric(text) {
        // Check for Mathematical Alphanumeric Symbols
        // U+1D400 to U+1D7FF
        for (const char of text) {
            const code = char.codePointAt(0);
            if (code >= 0x1D400 && code <= 0x1D7FF) return true;
        }
        return false;
    }
}
