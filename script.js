// DOM Elements
const textInput = document.getElementById('textInput');
const clearBtn = document.getElementById('clearBtn');
const fontsContainer = document.getElementById('fontsContainer');
const decoContainer = document.getElementById('decoContainer');
const kaoContainer = document.getElementById('kaoContainer');
const glitchInput = document.getElementById('glitchRange');
const glitchVal = document.getElementById('glitchVal');
const glitchResult = document.getElementById('glitchResult');
const copyGlitchBtn = document.querySelector('.copy-glitch-btn');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const toast = document.getElementById('toast');
const bg = document.getElementById('interactiveBg');
const typingTarget = document.querySelector('.typing-effect');

// --- DATABASE ---
// Extensive Maps
// --- DATABASE ---
// Loaded from font_data.js
// const FONT_DATA comes from the external script

const fonts = typeof FONT_DATA !== 'undefined' ? FONT_DATA : [];

// Initial Load Check
if (fonts.length === 0) {
    console.error("FONT_DATA not loaded. Check font_data.js");
} else {
    // Check if we need to sort
    sortFonts();
    console.log(`Loaded ${fonts.length} fonts from static file.`);
}

function sortFonts() {
    const priorityList = [
        "Tuxedo",           // Serif Bold
        "Silicomments",     // Monospace/Typewriter
        "Jill",             // Sans Bold (Mapping assumption or similar)
        "Ex-box",           // Sans Bold
        "Fancy and Loud",   // Script Bold
        "Fancy",            // Script Normal
        "Medieval Times",   // Gothic Normal
        "Medieval Initials", // Gothic Bold
        "Double Struck",
        "Wings",            // Double Struck
        "Circles",          // Circles
        "Bubbles",          // Bubbles
        "Small Caps"
    ];

    // Some specific mapping from our python output:
    // "Serif Bold": "Tuxedo"
    // "Serif Italic": "Silicomments" (Actually identified as italic serif often)
    // "Sans Bold": "Ex-box"
    // "Sans Italic": "Slippy Silicon"
    // "Script Bold": "Fancy and Loud"
    // "Script Normal": "Fancy"
    // "Gothic Bold": "Medieval Initials"
    // "Gothic Normal": "Medieval Times"
    // "Double Struck": "Wings"
    // "Monospace": "Silicomments"
    // "squares": "Tuxedo" (Wait, tuxedo is blocky)

    // Improved Priority List based on Analysis
    const simplePriority = [
        "Tuxedo",           // Serif Bold 𝐀
        "Silicomments",     // Monospace 𝚊
        "Ex-box",           // Sans Bold 𝗮
        "Slippy Silicon",   // Sans Italic 𝘢
        "Fancy and Loud",   // Script Bold 𝓐
        "Fancy",            // Script Normal 𝒜
        "Medieval Initials",// Gothic Bold 𝕬
        "Medieval Times",   // Gothic Normal 𝔄
        "Wings",            // Double Struck 𝔸
        "Bubbles",          // Circled ⓐ
        "All Circles",      // Circled Upper Ⓐ
        "Tics",             // Sans Normal
    ];

    fonts.sort((a, b) => {
        const indexA = simplePriority.indexOf(a.fontName);
        const indexB = simplePriority.indexOf(b.fontName);

        // If both are in priority list
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB; // Lower index comes first
        }
        // If a is in priority, it comes first
        if (indexA !== -1) return -1;
        // If b is in priority, it comes first
        if (indexB !== -1) return 1;

        // Maintain original order for others
        return 0;
    });
}

function loadFonts() {
    // No-op or simple refresh if needed, but data is now static
    renderFonts(textInput.value);
}

const decorations = {
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

const kaomoji = {
    "Happy": ["( ◡́.◡̀)", "(^◡^ )", "(◕‿◕✿)", "(◠﹏◠)", "(•‿•)", "｡◕ ‿ ◕｡", "(✯◡✯)", "ヽ(>∀<☆)ノ"],
    "Sad": ["( ◡́.◡̀)", "( ╥﹏╥)", "(T_T)", "(;´༎ຶД༎ຶ`)", "(个_个)", "(╥_╥)", "(-_-)", "ಥ_ಥ"],
    "Love": ["(♥_♥)", "(｡♥‿♥｡)", "♥(ˆ⌣ˆԅ)", "(´｡• ᵕ •｡`) ♡", "( ˘ ³˘)♥", "(❤ω❤)", "╰(✿´⌣`✿)╯♡"],
    "Angry": ["(‡▼益▼)", "(¬_¬)", "(>_<)", "(╬ Ò﹏Ó)", "凸(￣ヘ￣)", "😠", "(-_-#)", "(¬､¬)"],
    "Animals": ["(V) (°,,,,°) (V)", "(=^･ω･^=)", "ʕ •ᴥ•ʔ", "(ᵔᴥᵔ)", "(=^･ｪ･^=)", "／(･ × ･)＼", "くコ:彡"],
    "Action": ["(╯°□°）╯︵ ┻━┻", "┬─┬ノ( º _ ºノ)", "ᕙ(⇀‸↼‶)ᕗ", "(ง'̀-'́)ง", "̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿"],
};

// --- LOGIC ---
const ALPHABET_LOWER = "abcdefghijklmnopqrstuvwxyz";
const ALPHABET_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

function transformText(text, fontData) {
    if (!text) return "";
    let result = "";

    // Unpack font data
    // fontData structure from JSON: { fontName, fontLower, fontUpper, fontDigits }
    // Ensure all strings are spreadable (some unicode chars are > 16 bit, but spread handles surrogates mostly ok)
    // Actually, for direct indexing, we need Array.from or split
    // The JSON provided usually maps 1:1 with standard alphabets.

    const targetLower = [...(fontData.fontLower || "")];
    const targetUpper = [...(fontData.fontUpper || "")];
    const targetDigits = [...(fontData.fontDigits || "")];

    for (const char of text) {
        let index;

        // Lowercase
        index = ALPHABET_LOWER.indexOf(char);
        if (index > -1 && targetLower[index]) {
            result += targetLower[index];
            continue;
        }

        // Uppercase
        index = ALPHABET_UPPER.indexOf(char);
        if (index > -1 && targetUpper[index]) {
            result += targetUpper[index];
            continue;
        }

        // Digits
        index = DIGITS.indexOf(char);
        if (index > -1 && targetDigits[index]) {
            result += targetDigits[index];
            continue;
        }

        // Fallback
        result += char;
    }
    return result;
}

function renderFonts(text) {
    fontsContainer.innerHTML = "";
    let displayText = text || "Fancy Font";

    if (fonts.length === 0) {
        fontsContainer.innerHTML = `<div class="loading-msg">Loading styles...</div>`;
        return;
    }

    fonts.forEach((fontObj, idx) => {
        let styleName = fontObj.fontName;
        let transformed = transformText(displayText, fontObj);

        // Card creation
        let card = document.createElement("div");
        card.className = "font-card";
        // Stagger animation slightly but cap it so list doesn't take forever to appear
        let animDelay = Math.min(idx * 0.03, 1.5);
        card.style.animationDelay = `${animDelay}s`;

        card.innerHTML = `
            <span class="card-label">${styleName}</span>
            <div class="card-text">${transformed}</div>
            <div class="ripple"></div>
        `;

        card.addEventListener("click", (e) => {
            handleCopy(transformed, e);
        });

        fontsContainer.appendChild(card);
    });
}

function renderDecorations(text) {
    decoContainer.innerHTML = "";
    let displayText = text || "Fancy Font";

    // Decoration Tags
    let tagsHTML = `<div class="pill active">All</div>`;
    // We can filter later, for now just render all

    Object.keys(decorations).forEach((key, idx) => {
        let deco = decorations[key];
        let result = `${deco.left} ${displayText} ${deco.right}`;

        let card = document.createElement("div");
        card.className = "font-card";

        card.innerHTML = `
            <span class="card-label">${key} Style</span>
            <div class="card-text">${result}</div>
        `;

        card.addEventListener("click", (e) => handleCopy(result, e));
        decoContainer.appendChild(card);
    });
}

function renderKaomoji() {
    kaoContainer.innerHTML = "";
    const categoriesDiv = document.getElementById("kaoCategories");
    categoriesDiv.innerHTML = "";

    // Render Categories
    Object.keys(kaomoji).forEach((cat, idx) => {
        let btn = document.createElement("div");
        btn.className = `pill ${idx === 0 ? 'active' : ''}`;
        btn.innerText = cat;
        btn.onclick = () => {
            document.querySelectorAll(".category-pills .pill").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            renderKaomojiGrid(cat);
        };
        categoriesDiv.appendChild(btn);
    });

    // Initial Render
    renderKaomojiGrid(Object.keys(kaomoji)[0]);
}

function renderKaomojiGrid(category) {
    kaoContainer.innerHTML = "";
    kaomoji[category].forEach(face => {
        let card = document.createElement("div");
        card.className = "font-card";
        card.innerHTML = `<div class="card-text" style="text-align:center">${face}</div>`;
        card.addEventListener("click", (e) => handleCopy(face, e));
        kaoContainer.appendChild(card);
    });
}

// Zalgo Implementation
function updateGlitch() {
    let text = textInput.value || "Glitch Text";
    let amount = glitchInput.value;
    glitchVal.innerText = amount;

    if (amount == 0) {
        glitchResult.innerText = text;
        return;
    }

    // Simplified Zalgo logic
    const chars = [...text];
    const zalgoUp = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346', '\u031a'];
    const zalgoMid = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361', '\u0489'];
    const zalgoDown = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'];

    let result = "";
    chars.forEach(char => {
        result += char;
        let count = Math.floor(amount / 10);
        for (let i = 0; i < count; i++) {
            if (Math.random() > 0.5) result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
            if (Math.random() > 0.5) result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
            if (Math.random() > 0.5) result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
        }
    });

    glitchResult.innerText = result;
}


// --- INTERACTIONS ---
async function handleCopy(text, event) {
    try {
        await navigator.clipboard.writeText(text);

        // Show Toast
        toast.classList.add("visible");
        setTimeout(() => toast.classList.remove("visible"), 2000);

        // Ripple Effect
        if (event && event.currentTarget) {
            // Add visual cue
            const card = event.currentTarget.querySelector('.card-text') || event.currentTarget;
            card.style.transform = "scale(0.95)";
            setTimeout(() => card.style.transform = "scale(1)", 150);
        }
    } catch (err) {
        console.error(err);
    }
}

// Background Interaction
document.addEventListener("mousemove", (e) => {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;

    // Preserve the centering (translate -50%, -50%) while adding mouse offset
    bg.style.transform = `translate(calc(-50% + ${x * 20}px), calc(-50% + ${y * 20}px))`;
});

// Typing Effect Loop
const words = ["Cool Symbols", "Faиcy Foиt", "Glitch Text", "Kaomoji (•‿•)"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeEffect() {
    let currentWord = words[wordIdx];
    let displayText = isDeleting ? currentWord.substring(0, charIdx--) : currentWord.substring(0, charIdx++);

    typingTarget.innerText = displayText;

    let speed = isDeleting ? 50 : 150;

    if (!isDeleting && charIdx === currentWord.length + 1) {
        isDeleting = true;
        speed = 2000; // Pause at end
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 500;
    }

    setTimeout(typeEffect, speed);
}

// Initialization
function init() {
    loadFonts(); // This now handles initial render
    renderDecorations(textInput.value);
    renderKaomoji();
    updateGlitch();
    typeEffect();
}

// Event Listeners
textInput.addEventListener("input", () => {
    renderFonts(textInput.value);
    renderDecorations(textInput.value);
    updateGlitch();
});

clearBtn.addEventListener("click", () => {
    textInput.value = "";
    renderFonts("");
    renderDecorations("");
    updateGlitch();
    textInput.focus();
});

glitchInput.addEventListener("input", updateGlitch);
copyGlitchBtn.addEventListener("click", () => handleCopy(glitchResult.innerText));

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tabContent = document.querySelectorAll('.tab-content');
        tabContent.forEach(t => t.classList.add("hidden"));

        tab.classList.add("active");

        const targetId = tab.getAttribute("data-tab");
        document.getElementById(`content-${targetId}`).classList.remove("hidden");
    });
});

init();
