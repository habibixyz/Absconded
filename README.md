# ABSCONDED - The Signal Collection

> "Disappearing is easy. Becoming is the hard part."

This is not a blog. It is not a portfolio. It is a record of someone mid-becoming — manuscripts written in the hours between the life that was expected and the one being built instead. Fifteen stories. Real cities. Fictional names. The gap between the two is where the truth lives.

**ABSCONDED** is a premium digital manuscript reading platform built by **Tanvir Khan** — a digital library for his original long-form works, short fiction, and novels, designed for high-fidelity immersive reading.

---

## 📖 Features

- **The Signal Collection Shelf**: 
  - **Absconded**: A meditation on the internet, ambition, and the process of becoming (Prologue + 10 Chapters + Epilogue).
  - **Tethered**: An intimate chronicle of a builder absconding from corporate stability, balancing Web3 trading, AI prompts, fatherhood, and his wife's grueling 4-hour commute (Prologue + 10 Chapters + Epilogue).
  - **The Signal and the Stairs**: Notes on building yourself back from the bottom floor (Introduction + 14 Chapters + Epilogue).
  - **The Mask Beneath** & **What the City Knows**: Interactive companion manuscripts and short-form pieces.
- **🎨 Interactive Custom Themes**: 
  - Switch seamlessly between **OLED Dark** (deep obsidian and crisp text), **Paper Light** (warm cream and soft charcoal), and **Terminal Green** (retro glow green on black).
- **💾 Reading Progress Persistence**: 
  - Automatically saves your reading configuration (selected book, active chapter, cover status, and exact scroll position) to `localStorage` so you can resume exactly where you left off.
- **🔮 The Oracle (AI Search)**: 
  - A client-side context-aware RAG search and exploration interface. Users can search terms like *"diapers"*, *"AI sandbox"*, or *"commute"*, and the Oracle will answer, citing the matching manuscripts dynamically.
- **📊 Vercel Analytics**: 
  - Live performance and telemetry tracking.
- **🔍 SEO Optimized**: 
  - Advanced dynamic tab title adjustments and openGraph metadata for high-fidelity sharing on Twitter (X).

---

## 🛠 Tech Stack

- **Core Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Mobile Packaging**: [Capacitor](https://capacitorjs.com) (configured for Android build exports to `/out`)
- **Telemetry & Traffic**: [@vercel/analytics](https://vercel.com/docs/analytics)
- **Styling**: Vanilla CSS (globals.css design systems) + Tailwind CSS utilities
- **Typography**: Google Fonts - Lora (Serif) & Inter (Sans-Serif)
- **State & Sync**: HTML5 LocalStorage API for offline progress persistence
- **Deployment**: [Vercel](https://vercel.com/) (Next.js serverless architecture)

---

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/habibixyz/Absconded.git
   cd absconded
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Production Export & Build**:
   ```bash
   npm run build
   ```
   *Note: Next.js is configured for static exports (`output: 'export'`), producing files in the `/out` directory suitable for both Capacitor Android builds and static hosting.*

---

## 📂 Project Structure

- `app/page.jsx`: Core interface, shelf layout, theme switcher, progress persistence hooks, and the Oracle interface.
- `app/layout.jsx`: Root layout, `@vercel/analytics` integration, and global SEO metadata.
- `app/globals.css`: Customized theme variable systems and Tailwind utility overrides.
- `app/data.js`: Central content database — 15 stories, 130+ chapters, 300,000+ words of original fiction and memoir.
- `app/data/manuscripts.js`: Local fallback database for offline reading.
- `public/`: Static cover images, icons, and sitemap configuration.

---

**Published by Tanvir Khan**  
Mumbai / Twenty-Twenty-Six  
[GitHub](https://github.com/habibixyz/Absconded) | [Twitter](https://x.com/ritmir11)
