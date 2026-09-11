# ABSCONDED // VYRM Scriptorium

> "Disappearing is easy. Becoming is the hard part."

This is not a blog. It is not a portfolio. It is a record of someone mid-becoming — original digital manuscripts and literature designed for high-fidelity, distraction-free OLED reading.

**ABSCONDED** is a next-generation web manuscript reader and literature archive authored and engineered by **Tanvir Khan**.

---

## 📖 Key Features

### 📚 The Signal Collection & Manuscripts Shelf
- **Absconded**: A meditation on the internet, ambition, and the process of becoming (*Prologue + 10 Chapters + Epilogue*).
- **Tethered**: An intimate chronicle of a builder absconding from corporate stability, balancing Web3 trading, AI prompts, fatherhood, and a grueling 4-hour commute (*Prologue + 10 Chapters + Epilogue*).
- **The Signal and the Stairs**: Notes on building yourself back from the bottom floor (*Introduction + 14 Chapters + Epilogue*).
- **Silent Protocol - A Meridian House Thriller**: High-stakes narrative tracking digital surveillance, micro-signals, and corporate intrigue.
- **The Room Between Lives**: Complete 4-part novel with dedicated multi-book filtering.
- **The Mask Beneath & What the City Knows**: Interactive companion pieces and short-form manuscripts.

### 🌐 Universal Reader & Public Domain Classics
- **70,000+ Classics Catalog**: Instant 0ms real-time search across philosophy, sci-fi, strategy, and world literature.
- **Client-Side Transcoder & Importer**: Drop any local `.epub`, `.md`, or `.txt` file for private on-device parsing and instant distraction-free reading.

### 🔗 Deep-Linking & Native Web Sharing
- **Direct Chapter & Book Deep Links**: Real-time URL query parameter synchronization (`?book=<id>&chapter=<id>`).
- **Web Share API (`navigator.share`)**: Seamless native share sheet support on iOS, Android, macOS, and Chrome with automatic clipboard fallback on desktop.
- **Passage & Quote Tooling**: Highlight any text to look up definitions (`Define`), copy formatted citations (`Quote`), or share excerpt snippets directly.

### 🎧 Reader HUD & Audio Studio Narration
- **Audible-Grade Studio Voice**: Integrated narration engine with natural literary cadence, pause handling, and adjustable playback speeds (0.85x – 1.5x).
- **Ambient Focus Generator**: Built-in Web Audio API synthesizers for rain and deep focus hum.
- **Bionic Reading Mode**: Optional fixation bolds for rapid comprehension.
- **Custom Typography Engine**: Granular control over font sizing, typefaces (Serif, Sans, Mono), and line spacing.
- **Dynamic Reading Timers**: Live chapter scroll progress percentage and dynamic remaining read-time estimations.

### 🔖 Bookmarks & Reading Progress Persistence
- **Offline Progress Recovery**: Automatic state recovery for active books, chapters, and scroll positions across sessions.
- **Interactive Bookmarks Drawer**: Save multiple reading positions with snippet previews and timestamps.

### 🔮 The Signal Oracle (AI / Neural Query Interface)
- Client-side context-aware TF-IDF BM25 semantic retrieval across the entire 300,000+ word manuscript library.
- Synthesizes intelligent answers with clickable source citations back to exact passages.

### 📱 Android Native Architecture (Capacitor)
- Native Android app configuration with automated GitHub Actions cloud APK builds, lifecycle integration, safe-area inset adjustments, and direct download modal.

---

## 🛠 Tech Stack

- **Core Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Audio & Media**: Web Audio API ambient synthesis + Edge TTS Narration API
- **Mobile Packaging**: [Capacitor 8](https://capacitorjs.com) (Android native bridge)
- **Styling**: Vanilla CSS design systems (`globals.css`) + Tailwind CSS utilities
- **Typography**: Lora, Outfit, Inter & JetBrains Mono via Google Fonts
- **Telemetry & Traffic**: [@vercel/analytics](https://vercel.com/docs/analytics)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/habibixyz/Absconded.git
cd absconded
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Export
```bash
npm run build
```

---

## 📂 Project Structure

```
├── app/
│   ├── api/             # TTS, transcoder, and reader stats routes
│   ├── components/      # ReaderHUD, Transcoder, BookmarksDrawer, etc.
│   ├── data/            # Local manuscript fallback datasets
│   ├── data.js          # Central manuscript repository (130+ chapters)
│   ├── globals.css      # Core OLED design tokens and typography rules
│   ├── layout.jsx       # Root layout, analytics, and metadata
│   └── page.jsx         # Application shell, routing, state, and reader
├── android/             # Capacitor Android native project & gradle setup
├── public/              # Static assets, book covers, icons, manifests
├── scripts/             # PDF, Word docx, and asset generation toolchain
└── capacitor.config.json # Mobile runtime configuration
```

---

**Published by Tanvir Khan**  
Mumbai · Twenty-Twenty-Six  
[Website](https://vyrm.space) · [GitHub](https://github.com/habibixyz/Absconded) · [Twitter (X)](https://x.com/ritmir11)
