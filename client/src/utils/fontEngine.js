/**
 * @fileoverview FontEngine - Pure logic for text transformations.
 * Handles font mapping, sorting, and decoration logic.
 */

import { FONT_DATA } from '../data/fonts.js';

export class FontEngine {
    constructor() {
        this.fonts = FONT_DATA;
        this.decorations = {
            "Wings": { left: "꧁", right: "꧂" },
            "Stars": { left: "★.·:·.", right: ".·:·.★" },
            "Sparkle": { left: " *:･ﾟ✧", right: "✧･ﾟ:* " },
            "Heart": { left: "♥ ", right: " ♥" },
            "Arrows": { left: "↠", right: "↞" },
            "Music": { left: "♬ ", right: " ♬" },
            "Japan": { left: "『", right: "』" },
            "Brackets": { left: "【", right: "】" },
            "Line": { left: "━━", right: "━━" },
            "Wave": { left: "〰", right: "〰" },
        };

        this.kaomoji = {
            "Happy": ["( ◡́.◡̀)", "(^◡^ )", "(◕‿◕✿)", "(◠﹏◠)", "(•‿•)", "｡◕ ‿ ◕｡", "(✯◡✯)", "ヽ(>∀<☆)ノ"],
            "Sad": ["( ◡́.◡̀)", "( ╥﹏╥)", "(T_T)", "(;´༎ຶД༎ຶ`)", "(个_个)", "(╥_╥)", "(-_-)", "ಥ_ಥ"],
            "Love": ["(♥_♥)", "(｡♥‿♥｡)", "♥(ˆ⌣ˆԅ)", "(´｡• ᵕ •｡`) ♡", "( ˘ ³˘)♥", "(❤ω❤)", "╰(✿´⌣`✿)╯♡"],
            "Angry": ["(‡▼益▼)", "(¬_¬)", "(>_<)", "(╬ Ò﹏Ó)", "凸(￣ヘ￣)", "😠", "(-_-#)", "(¬､¬)"],
            "Animals": ["(V) (°,,,,°) (V)", "(=^･ω･^=)", "ʕ •ᴥ•ʔ", "(ᵔᴥᵔ)", "(=^･ｪ･^=)", "／(･ × ･)＼", "くコ:彡"],
            "Action": ["(╯°□°）╯︵ ┻━┻", "┬─┬ノ( º _ ºノ)", "ᕙ(⇀‸↼‶)ᕗ", "(ง'̀-'́)ง", "̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿"],
        };

        this._sortFonts();
    }

    setFonts(newFonts) {
        if (Array.isArray(newFonts) && newFonts.length > 0) {
            this.fonts = newFonts;
            this._sortFonts();
        }
    }

    _sortFonts() {
        const priorityList = [
            "Tuxedo", "Silicomments", "Ex-box", "Slippy Silicon",
            "Fancy and Loud", "Fancy", "Medieval Initials", "Medieval Times",
            "Wings", "Bubbles", "All Circles", "Tics"
        ];

        this.fonts.sort((a, b) => {
            const indexA = priorityList.indexOf(a.fontName);
            const indexB = priorityList.indexOf(b.fontName);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
        });
    }

    /**
     * Transform text using a specific font style
     * @param {string} text 
     * @param {string} fontName 
     */
    generate(text, fontName) {
        if (!text) return "";
        const font = this.fonts.find(f => f.fontName === fontName);
        if (!font) return text;

        const ALPHABET_LOWER = "abcdefghijklmnopqrstuvwxyz";
        const ALPHABET_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const DIGITS = "0123456789";

        // Unpack (fontData strings are iterable, but spread checks for surrogates)
        const targetLower = [...(font.fontLower || "")];
        const targetUpper = [...(font.fontUpper || "")];
        const targetDigits = [...(font.fontDigits || "")];

        return [...text].map(char => {
            let index = ALPHABET_LOWER.indexOf(char);
            if (index > -1 && targetLower[index]) return targetLower[index];

            index = ALPHABET_UPPER.indexOf(char);
            if (index > -1 && targetUpper[index]) return targetUpper[index];

            index = DIGITS.indexOf(char);
            if (index > -1 && targetDigits[index]) return targetDigits[index];

            return char;
        }).join('');
    }

    getStyles() {
        return this.fonts;
    }

    getDecorations() {
        return this.decorations;
    }

    getKaomoji() {
        return this.kaomoji;
    }

    // Zalgo logic moved here or Validation? 
    // Usually generation logic.
    generateZalgo(text, amount = 0) {
        if (amount == 0) return text;

        const zalgoUp = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346', '\u031a'];
        const zalgoMid = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361', '\u0489'];
        const zalgoDown = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'];

        let result = "";
        [...text].forEach(char => {
            result += char;
            // Limit amount to reasonable density logic from original script (value 0-100)
            let count = Math.floor(amount / 10);
            for (let i = 0; i < count; i++) {
                if (Math.random() > 0.5) result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
                if (Math.random() > 0.5) result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
                if (Math.random() > 0.5) result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
            }
        });
        return result;
    }
}
