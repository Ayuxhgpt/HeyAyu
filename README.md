# FancyFont PRO 🚀

> **The World's Most Aggressive Text Generator.**
> Dominate your feed with 80+ premium fonts, glitch text (Zalgo), and advanced text modifiers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAyuxhgpt%2FHeyAyu)

![Project Preview](https://via.placeholder.com/1200x600.png?text=FancyFont+PRO+Preview+Interface)

## 🔥 Why FancyFont PRO?

Most font generators are ugly, ad-ridden 90s sites. **FancyFont PRO** is built for the modern creator.

- **💎 Cyber-Noir Aesthetic:** Deep black interface (`#050505`) with premium glassmorphism.
- **🛡️ Traffic-Light Safety:** Smart indicators (🟢 Safe, 🔴 Glitch) warn you if a font might break on TikTok/Instagram.
- **📱 Mobile First:** A responsive grid system that feels like a native app.
- **🛠️ Modifier Bar:** Instantly toggle **Sparkles (✨)**, **Wings (꧁꧂)**, or **Glitch Effects** on ANY font.

---

## 🏗️ Project Structure

This project uses a modern **MERN (Serverless)** architecture, optimized for Vercel.

```
FancyFont/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Generator, FontCard)
│   │   ├── data/           # Font Data & Mappings
│   │   ├── utils/          # Logic (Zalgo Engine, Validation)
│   │   └── index.css       # Design System (Cyber-Noir)
│   └── index.html          # Entry Point
│
├── server/                 # Backend (Node.js + Express)
│   ├── models/             # MongoDB Schemas
│   ├── api/                # Vercel Serverless Entry
│   └── index.js            # Express App
│
└── vercel.json             # Deployment Config
```

---

## ⚡ Quick Start

### 1. Frontend (The App)
Runs on port `5173` by default.
```bash
cd client
npm install
npm run dev
```

### 2. Backend (Optional)
Runs on port `5000`. The frontend falls back to local data if this isn't running!
```bash
cd server
npm install
node index.js
```

---

## 🚀 Deployment

This project is configured for **Zero-Config Deployment** on Vercel.

1.  Push to GitHub.
2.  Import project in Vercel.
3.  **Important:** Set styling/build command override if needed (usually auto-detected as Vite).
4.  Add Environment Variable `VITE_API_URL` (optional, for backend).

---

## 📝 License

© 2025 Sukoon Dev.
**Unbeatable Performance.**
