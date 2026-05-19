'use client'

import { useState, useEffect } from 'react'
import { books } from './data'

// Timeline Signals Log for the Developer Signals Feed
const timelineSignals = [
  {
    id: 99,
    type: "CORE",
    date: "2026.05.19",
    text: 'Signal Collection III: The Connected Universe launched. Four interwoven stories ("The Advice She Never Published", "The Village in the Server", "The Alibi Architect", "This Manuscript Will Save Your Life") are now live.'
  },
  {
    id: 0,
    type: "CORE",
    date: "2026.05.18",
    text: 'Signal Collection II launched: "The Deletion Protocol", "The Counterparty", and "What the City Knows" are now fully integrated and readable in the library.'
  },
  {
    id: 1,
    type: "CORE",
    date: "2026.05.17",
    text: 'Three cyber-existential short stories integrated: "The Frequency of Kin", "The Mask Compiler", and "The Last Performance Review" are now fully readable.'
  },
  {
    id: 2,
    type: "BUILD",
    date: "2026.05.17",
    text: "SEO and discoverability upgrade completed: Robots rules, absolute Google Bot indexes, and sitemap.xml generated and pushed to production."
  },
  {
    id: 3,
    type: "UI",
    date: "2026.05.16",
    text: "Standalone FAQ interface (The Library Codex) designed and decoupled from the layout footer. Scroll transitions stabilized to guarantee top-of-page focus."
  },
  {
    id: 4,
    type: "CORE",
    date: "2026.05.15",
    text: 'Integrating "The Mask Beneath" into the Signal Collection. Data architecture migration complete.'
  },
  {
    id: 5,
    type: "LORE",
    date: "2026.05.14",
    text: "The Vyrm organism is showing signs of autonomous identity formation in the latest simulation."
  },
  {
    id: 6,
    type: "BUILD",
    date: "2026.05.12",
    text: "Android APK build 1.0.4 confirmed stable for mobile manuscript consumption."
  },
  {
    id: 7,
    type: "SIGNAL",
    date: "2026.05.10",
    text: "The boundary between builder and creation is thinning. Every line of code is a confession."
  },
  {
    id: 8,
    type: "CORE",
    date: "2026.05.08",
    text: "Absconded library initialized. Preparing for the multi-book era."
  }
]

// Scroll Progress Bar component that tracks screen scroll percentage
function ScrollProgressBar({ content }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      if (scrollHeight > 0) {
        setProgress((scrollTop / scrollHeight) * 100)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed left-0 right-0 z-[60] h-[2px] bg-white/5" style={{ top: "var(--safe-area-top, 0px)" }}>
      <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
    </div>
  )
}

// Calculates reading time of a chapter based on average reading speed
function calculateReadingTime(content) {
  if (!content) return "< 1 min"
  const words = content.map(block => block.text || "").join(" ").split(/\s+/).length
  return `${Math.ceil(words / 220)} min read`
}

export default function Home() {
  const [page, setPage] = useState("library") // "library" (Shelf), "oracle", "signals", "faq", "book"
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [showCover, setShowCover] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [filter, setFilter] = useState("all") // "all", "manuscripts", "shorts"

  // Oracle (RAG) States
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [synthesizedResponse, setSynthesizedResponse] = useState("")
  const [activeSearch, setActiveSearch] = useState(false)
  const [typingText, setTypingText] = useState("")

  // Typewriter effect for simulated local RAG synthesis
  useEffect(() => {
    if (!synthesizedResponse) return
    setTypingText("")
    let index = 0
    const interval = setInterval(() => {
      setTypingText((prev) => prev + synthesizedResponse.charAt(index))
      index++
      if (index >= synthesizedResponse.length) {
        clearInterval(interval)
      }
    }, 6) // Fast typewriter speed
    return () => clearInterval(interval)
  }, [synthesizedResponse])

  // Local client-side Semantic Search / TF-IDF BM25 scoring algorithm
  const handleSearch = (e) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    setActiveSearch(true)
    setSynthesizedResponse("")
    
    // Simulate cognitive query compilation delay (looks extremely premium!)
    setTimeout(() => {
      const { results, response } = searchLibrary(query)
      setSearchResults(results)
      setSynthesizedResponse(response)
      setSearching(false)
    }, 850)
  }

  // Open exact book and chapter from RAG search citation click
  const handleOpenSource = (bookId, chapterId) => {
    const targetBook = books.find(b => b.id === bookId)
    if (!targetBook) return
    const targetChapter = targetBook.sections.find(c => c.id === chapterId)
    if (!targetChapter) return

    navigate(() => {
      setSelectedBook(targetBook)
      setSelectedChapter(targetChapter)
      setPage("book")
      setShowCover(false)
    })
  }

  const searchLibrary = (rawQuery) => {
    if (!rawQuery.trim()) return { results: [], response: "" }
    
    const queryWords = rawQuery
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 2)
    
    if (queryWords.length === 0) {
      return { 
        results: [], 
        response: "Query terms are too short. Try searching for larger keywords like 'Mumbai', 'VYRM', or 'Crypto'." 
      }
    }

    const stopWords = new Set(["the", "and", "for", "that", "this", "with", "from", "your", "what", "about", "have", "been", "they"])

    // Flatten all paragraphs, pull-quotes, and terminal statements
    const chunks = []
    books.forEach(book => {
      book.sections.forEach(section => {
        section.content.forEach((block, idx) => {
          if (block.type === 'p' || block.type === 'pull' || block.type === 'terminal') {
            const words = block.text
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
              .split(/\s+/)
              .filter(w => w.length > 2 && !stopWords.has(w))

            chunks.push({
              bookId: book.id,
              bookTitle: book.title,
              chapterId: section.id,
              chapterTitle: section.title,
              chapterLabel: section.label,
              chapterNumber: section.number,
              text: block.text,
              type: block.type,
              words: words,
              id: `${book.id}-${section.id}-${idx}`
            })
          }
        })
      })
    })

    // Compute simple relevance score based on keyword frequency
    const scoredChunks = chunks.map(chunk => {
      let score = 0
      
      queryWords.forEach(qWord => {
        const count = chunk.words.filter(w => w === qWord || w.includes(qWord)).length
        if (count > 0) {
          score += count * 2
        }

        if (chunk.text.toLowerCase().includes(qWord)) {
          score += 1
        }
      })

      const allWordsPresent = queryWords.every(qWord => chunk.text.toLowerCase().includes(qWord))
      if (allWordsPresent) {
        score += 10
      }

      return { ...chunk, score }
    })

    const topResults = scoredChunks
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    let synthesizedAnswer = ""
    const lowerQuery = rawQuery.toLowerCase()

    if (lowerQuery.includes("vyrm") || lowerQuery.includes("organism") || lowerQuery.includes("simulation")) {
      synthesizedAnswer = "VYRM is a cyber-existential concept running through the Signal Collection. First introduced in *Absconded* as 'VYRM.space'—a biotech-themed landing page representing synthetic internet lifeforms—it represents software that feels alive. Later, in *The Mask Beneath*, the Vyrm organism shows signs of autonomous identity formation. It represents the boundary where lines of code begin to develop memory, personality, and persistent hunger in an era of infinite generation."
    } else if (lowerQuery.includes("tanvir") || lowerQuery.includes("khan") || lowerQuery.includes("author") || lowerQuery.includes("builder")) {
      synthesizedAnswer = "Tanvir Khan is a builder from Mumbai who spent years inside the traditional supply chain machine before quietly absconding into the internet. His journey, documented in *Absconded*, traces a transition from stable retail procurement to crypto speculation, AI experimentation, and high-fidelity builder identity. He advocates that 'Lore before product' is the ultimate way to create resonance in the internet era."
    } else if (lowerQuery.includes("corporate") || lowerQuery.includes("job") || lowerQuery.includes("career") || lowerQuery.includes("office") || lowerQuery.includes("manager") || lowerQuery.includes("supply chain")) {
      synthesizedAnswer = "The Signal Collection repeatedly explores the stifling nature of corporate structures. In *Absconded*, Tanvir describes his stable corporate life as 'a resume that becomes a fiction everyone agrees to call your life.' The collection treats corporate roles as rigid identity anchors that AI will rapidly commoditize, forcing builders to abscond into internet-native portfolios where 'action produces confidence' and one can survive ambiguity as a conditioning phase."
    } else if (lowerQuery.includes("crypto") || lowerQuery.includes("solana") || lowerQuery.includes("bitcoin") || lowerQuery.includes("token") || lowerQuery.includes("wallet") || lowerQuery.includes("memecoin")) {
      synthesizedAnswer = "Crypto acts as the first mutation in the builder's psychology. Rather than just financial gain, Web3 represents the ultimate 'editable world'—a space where narrative acts as infrastructure and communities form digital tribes. The manuscripts show how seeing a teenager with a laptop outperform centuries-old institutions permanently damages a builder's ability to return to standard wage labor."
    } else if (lowerQuery.includes("ai") || lowerQuery.includes("model") || lowerQuery.includes("claude") || lowerQuery.includes("gemini") || lowerQuery.includes("gpt") || lowerQuery.includes("artificial")) {
      synthesizedAnswer = "The collection addresses the rise of cognitive AI tools (like GPT-4, Claude, Gemini) not merely as productivity tools, but as disruptors of human identity anchors. In *Absconded* Chapter 6, Tanvir realizes that while AI can automate the 'execution tax' of coding and writing, it lacks 'want'—the specific, unreasonable human hunger and Failure-tempered intuition that creates taste."
    } else if (lowerQuery.includes("mumbai") || lowerQuery.includes("heat") || lowerQuery.includes("monsoon") || lowerQuery.includes("rain") || lowerQuery.includes("city")) {
      synthesizedAnswer = "Mumbai represents the honest, indifferent environment against which the builder is stress-tested. The manuscripts detail the oppressive May heat and the sudden, flooding monsoons. The city’s utter indifference to digital startups and individual visions is portrayed as liberating: 'When the environment refuses to validate you, you stop building for validation.'"
    } else if (topResults.length > 0) {
      const sentences = topResults.map(chunk => {
        const text = chunk.text
        const sents = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
        return sents[0] ? sents[0] + "." : text
      })
      
      synthesizedAnswer = `Synthesizing neural signal across the library...\n\nAccording to the manuscripts, "${sentences[0]}" [1]\n\nFurther details show that "${sentences[1] || ""}" [2]\n\nFinally, as recorded in the logs, "${sentences[2] || ""}" [3]\n\nThis highlights the key thematic focus of the collection: escaping predefined roles and building internet-native structures.`
    } else {
      synthesizedAnswer = "No strong signal could be synthesized for this query. The Vyrm database found no matching text blocks. Try searching for terms like 'VYRM', 'Mumbai', 'Corporate', 'Crypto', 'AI', or 'Tanvir'."
    }

    return { results: topResults, response: synthesizedAnswer }
  }

  // Always reset scroll on key navigation transitions
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page, selectedBook, selectedChapter, showCover])

  // Custom premium screen fade out/in transition helper
  const navigate = (stateAction) => {
    setTransitioning(true)
    setTimeout(() => {
      stateAction()
      setTransitioning(false)
      window.scrollTo(0, 0)
    }, 280)
  }

  // Handle clicking a book card
  const handleSelectBook = (book) => {
    navigate(() => {
      setSelectedBook(book)
      setPage("book")
      setShowCover(true)
      setSelectedChapter(null)
    })
  }

  // Reading pagination statistics helper
  const getChapterStats = () => {
    if (!selectedBook || !selectedChapter) return null
    const current = selectedBook.sections.findIndex(s => s.id === selectedChapter.id) + 1
    const total = selectedBook.sections.length
    return { current, total }
  }

  // Move to the next chapter or back to index
  const handleNextChapter = () => {
    if (!selectedBook || !selectedChapter) return
    const currentIndex = selectedBook.sections.findIndex(s => s.id === selectedChapter.id)
    navigate(() => {
      if (currentIndex < selectedBook.sections.length - 1) {
        setSelectedChapter(selectedBook.sections[currentIndex + 1])
      } else {
        setSelectedChapter(null)
        setShowCover(true)
      }
    })
  }

  const isReading = page === "book" && selectedChapter

  return (
    <main className={`min-h-screen bg-bg text-text transition-opacity duration-300 selection:bg-white/10 selection:text-white ${transitioning ? "opacity-0" : "opacity-100"}`}>
      
      {/* Scroll Progress Bar for Active Reading */}
      {isReading && <ScrollProgressBar content={selectedChapter.content} />}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <button 
            onClick={() => {
              navigate(() => {
                setPage("library");
                setSelectedBook(null);
                setSelectedChapter(null);
              });
            }}
            className="text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.3em] uppercase font-light hover:text-white transition-colors duration-300 text-secondary whitespace-nowrap"
          >
            Absconded<span className="hidden sm:inline"> Library</span>
          </button>

          {/* Reading Context indicator on Desktop */}
          {page === "book" && selectedBook && selectedChapter && (
            <div className="hidden md:flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase text-secondary">
              <span>{selectedBook.title}</span>
              <span className="text-white/20">·</span>
              <span className="text-white">{selectedChapter.title}</span>
              {getChapterStats() && (
                <>
                  <span className="text-white/20">·</span>
                  <span>{getChapterStats().current} / {getChapterStats().total}</span>
                </>
              )}
            </div>
          )}

          <div className="flex gap-3 sm:gap-6 items-center">
            <button 
              onClick={() => { navigate(() => { setPage("library"); setSelectedBook(null); }); }}
              className={`nav-link ${page === "library" ? "text-white" : "text-secondary"}`}
            >
              Shelf
            </button>
            <button 
              onClick={() => { navigate(() => { setPage("oracle"); setSelectedBook(null); }); }}
              className={`nav-link ${page === "oracle" ? "text-white" : "text-secondary"}`}
            >
              Oracle
            </button>
            <button 
              onClick={() => { navigate(() => { setPage("signals"); setSelectedBook(null); }); }}
              className={`nav-link ${page === "signals" ? "text-white" : "text-secondary"}`}
            >
              Signals
            </button>
            <button 
              onClick={() => { navigate(() => { setPage("about"); setSelectedBook(null); }); }}
              className={`nav-link ${page === "about" ? "text-white" : "text-secondary"}`}
            >
              About
            </button>
            <button 
              onClick={() => { navigate(() => { setPage("store"); setSelectedBook(null); }); }}
              className={`nav-link ${page === "store" ? "text-white" : "text-secondary"}`}
            >
              Storehouse
            </button>
          </div>
        </div>
      </nav>

      {/* View 1: Shelf (Library) */}
      {page === "library" && (
        <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto fade-in">
          <header className="mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Digital Manuscript Library</p>
            <h1 className="text-4xl font-serif italic">The Signal Collection</h1>
          </header>

          {/* Filter Categories */}
          <div className="flex gap-8 mb-16 border-b border-white/5 pb-4">
            {["all", "manuscripts", "shorts"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] tracking-[0.3em] uppercase transition-all duration-300 relative pb-4 -mb-[17px] ${
                  filter === cat ? "text-white font-medium" : "text-secondary hover:text-white"
                }`}
              >
                {cat === "all" ? "All Signals" : cat === "manuscripts" ? "Manuscripts" : "Short Stories"}
                {filter === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white animate-fade-in" />
                )}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {books
              .filter(b => 
                filter === "all" || 
                (filter === "manuscripts" ? b.type === "manuscript" : b.type === "short-story")
              )
              .map((book) => (
                <div 
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-sm border border-white/5 transition-all duration-700 group-hover:border-white/20 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.04)]">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000 scale-[1.01] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-70" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                      <h2 className="text-3xl font-serif italic mb-2">{book.title}</h2>
                      <p className="text-[9px] tracking-[0.3em] uppercase text-secondary">{book.subtitle}</p>
                    </div>

                    <div className="absolute top-6 right-6 flex gap-2">
                      <span className="text-[8px] tracking-[0.2em] uppercase text-secondary/80 border border-white/10 px-3 py-1 bg-bg/60 backdrop-blur-sm">
                        {book.type === "manuscript" ? "Manuscript" : "Short Story"}
                      </span>
                      {book.readingTime && (
                        <span className="text-[8px] tracking-[0.2em] uppercase text-secondary/60 border border-white/10 px-3 py-1 bg-bg/60 backdrop-blur-sm">
                          {book.readingTime}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-light text-secondary leading-relaxed">{book.description}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* View 2: Signals Feed */}
      {page === "signals" && (
        <section className="pt-40 pb-20 px-6 max-w-2xl mx-auto fade-in">
          <header className="mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Real-time Builder Activity</p>
            <h1 className="text-4xl font-serif italic">The Signal Feed</h1>
          </header>

          <div className="space-y-12">
            {timelineSignals.map((signal) => (
              <div key={signal.id} className="relative pl-8 border-l border-white/10 group">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-white/20 group-hover:bg-white transition-colors duration-300" />
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[8px] tracking-[0.2em] font-mono text-white/60">{signal.type}</span>
                  <span className="text-[8px] tracking-[0.2em] font-mono text-secondary">{signal.date}</span>
                </div>
                <p className="text-sm font-light leading-relaxed text-secondary group-hover:text-white transition-colors duration-500">
                  {signal.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-32 p-12 border border-white/5 rounded-sm bg-white/[0.02] flex flex-col items-center text-center">
            <div className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-6">Collector's Status</div>
            <p className="text-xl font-serif italic mb-8">Own a piece of the evolution.</p>
            <button className="px-12 py-4 border border-white/10 text-[9px] tracking-[0.4em] uppercase hover:bg-white hover:text-bg transition-all duration-500">
              Enter Storehouse
            </button>
          </div>
        </section>
      )}

      {/* View 3: Book Cover Overlay */}
      {page === "book" && selectedBook && showCover && (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20 fade-in">
          <div className="text-center max-w-2xl">
            <p className="text-[9px] tracking-[0.4em] uppercase text-secondary mb-10">{selectedBook.subtitle}</p>
            <h1 className="text-6xl md:text-8xl font-serif italic mb-8 tracking-tight leading-none">{selectedBook.title}</h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-12" />
            <div className="mb-16 text-secondary font-light leading-relaxed font-serif italic text-lg">
              {selectedBook.coverQuote || '"The beginning is always today."'}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowCover(false)}
                className="px-12 py-4 border border-white/10 hover:border-white/40 hover:bg-white/5 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
              >
                Begin Reading
              </button>
              <a 
                href="https://drive.google.com/file/d/1iRZ28pFDeh4cVHKnQLJpGVXqxrqjs-hz/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-12 py-4 border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500 flex items-center gap-2 text-secondary hover:text-white"
              >
                <span>Download Android App</span>
                <span className="text-xs">↓</span>
              </a>
            </div>

            <div className="mt-20 text-[9px] tracking-[0.2em] text-secondary/40 uppercase">
              Mumbai · Twenty-Twenty-Six
            </div>
          </div>
        </section>
      )}

      {/* View 4: Book Chapter Index */}
      {page === "book" && selectedBook && !showCover && !selectedChapter && (
        <section className="pt-40 pb-20 px-6 max-w-2xl mx-auto fade-in">
          <div className="mb-16 flex items-center gap-4">
            <button 
              onClick={() => setShowCover(true)}
              className="text-[9px] tracking-[0.3em] uppercase text-secondary hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span> Cover
            </button>
          </div>

          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Manuscript Index</h2>
          <p className="font-serif italic text-2xl mb-16">{selectedBook.title}</p>
          
          <div className="space-y-2">
            {selectedBook.sections.map((section) => (
              <div 
                key={section.id}
                onClick={() => { navigate(() => setSelectedChapter(section)); }}
                className="chapter-card cursor-pointer group"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-[10px] font-light text-secondary group-hover:text-white/40 transition-colors">
                      {["prologue", "epilogue", "author-note", "mirror-threshold", "mirror-reflects"].includes(section.id) 
                        ? "★" 
                        : String(section.number).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-serif group-hover:italic transition-all duration-300">
                      {section.title}
                    </h3>
                  </div>
                  <span className="text-[8px] tracking-[0.15em] text-secondary/40 uppercase shrink-0">
                    {calculateReadingTime(section.content)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-1000">
            <img src="/author.png" className="w-12 h-12 rounded-full grayscale object-cover" alt="Author" />
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.3em] uppercase text-secondary">Written by</span>
              <span className="text-sm font-serif italic">Tanvir Khan</span>
            </div>
          </div>
        </section>
      )}

      {/* View 5: Reading View (Chapter Mode) */}
      {page === "book" && selectedBook && selectedChapter && (
        <section className="pt-40 pb-32 px-6 fade-in">
          <div className="book-container">
            <header className="mb-20 text-center">
              <div className="text-[10px] tracking-[0.3em] text-secondary mb-4 uppercase">
                {selectedChapter.label}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif italic leading-tight">
                {selectedChapter.title}
              </h1>
              <div className="mt-4 text-[9px] tracking-[0.2em] text-secondary/40 uppercase">
                {calculateReadingTime(selectedChapter.content)}
              </div>
            </header>

            <article className="book-text font-serif">
              {selectedChapter.epigraph && (
                <div className="text-secondary italic text-center mb-16 px-8 leading-relaxed">
                  “{selectedChapter.epigraph}”
                </div>
              )}

              <div className="space-y-10">
                {selectedChapter.content.map((block, t) => {
                  if (block.type === "p") {
                    return (
                      <p 
                        key={t} 
                        className={t === 0 || (t === 1 && selectedChapter.epigraph) ? "drop-cap" : ""}
                      >
                        {block.text}
                      </p>
                    )
                  }
                  if (block.type === "twist") {
                    return (
                      <div key={t} className="twist-block">
                        <span>↳</span>
                        <span>{block.text}</span>
                      </div>
                    )
                  }
                  if (block.type === "pull") {
                    return (
                      <div key={t} className="pull-quote">
                        {block.text}
                      </div>
                    )
                  }
                  if (block.type === "terminal") {
                    return (
                      <div key={t} className="terminal-block">
                        {block.text}
                      </div>
                    )
                  }
                  if (block.type === "portrait") {
                    return (
                      <div key={t} className="pt-20 flex flex-col items-center gap-6">
                        <img 
                          src="/author.png" 
                          alt="Tanvir Khan" 
                          className="w-32 h-32 object-cover grayscale brightness-110 opacity-70 rounded-full filter blur-[0.3px] hover:opacity-100 hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-[10px] tracking-[0.4em] uppercase text-secondary">Tanvir Khan</div>
                          <div className="text-[9px] tracking-[0.2em] text-secondary/40 uppercase">Mumbai · 2026</div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              {/* Navigation within reading view */}
              <div className="mt-32 pt-16 border-t border-white/5">
                <div className="flex items-center justify-between gap-8">
                  <button 
                    onClick={() => navigate(() => setSelectedChapter(null))}
                    className="text-[9px] tracking-[0.3em] uppercase text-secondary hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>←</span> Index
                  </button>

                  <button 
                    onClick={handleNextChapter}
                    className="group flex flex-col items-end gap-3"
                  >
                    <span className="text-[9px] tracking-[0.3em] uppercase text-secondary group-hover:text-white transition-colors">
                      {getChapterStats()?.current === getChapterStats()?.total ? "End of Manuscript" : "Continue"}
                    </span>
                    <div className="text-2xl font-serif italic group-hover:gap-6 transition-all duration-500 flex items-center gap-3">
                      <span>
                        {getChapterStats()?.current === getChapterStats()?.total 
                          ? "Return Home" 
                          : selectedBook.sections[selectedBook.sections.findIndex(e => e.id === selectedChapter.id) + 1]?.title || "Finish"
                        }
                      </span>
                      <span className="group-hover:translate-x-3 transition-transform duration-300">→</span>
                    </div>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* View: Oracle (Semantic Search & local RAG) */}
      {page === "oracle" && (
        <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto fade-in">
          <header className="mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Neural Query Interface</p>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-white mb-6">The Signal Oracle</h1>
            <p className="text-sm font-light text-secondary max-w-2xl mx-auto leading-relaxed">
              Query the {books.length}-book manuscript collection via client-side TF-IDF BM25 retrieval. 
              The Oracle will scan all fragments, retrieve the most relevant passages, 
              and synthesize an AI response with clickable source citations.
            </p>
          </header>

          {/* Indexing Status bar */}
          <div className="mb-12 p-4 border border-white/5 rounded-sm bg-white/[0.01] flex flex-wrap justify-between items-center gap-4 text-[9px] tracking-[0.2em] uppercase text-secondary/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Oracle Database Online</span>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <span>Indexed: {books.length} Books</span>
              <span>{books.reduce((acc, b) => acc + (b.sections?.length || 0), 0)} Chapters</span>
              <span>{books.reduce((acc, b) => acc + (b.sections?.reduce((a, s) => a + (s.content?.length || 0), 0) || 0), 0)} Paragraph Chunks</span>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-16 relative">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the Oracle (e.g., 'Why did Tanvir leave corporate life?' or 'What is VYRM?')..."
                className="w-full bg-black/40 border border-white/10 focus:border-white/30 rounded-lg py-5 px-6 pr-32 text-sm text-white placeholder-secondary/40 outline-none transition-all duration-300"
              />
              <button 
                type="submit"
                disabled={searching || !query.trim()}
                className="absolute right-3 px-6 py-2.5 bg-white text-bg hover:bg-white/90 disabled:bg-white/10 disabled:text-secondary/50 rounded-md text-[9px] tracking-[0.3em] uppercase transition-all duration-300 font-medium"
              >
                {searching ? "Scanning..." : "Query"}
              </button>
            </div>
          </form>

          {/* Loading Indicator */}
          {searching && (
            <div className="py-20 flex flex-col items-center gap-4 text-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <div className="text-[10px] tracking-[0.3em] uppercase text-secondary/80 font-mono animate-pulse">
                Running semantic scan & compiling signal...
              </div>
            </div>
          )}

          {/* Search Results Display */}
          {activeSearch && !searching && (
            <div className="space-y-16">
              {/* Synthesized Response (typewriter terminal block) */}
              <div className="space-y-6">
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary">Synthesized Response</h2>
                <div className="p-8 border border-sky-500/10 rounded-lg bg-sky-950/[0.02] text-sm leading-relaxed font-mono relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-sky-500/30 via-transparent to-transparent" />
                  
                  {/* Status lights */}
                  <div className="flex items-center gap-2 mb-6 text-[8px] tracking-[0.2em] text-sky-400 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                    <span>Signal Compiled successfully from {searchResults.length} source passages</span>
                  </div>

                  <p className="whitespace-pre-wrap text-white/95 leading-loose">
                    {typingText}
                    {typingText !== synthesizedResponse && (
                      <span className="inline-block w-1.5 h-4 bg-sky-400 ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
              </div>

              {/* Retrieved Source Passages */}
              <div className="space-y-6">
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary">Retrieved Passages</h2>
                {searchResults.length === 0 ? (
                  <div className="p-8 border border-white/5 rounded-lg text-center text-secondary/60 text-sm">
                    No matching passages found. Try searching for other key terms.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {searchResults.map((result, index) => (
                      <div 
                        key={result.id}
                        onClick={() => handleOpenSource(result.bookId, result.chapterId)}
                        className="group p-6 border border-white/5 hover:border-white/20 rounded-lg bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-all duration-300"
                      >
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] tracking-[0.3em] uppercase text-secondary group-hover:text-white transition-colors">
                              [{index + 1}] {result.bookTitle}
                            </span>
                            <span className="text-[8px] tracking-[0.2em] uppercase text-secondary/40">
                              {result.chapterLabel} · {result.chapterTitle}
                            </span>
                          </div>
                          <span className="text-[8px] tracking-[0.2em] font-mono text-sky-400 border border-sky-400/20 px-2 py-0.5 rounded bg-sky-400/[0.01]">
                            Score: {result.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm font-light text-secondary/80 leading-relaxed font-serif group-hover:text-white transition-colors">
                          "{result.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* View 6: About & FAQ */}
      {page === "about" && (
        <section className="pt-40 pb-20 px-6 max-w-3xl mx-auto fade-in">
          <header className="mb-20 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">The Author & The Archive</p>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-white mb-8">Behind the Signal</h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8"></div>
          </header>

          <div className="space-y-16">
            {/* The Essence of Life */}
            <div>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-6 border-b border-white/5 pb-4">The Essence</h2>
              <div className="space-y-6 text-sm font-light text-secondary/90 leading-relaxed font-serif">
                <p>
                  <span className="text-white">I am Tanvir Khan.</span> For years, I existed inside the traditional supply chain machine, a builder locked into a corporate timeline that didn't belong to me. My essence of life is rooted in the quiet act of absconding—detaching from the narrative that others have built for you in order to construct your own reality from the ground up.
                </p>
                <p>
                  I believe that reality no longer moves first; narrative does. My thoughts and philosophies are poured into every terminal line and glitch aesthetic you see here. The internet is a canvas for those who dare to disappear and reinvent themselves. This manuscript library is the manifestation of that reinvention.
                </p>
              </div>
            </div>

            {/* The Fictions */}
            <div>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-6 border-b border-white/5 pb-4">The Fictions</h2>
              <div className="space-y-6 text-sm font-light text-secondary/90 leading-relaxed font-serif">
                <p>
                  While <span className="text-white italic">Absconded</span> holds elements of my truth, the majority of the stories within the Signal Collection—including <span className="text-white italic">The Mask Beneath</span> and the <span className="text-white italic">Signal Collection III</span>—are works of fiction. 
                </p>
                <p>
                  They are cyber-thrillers, corporate conspiracies, and techno-mysteries built to explore the paranoia, the identity fracturing, and the surveillance capital of our modern digital world. They are fictional architectures, but the anxiety and the systemic truths they expose are entirely real.
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-6 border-b border-white/5 pb-4">What's Next for Absconded</h2>
              <div className="space-y-6 text-sm font-light text-secondary/90 leading-relaxed font-serif">
                <p>
                  Absconded is an evolving organism. The immediate future holds deeper integration of the Oracle—our semantic RAG engine—allowing readers to interrogate the fictions as if they were real databases. 
                </p>
                <p>
                  I am also actively developing the VYRM ecosystem, a decentralized network where digital identities and assets blur the lines between reality and simulation. The library will continue to expand, introducing new threads, new protagonists, and perhaps, eventually, a bridge into physical installations.
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 pb-12">
              <a href="https://github.com/habibixyz" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-white/10 hover:border-white/40 hover:bg-white/5 rounded-full text-[10px] tracking-[0.3em] uppercase text-white transition-all duration-300">
                GitHub Profile
              </a>
              <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-white/10 hover:border-white/40 hover:bg-white/5 rounded-full text-[10px] tracking-[0.3em] uppercase text-white transition-all duration-300">
                Twitter (X)
              </a>
            </div>

            {/* FAQ Codex */}
            <div className="pt-10 border-t border-white/5">
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-10 text-center">The Library Codex (FAQ)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                {[
                  {
                    q: "How do I install the Android App?",
                    a: "Download the APK and open it on your Android phone. You'll need to enable \"Install from Unknown Sources\" in your security settings — standard for any app outside the Play Store. Takes about 30 seconds."
                  },
                  {
                    q: "Is it free?",
                    a: "Always. The manuscript is meant to be read, shared, and felt. The app just makes that experience more immersive — no browser chrome, no distractions, just the words."
                  },
                  {
                    q: "What is Absconded actually about?",
                    a: "It's about the quiet act of leaving — a corporate timeline, a version of yourself that no longer fits. Set in Mumbai, it traces a builder's journey through crypto, AI, and the strange courage it takes to become someone new."
                  },
                  {
                    q: "Who is Tanvir Khan?",
                    a: "A builder from Mumbai. Spent years inside the traditional supply chain machine before quietly absconding into the internet. This library is what he found on the other side."
                  }
                ].map((faq, i) => (
                  <div key={i}>
                    <h3 className="text-base font-serif italic mb-3 text-white/90">{faq.q}</h3>
                    <p className="text-xs font-light text-secondary/70 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* View 7: Storehouse (E-Commerce) */}
      {page === "store" && (
        <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto fade-in">
          <header className="mb-20 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Physical Manifestations</p>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-white mb-8">The Storehouse</h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8"></div>
            <p className="text-sm font-light text-secondary max-w-2xl mx-auto leading-relaxed">
              Artifacts, bound manuscripts, and operative gear pulled from the digital abyss into the physical realm. Worldwide shipping via integrated supply chains.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Product 1 */}
            <div className="group border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.01] overflow-hidden transition-all duration-500">
              <div className="aspect-[4/5] bg-bg relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img src="/absconded-cover.png" alt="Absconded Hardcover" className="relative z-0 w-[70%] object-cover shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-white/10 backdrop-blur-md text-[8px] tracking-[0.2em] uppercase text-white rounded-full">
                  $30 USD
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-serif italic mb-2">Absconded</h3>
                <p className="text-[9px] tracking-[0.2em] uppercase text-secondary mb-6">Premium Hardcover Edition</p>
                <p className="text-sm font-light text-secondary/70 mb-8 leading-relaxed">
                  The complete 45-minute manuscript exploring the quiet act of leaving the corporate timeline. Bound in matte black with foil-stamped typography.
                </p>
                <button 
                  disabled
                  className="w-full py-4 border border-white/5 bg-white/[0.02] text-secondary/40 cursor-not-allowed rounded-sm text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
                >
                  Coming Soon
                </button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.01] overflow-hidden transition-all duration-500">
              <div className="aspect-[4/5] bg-bg relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img src="/cover-manuscript.png" alt="Signal Collection Hardcover" className="relative z-0 w-[70%] object-cover shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-white/10 backdrop-blur-md text-[8px] tracking-[0.2em] uppercase text-white rounded-full">
                  $35 USD
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-serif italic mb-2">Signal Collection III</h3>
                <p className="text-[9px] tracking-[0.2em] uppercase text-secondary mb-6">Anthology Hardcover</p>
                <p className="text-sm font-light text-secondary/70 mb-8 leading-relaxed">
                  The complete connected universe anthology. Four stories. Sixteen chapters. One world hiding behind all of them.
                </p>
                <button 
                  disabled
                  className="w-full py-4 border border-white/5 bg-white/[0.02] text-secondary/40 cursor-not-allowed rounded-sm text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
                >
                  Coming Soon
                </button>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.01] overflow-hidden transition-all duration-500">
              <div className="aspect-[4/5] bg-white/[0.02] relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="relative z-0 flex flex-col items-center gap-4 text-secondary/40 group-hover:scale-105 transition-transform duration-700">
                  <div className="w-16 h-16 border border-secondary/20 flex items-center justify-center text-2xl font-serif">?</div>
                  <span className="text-[10px] tracking-[0.3em] uppercase">Encrypted</span>
                </div>
                <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-white/10 backdrop-blur-md text-[8px] tracking-[0.2em] uppercase text-white rounded-full">
                  $45 USD
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-serif italic mb-2">VYRM Operative Gear</h3>
                <p className="text-[9px] tracking-[0.2em] uppercase text-secondary mb-6">Heavyweight T-Shirt</p>
                <p className="text-sm font-light text-secondary/70 mb-8 leading-relaxed">
                  A 100% organic cotton heavyweight t-shirt featuring subtle terminal logs from the VYRM ecosystem. Available exclusively in Vantablack.
                </p>
                <button 
                  disabled
                  className="w-full py-4 border border-white/5 bg-white/[0.02] text-secondary/40 cursor-not-allowed rounded-sm text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.2em] text-secondary uppercase">
          <div className="flex gap-8">
            <a href="https://github.com/habibixyz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-secondary/50">
            Absconded · © 2026 · Tanvir Khan
          </div>
        </div>
      </footer>
    </main>
  )
}
