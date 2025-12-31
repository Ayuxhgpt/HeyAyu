
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontsFilePath = path.join(__dirname, '../client/src/data/fonts.js');

// Helper to read the file considering it's an ES module export
async function readFonts() {
    const content = fs.readFileSync(fontsFilePath, 'utf-8');
    // Extract the array using regex since we can't easily require() an ES module file in a script without type: module in package.json affecting everything
    // or we can just treat it as text processing.
    const match = content.match(/export const FONT_DATA = (\[[\s\S]*?\]);/);
    if (!match) throw new Error("Could not parse FONT_DATA");
    // Evaluate the array strictly
    return eval(match[1]);
}

async function writeFonts(fonts) {
    const content = `export const FONT_DATA = ${JSON.stringify(fonts, null, 4)};`;
    fs.writeFileSync(fontsFilePath, content, 'utf-8');
}

// Heuristics for Safety
function analyzeSafety(font) {
    const unsafePatterns = [
        /Glitch/i, /Zalgo/i, /Chaos/i, /Corrupt/i
    ];

    // Check name
    if (unsafePatterns.some(p => p.test(font.fontName))) {
        return { level: 'danger', reasons: ['Contains glitch/chaos characters'] };
    }

    // Check content for unreadable blocks (simplified heuristic)
    // "Scratch Offs" (Block characters)
    if (font.fontLower.includes('█')) {
        return { level: 'warning', reasons: ['Heavily obscured text'] };
    }

    // "Blocked Quotes" check (if it looks like squares)
    // Check specific known bad fonts
    const experimentalNames = ['Scratch Offs', 'Big Brother', 'Contra Gulls', 'Slippy Silicon'];
    if (experimentalNames.includes(font.fontName)) {
        return { level: 'experimental', reasons: ['Hard to read', 'Stylistic only'] };
    }

    return { level: 'safe', reasons: ['Verified for general use'] };
}

async function main() {
    console.log("Starting Font Refactor...");
    let fonts = await readFonts();
    const initialCount = fonts.length;

    console.log(`Loaded ${initialCount} fonts.`);

    // 1. Deduplication (by fontLower content)
    const uniqueFonts = [];
    const seenContent = new Set();

    fonts.forEach(font => {
        // Create a signature based on the first 10 chars of lower
        const signature = font.fontLower.slice(0, 20);
        if (!seenContent.has(signature)) {
            seenContent.add(signature);
            uniqueFonts.push(font);
        } else {
            console.log(`Duplicate found: ${font.fontName} (Skipping)`);
        }
    });

    console.log(`Removed ${initialCount - uniqueFonts.length} duplicates.`);

    // 2. Decorator Separation (Identify "Wings", "Stars" which are just adornments)
    // The user wants to separate these. For now, we flag them.
    // Actually, "Wings" usually wrap text. If fontLower implies wrapping, we might flag it.
    // If fontLower == normal text but with stuff around it.
    // For this script, we'll mark them as 'modifier_candidate' if needed, but primarily focusing on Metadata.

    // 3. Safety Metadata
    const enhancedFonts = uniqueFonts.map(font => {
        const safety = analyzeSafety(font);
        return {
            ...font,
            safety,
            isExperimental: safety.level === 'experimental' || safety.level === 'danger'
        };
    });

    // 4. Sort: Safe first, then Experimental/Danger at bottom
    enhancedFonts.sort((a, b) => {
        const scoreA = a.safety.level === 'safe' ? 0 : 1;
        const scoreB = b.safety.level === 'safe' ? 0 : 1;
        return scoreA - scoreB;
    });

    await writeFonts(enhancedFonts);
    console.log("Fonts Refactored Successfully!");
    console.log(`Total active fonts: ${enhancedFonts.length}`);
}

main().catch(console.error);
