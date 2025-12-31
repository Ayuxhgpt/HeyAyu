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

        if (ratio > 0.4) {
            safetyLevel = 'danger';
            reasons.push("Heavy pseudo-font (Zalgo) detected. May lag devices.");
        } else if (ratio > 0) {
            // Some checks for specific unicode blocks
            if (this._containsMathAlphanumeric(text)) {
                if (safetyLevel !== 'danger') safetyLevel = 'warning';
                reasons.push("Uses Mathematical Alphanumeric Symbols. Accessibility screen readers may struggle.");
            }
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
        // Simplified check against our known Zalgo ranges
        // A robust check would use proper Unicode properties, but we use our heuristic list + general range
        const code = char.codePointAt(0);

        // General Combining Diacritical Marks block (U+0300–U+036F)
        if (code >= 0x0300 && code <= 0x036F) return true;

        // Combining Diacritical Marks Supplement (U+1DC0–U+1DFF)
        if (code >= 0x1DC0 && code <= 0x1DFF) return true;

        // Combining Marks for Symbols (U+20D0–U+20FF)
        if (code >= 0x20D0 && code <= 0x20FF) return true;

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
