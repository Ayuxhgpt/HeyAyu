/**
 * @fileoverview Main Entry Point.
 * Bootstraps the application using Dependency Injection.
 */

import { StorageManager } from './storage.js';
import { FontEngine } from './fontEngine.js';
import { ValidationEngine } from './validation.js';
import { UIManager } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantiate Core Services
    const storage = new StorageManager();
    const fontEngine = new FontEngine();
    const validation = new ValidationEngine();

    // 2. Inject into UI Manager
    const ui = new UIManager({
        storage,
        fontEngine,
        validation
    });

    // 3. Global Error Handler (for safety)
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        console.error('Global Error: ', msg, error);
        return false;
    };

    console.log("FancyFont PRO SaaS Enigne Loaded 🚀");
});
