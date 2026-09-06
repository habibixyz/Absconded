'use client'

import { useState, useEffect } from 'react'
import { books } from './data'
import Transcoder from './components/Transcoder'
import BookmarksDrawer from './components/BookmarksDrawer'

// Timeline Signals Log for the Developer Signals Feed
const timelineSignals = [
  {
    id: 109,
    type: "CORE",
    date: "2026.09.01",
    text: 'The Universal Reader is live: Explore 70,000+ open-source public domain classics or drop your own EPUB / Markdown files to read in pure OLED minimalism.'
  },
  {
    id: 108,
    type: "FEATURE",
    date: "2026.09.01",
    text: 'Client-Side Private Book Importer & 50+ Foundational Classics catalog deployed with instant 0ms real-time search across philosophy, sci-fi, strategy, and literature.'
  },
  {
    id: 107,
    type: "CORE",
    date: "2026.08.27",
    text: 'Signal Collection VIII: "The Room Between Lives - A Novel in Four Books" launched. The complete narrative manuscript (Books 1, 2, 3), minimalist cover art, parts filtering, and semantic RAG search queries are now fully live.'
  },
  {
    id: 106,
    type: "UI",
    date: "2026.08.27",
    text: "Added multi-book part filtering and summary cards to the manuscript index view. Users can now navigate the 4 distinct books within 'The Room Between Lives'."
  },
  {
    id: 105,
    type: "CORE",
    date: "2026.08.23",
    text: 'Signal Collection VII: "Silent Protocol - A Meridian House Thriller" launched. The complete narrative manuscript, custom cover art, and reading interface are now fully live.'
  },
  {
    id: 104,
    type: "UI",
    date: "2026.08.23",
    text: 'Redesigned site navigation header into a global responsive fullscreen hamburger overlay for mobile, tablet, and desktop viewports.'
  },
  {
    id: 103,
    type: "UI",
    date: "2026.08.22",
    text: 'Added Solana tip box (Buy Me a Coffee) to the "Behind the Signal" section using address B1GuATf6HZKnv34syU77pqLuRocjLq7rYFLZYnoGQTkS.'
  },
  {
    id: 102,
    type: "CORE",
    date: "2026.08.21",
    text: 'Signal Collection VI: "The Signal and the Stairs: Notes on Building Yourself Back From the Bottom Floor" launched. The complete narrative manuscript, custom cover art, and reading interface are now fully live.'
  },
  {
    id: 101,
    type: "CORE",
    date: "2026.08.18",
    text: 'Signal Collection V: "THE TRENCHES: A Builder\'s Guide to Memecoin Survival" launched. The complete narrative manuscript, custom dark cover art, and semantic RAG search engine are now fully live.'
  },
  {
    id: 100,
    type: "CORE",
    date: "2026.08.18",
    text: 'Signal Collection IV: "Tethered: Ambition\'s Anchor" launched. The intimate, long-form manuscript detailing the builder\'s journey, AI sandbox grind, and the physical reality of a 4-hour commute is now live on the shelf.'
  },
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
    text: "The simulated organism is showing signs of autonomous identity formation in the latest simulation."
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

const storeProducts = [
  {
    id: "absconded-chapbook",
    title: "Absconded",
    subtitle: "Premium Softcover Zine",
    description: "The complete 45-minute manuscript exploring the transition from stable retail procurement to internet-native builder identity. Perfect-bound in matte black with white terminal logs.",
    priceUsd: 12,
    priceInr: 999,
    coverImage: "/absconded-cover.png",
    editionSize: 150,
    paymentLink: "https://rzp.io/rzp/o6sgTed"
  },
  {
    id: "mask-beneath-chapbook",
    title: "The Mask Beneath",
    subtitle: "Premium Softcover Zine",
    description: "A corporate thriller exploring identity, success, and the masks we wear in a high-stakes digital world. Bound in textured softcover with algorithmic overlays.",
    priceUsd: 12,
    priceInr: 999,
    coverImage: "/mask-cover.png",
    editionSize: 150,
    paymentLink: "https://rzp.io/rzp/NKSvTO4y"
  },
  {
    id: "room-between-lives-chapbook",
    title: "The Room Between Lives",
    subtitle: "Premium Softcover Zine (Vol 1 & 2)",
    description: "Features Book One (The Chambermaid's Door) and Book Two (The Chemist's Door). Bound in thick cream linen cardstock with minimalist debossed outlines.",
    priceUsd: 15,
    priceInr: 1299,
    coverImage: "/room-between-lives-cover.png",
    editionSize: 100,
    paymentLink: "https://rzp.io/rzp/U9brK0r"
  },
  {
    id: "silent-protocol-chapbook",
    title: "Silent Protocol",
    subtitle: "Premium Softcover Zine",
    description: "The Meridian House tech-thriller. A physical manifestation of algorithmic guilt, digital surveillance, and corporate complicity. Matte black cover with neon-green terminal logs.",
    priceUsd: 15,
    priceInr: 1299,
    coverImage: "/silent-protocol-cover.png",
    editionSize: 120,
    paymentLink: "https://rzp.io/rzp/6dJsUF7G"
  },
  {
    id: "signal-stairs-chapbook",
    title: "The Signal and the Stairs",
    subtitle: "Premium Softcover Zine",
    description: "A collection of cyber-existential notes on rebuilding yourself from the bottom floor of the internet. Perfect bound, charcoal grey card cover.",
    priceUsd: 12,
    priceInr: 999,
    coverImage: "/signal-stairs-cover.png",
    editionSize: 150,
    paymentLink: "https://rzp.io/rzp/aRZHz4"
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
    <div className="fixed left-0 right-0 z-[65] h-[2px] bg-white/5" style={{ top: "calc(var(--safe-area-top, 0px) + env(safe-area-inset-top, 0px))" }}>
      <div className="h-full bg-white transition-all duration-100 shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ width: `${progress}%` }} />
    </div>
  )
}

// Calculates reading time of a chapter based on average reading speed
function calculateReadingTime(content) {
  if (!content) return "< 1 min"
  const words = content.map(block => block.text || "").join(" ").split(/\s+/).filter(Boolean).length
  return `${Math.ceil(words / 220)} min read`
}

function calculateBookReadingTime(book) {
  if (!book || !book.sections) return "0 min"
  let totalWords = 0
  book.sections.forEach(section => {
    if (section.content) {
      totalWords += section.content.map(block => block.text || "").join(" ").split(/\s+/).filter(Boolean).length
    }
  })
  const minutes = Math.ceil(totalWords / 220)
  return `${minutes} min`
}

export default function Home() {
  const [page, setPage] = useState("library") // "library" (Shelf), "oracle", "signals", "faq", "book"
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [showCover, setShowCover] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [filter, setFilter] = useState("all") // "all", "manuscripts", "shorts"
  const [theme, setTheme] = useState("oled")
  const [isRestoring, setIsRestoring] = useState(true)
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookStats, setBookStats] = useState({})
  const [activePart, setActivePart] = useState("book-1")
  const [checkoutProduct, setCheckoutProduct] = useState(null)
  const [shippingInfo, setShippingInfo] = useState({ name: "", email: "", address: "", city: "", state: "", zip: "", country: "IN" })
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [customKeys, setCustomKeys] = useState({ razorpayKey: "", dodoKey: "" })
  const [securedOrders, setSecuredOrders] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [bookmarksOpen, setBookmarksOpen] = useState(false)
  const [bookmarkToast, setBookmarkToast] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Track scroll position for instant Back to Top button (only show outside reader)
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop
      // Only show the scroll-to-top button when not inside a chapter reading view
      const isInsideReader = page === "book" && selectedChapter
      setShowScrollTop(!isInsideReader && scrolled > 280)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [page, selectedChapter])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  // Load bookmarks on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("absconded-bookmarks")
      if (stored) {
        setBookmarks(JSON.parse(stored))
      }
    } catch (e) {
      console.warn("Failed to load bookmarks", e)
    }
  }, [])

  // Fetch book reader stats
  useEffect(() => {
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error("API not available");
        return res.json();
      })
      .then(data => {
        if (data && data.stats) {
          setBookStats(data.stats)
        }
      })
      .catch(err => console.log("Stats API bypassed (running locally/mobile):", err.message))
  }, [])


  // Initialize and persist theme
  useEffect(() => {
    const saved = localStorage.getItem("absconded-theme")
    const resolved = saved === "terminal" ? "terminal" : "oled"
    setTheme(resolved)
    document.documentElement.setAttribute("data-theme", resolved)
  }, [])

  // Disable body scroll when menu or checkout is open
  useEffect(() => {
    if (menuOpen || checkoutProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, checkoutProduct])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    // Only persist dark themes - light is session-only, resets on refresh
    const toStore = newTheme === "terminal" ? "terminal" : "oled"
    localStorage.setItem("absconded-theme", toStore)
  }

  // Dynamically update document title for SEO & UX browser tabs
  useEffect(() => {
    if (page === "book" && selectedBook) {
      if (selectedChapter) {
        document.title = `${selectedChapter.title} | ${selectedBook.title} - A Digital Manuscript by Tanvir Khan`
      } else {
        document.title = `${selectedBook.title} | The Signal Collection`
      }
    } else if (page === "transcoder") {
      document.title = `The Universal Reader | Read Any Book - The Signal Collection`
    } else if (page === "oracle") {
      document.title = `The Oracle | The Signal Collection`
    } else if (page === "signals") {
      document.title = `Signals Feed | The Signal Collection`
    } else if (page === "about") {
      document.title = `About the Builder | The Signal Collection`
    } else if (page === "store") {
      document.title = `The Storehouse | Physical Artifacts`
    } else {
      document.title = `ABSCONDED | Scriptorium by VYRM`
    }
  }, [page, selectedBook, selectedChapter])

  // Restore progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("absconded-progress")
    let restoredScrollTop = 0

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        if (parsed.page) {
          setPage(parsed.page)
        }
        if (parsed.bookId) {
          let targetBook = books.find(b => b.id === parsed.bookId)
          if (!targetBook) {
            try {
              const customStored = localStorage.getItem("absconded-custom-books")
              if (customStored) {
                const list = JSON.parse(customStored)
                targetBook = list.find(b => b.id === parsed.bookId)
              }
            } catch (e) {}
          }
          if (targetBook) {
            if (targetBook.sections) {
              targetBook = {
                ...targetBook,
                sections: targetBook.sections.filter(s => {
                  const text = s.content ? s.content.map(c => c.text || "").join(" ") : ""
                  const romanCount = (text.match(/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)\.\s+[A-Z]/g) || []).length
                  return !(romanCount >= 2 && (s.title.toLowerCase().includes("introduction") || s.title.toLowerCase().includes("contents") || s.title.toLowerCase().includes("inception")))
                })
              }
            }
            setSelectedBook(targetBook)
            if (parsed.chapterId) {
              const targetChapter = targetBook.sections?.find(c => c.id === parsed.chapterId) || targetBook.sections?.[0]
              if (targetChapter) {
                setSelectedChapter(targetChapter)
                if (targetBook.parts) {
                  if (targetChapter.number >= 1 && targetChapter.number <= 16) {
                    setActivePart("book-1")
                  } else if (targetChapter.number >= 17 && targetChapter.number <= 30) {
                    setActivePart("book-2")
                  } else if (targetChapter.number >= 31 && targetChapter.number <= 44) {
                    setActivePart("book-3")
                  }
                }
              }
            }
          }
        }
        setShowCover(parsed.showCover !== undefined ? parsed.showCover : true)
        restoredScrollTop = parsed.scrollTop || 0
      } catch (e) {
        console.error("Failed to restore progress", e)
      }
    }

    // Give Next.js a short delay to mount components before scrolling
    setTimeout(() => {
      setIsRestoring(false)
      if (restoredScrollTop > 0) {
        window.scrollTo({
          top: restoredScrollTop,
          behavior: "instant"
        })
      }
    }, 150)
  }, [])

  // Load secured orders on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("vyrm-secured-orders")
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders)
        if (Array.isArray(parsed)) {
          setSecuredOrders(parsed)
        } else {
          setSecuredOrders([])
        }
      } catch (e) {
        console.error("Failed to load secured orders", e)
        setSecuredOrders([])
      }
    }
  }, [])

  // Persist reading progress and scroll position
  useEffect(() => {
    if (page === "book" && selectedBook && selectedChapter && !isRestoring) {
      const handleScrollSave = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const progressData = {
          page,
          bookId: selectedBook.id,
          chapterId: selectedChapter.id,
          showCover,
          scrollTop
        }
        localStorage.setItem("absconded-progress", JSON.stringify(progressData))
      }

      window.addEventListener("scroll", handleScrollSave, { passive: true })
      handleScrollSave()

      return () => window.removeEventListener("scroll", handleScrollSave)
    } else if (!isRestoring) {
      const currentProgress = localStorage.getItem("absconded-progress")
      let bookId = null
      let chapterId = null
      let scrollTop = 0
      if (currentProgress) {
        try {
          const parsed = JSON.parse(currentProgress)
          bookId = parsed.bookId
          chapterId = parsed.chapterId
          scrollTop = parsed.scrollTop
        } catch (e) {}
      }
      const progressData = {
        page,
        bookId,
        chapterId,
        showCover,
        scrollTop: page === "book" ? scrollTop : 0
      }
      localStorage.setItem("absconded-progress", JSON.stringify(progressData))
    }
  }, [page, selectedBook, selectedChapter, showCover, isRestoring])

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
        response: "Query terms are too short. Try searching for larger keywords like 'Mumbai', 'Signal', or 'Crypto'." 
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

    if (lowerQuery.includes("silent") || lowerQuery.includes("protocol") || lowerQuery.includes("meridian") || lowerQuery.includes("kabir") || lowerQuery.includes("rege")) {
      synthesizedAnswer = "Silent Protocol is a high-stakes tech-thriller set at Meridian House off the coast of Karwar. During a Category-5 cyclone, nine guests face an algorithmic reckoning for their roles in covering up a fatal error in ORACLEâ€”a predictive-risk model developed by company founder Kabir Rege that led to a factory supervisor's suicide. The manuscript explores corporate complicity, digital surveillance, and the psychological weight of guilt."
    } else if (lowerQuery.includes("mara") || lowerQuery.includes("sister")) {
      synthesizedAnswer = "Mara Calloway is Wren's sister. The central tragedy and psychological weight of the novel stems from a fateful night in their kitchen that ended with a gunshot, Mara's name on Wren's lips, and Wren checking into 'the Between' coma. Wren carries immense guilt for refusing to believe Mara for eleven months leading up to the incident. Facing the truth about Mara is the final locked door Wren must open to break her silence and wake up."
    } else if (lowerQuery.includes("maid") || lowerQuery.includes("murder") || lowerQuery.includes("chambermaid")) {
      synthesizedAnswer = "Book One: The Chambermaid's Door follows Wren Calloway as she lives the life of a hotel maid. Gifted with an extraordinary capacity for observation and noticing details, she solves a guest's murder. It teaches her the first essential step in her psychological recovery: 'Notice what is actually in front of you.'"
    } else if (lowerQuery.includes("chemist") || lowerQuery.includes("science") || lowerQuery.includes("television")) {
      synthesizedAnswer = "Book Two: The Chemist's Door explores Wren Calloway's alternate life as a research chemist whose groundbreaking work is stolen by a supervisor. She chooses not to remain silent, reclaiming her work and exposing the theft live on national television. It teaches her: 'Say the true thing even when it costs you.'"
    } else if (lowerQuery.includes("builder") || lowerQuery.includes("builders") || lowerQuery.includes("forty years")) {
      synthesizedAnswer = "Book Three: The Builders' Door traces a 40-year friendship between two creators who collaboratively build simulated digital worlds. When grief and loss threaten to tear their partnership apart, they find closure by completing their dead friend's unfinished work. It teaches Wren: 'Finish what is unfinished, choose hope on purpose.'"
    } else if (lowerQuery.includes("astronaut") || lowerQuery.includes("space") || lowerQuery.includes("mission")) {
      synthesizedAnswer = "Book Four: The Astronaut's Door represents the final threshold of Wren's internal journey. In this unreleased part, a lone astronaut waking up on a ship falling toward a dying Earth learns that the target she was sent to destroy is the only thing that can save her home. It teaches her: 'Take your own name back.'"
    } else if (lowerQuery.includes("room") || lowerQuery.includes("between") || lowerQuery.includes("lives") || lowerQuery.includes("wren") || lowerQuery.includes("aldous") || lowerQuery.includes("calloway")) {
      synthesizedAnswer = "The Room Between Lives is a four-book novel about Wren Calloway, who has been silent for six years after a traumatic kitchen gunshot incident. While in a coma, her mind checks into 'the Between'—a hotel in no place at all, run by the concierge Aldous. Each room represents a life she almost lived (chambermaid, chemist, world builder, astronaut). She must live out these lives to build the strength needed to face the truth behind the final door and wake up."
    } else if (lowerQuery.includes("universal") || lowerQuery.includes("reader") || lowerQuery.includes("transcoder") || lowerQuery.includes("upload") || lowerQuery.includes("epub") || lowerQuery.includes("gutenberg") || lowerQuery.includes("read any book") || lowerQuery.includes("classic")) {
      synthesizedAnswer = "The Universal Reader is Absconded's distraction-free digital reading engine. It allows anyone to search and read over 70,000+ public domain classics (from Kafka, Dostoevsky, and Nietzsche to Shelley, Plato, and Sun Tzu) or drag-and-drop their own .epub, .txt, and .md files. Everything parses 100% privately in the reader's local browser with OLED Dark, Paper Light, and Terminal themes, scroll tracking, and persistent reading progress."
    } else if (lowerQuery.includes("silent") || lowerQuery.includes("protocol") || lowerQuery.includes("meridian") || lowerQuery.includes("kabir") || lowerQuery.includes("rege")) {
      synthesizedAnswer = "Silent Protocol is a high-stakes tech-thriller set at Meridian House off the coast of Karwar. During a Category-5 cyclone, nine guests face an algorithmic reckoning for their roles in covering up a fatal error in ORACLE—a predictive-risk model developed by company founder Kabir Rege that led to a factory supervisor's suicide. The manuscript explores corporate complicity, digital surveillance, and the psychological weight of guilt."
    } else if (lowerQuery.includes("signal") || lowerQuery.includes("organism") || lowerQuery.includes("simulation")) {
      synthesizedAnswer = "The Signal Collection is a cyber-existential concept running through the digital manuscripts. First introduced in *Absconded* as 'absconded.space'â€”representing synthetic internet lifeformsâ€”it represents software that feels alive. Later, in *The Mask Beneath*, the simulated organism shows signs of autonomous identity formation. It represents the boundary where lines of code begin to develop memory, personality, and persistent hunger in an era of infinite generation."
    } else if (lowerQuery.includes("tanvir") || lowerQuery.includes("khan") || lowerQuery.includes("author") || lowerQuery.includes("builder")) {
      synthesizedAnswer = "Tanvir Khan is a builder from Mumbai who spent years inside the traditional supply chain machine before quietly absconding into the internet. His journey, documented in *Absconded*, traces a transition from stable retail procurement to crypto speculation, AI experimentation, and high-fidelity builder identity. He advocates that 'Lore before product' is the ultimate way to create resonance in the internet era."
    } else if (lowerQuery.includes("corporate") || lowerQuery.includes("job") || lowerQuery.includes("career") || lowerQuery.includes("office") || lowerQuery.includes("manager") || lowerQuery.includes("supply chain")) {
      synthesizedAnswer = "The Signal Collection repeatedly explores the stifling nature of corporate structures. In *Absconded*, Tanvir describes his stable corporate life as 'a resume that becomes a fiction everyone agrees to call your life.' The collection treats corporate roles as rigid identity anchors that AI will rapidly commoditize, forcing builders to abscond into internet-native portfolios where 'action produces confidence' and one can survive ambiguity as a conditioning phase."
    } else if (lowerQuery.includes("crypto") || lowerQuery.includes("solana") || lowerQuery.includes("bitcoin") || lowerQuery.includes("token") || lowerQuery.includes("wallet") || lowerQuery.includes("memecoin")) {
      synthesizedAnswer = "Crypto acts as the first mutation in the builder's psychology. Rather than just financial gain, Web3 represents the ultimate 'editable world'â€”a space where narrative acts as infrastructure and communities form digital tribes. The manuscripts show how seeing a teenager with a laptop outperform centuries-old institutions permanently damages a builder's ability to return to standard wage labor."
    } else if (lowerQuery.includes("ai") || lowerQuery.includes("model") || lowerQuery.includes("claude") || lowerQuery.includes("gemini") || lowerQuery.includes("gpt") || lowerQuery.includes("artificial")) {
      synthesizedAnswer = "The collection addresses the rise of cognitive AI tools (like GPT-4, Claude, Gemini) not merely as productivity tools, but as disruptors of human identity anchors. In *Absconded* Chapter 6, Tanvir realizes that while AI can automate the 'execution tax' of coding and writing, it lacks 'want'â€”the specific, unreasonable human hunger and Failure-tempered intuition that creates taste."
    } else if (lowerQuery.includes("mumbai") || lowerQuery.includes("heat") || lowerQuery.includes("monsoon") || lowerQuery.includes("rain") || lowerQuery.includes("city")) {
      synthesizedAnswer = "Mumbai represents the honest, indifferent environment against which the builder is stress-tested. The manuscripts detail the oppressive May heat and the sudden, flooding monsoons. The cityâ€™s utter indifference to digital startups and individual visions is portrayed as liberating: 'When the environment refuses to validate you, you stop building for validation.'"
    } else if (topResults.length > 0) {
      const sentences = topResults.map(chunk => {
        const text = chunk.text
        const sents = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
        return sents[0] ? sents[0] + "." : text
      })
      
      synthesizedAnswer = `Synthesizing neural signal across the library...\n\nAccording to the manuscripts, "${sentences[0]}" [1]\n\nFurther details show that "${sentences[1] || ""}" [2]\n\nFinally, as recorded in the logs, "${sentences[2] || ""}" [3]\n\nThis highlights the key thematic focus of the collection: escaping predefined roles and building internet-native structures.`
    } else {
      synthesizedAnswer = "No strong signal could be synthesized for this query. The Signal search engine found no matching text blocks. Try searching for terms like 'Signal', 'Mumbai', 'Corporate', 'Crypto', 'AI', or 'Tanvir'."
    }

    return { results: topResults, response: synthesizedAnswer }
  }

  // Always reset scroll on key navigation transitions
  useEffect(() => {
    if (isRestoring) return
    window.scrollTo(0, 0)
  }, [page, selectedBook, selectedChapter, showCover, isRestoring])

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
    let cleanBook = book
    if (cleanBook && cleanBook.sections) {
      const cleanSections = cleanBook.sections.filter(s => {
        const text = s.content ? s.content.map(c => c.text || "").join(" ") : ""
        const romanCount = (text.match(/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)\.\s+[A-Z]/g) || []).length
        return !(romanCount >= 2 && (s.title.toLowerCase().includes("introduction") || s.title.toLowerCase().includes("contents") || s.title.toLowerCase().includes("inception")))
      })
      if (cleanSections.length > 0) {
        cleanBook = { ...cleanBook, sections: cleanSections }
      }
    }

    navigate(() => {
      setSelectedBook(cleanBook)
      setPage("book")
      setShowCover(true)
      setSelectedChapter(null)
      setActivePart("book-1")
    })
  }

  // Record a unique reader action upon starting a book
  const handleBeginReading = (bookId) => {
    const readKey = `absconded-read-${bookId}`
    if (!localStorage.getItem(readKey)) {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.count !== undefined) {
          setBookStats(prev => ({ ...prev, [bookId]: data.count }))
        }
        localStorage.setItem(readKey, 'true')
      })
      .catch(err => console.error("Error updating stats:", err))
    }
    setShowCover(false)
  }

  const handleOrderProduct = (product) => {
    setCheckoutProduct(product)
    setCheckoutStep(1)
    setPaymentMethod("razorpay")
    setShippingInfo({ name: "", email: "", address: "", city: "", state: "", zip: "", country: "IN" })
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => {
      const updated = { ...prev, [name]: value }
      if (name === "country") {
        if (value === "IN") {
          setPaymentMethod("razorpay")
        } else {
          setPaymentMethod("dodo")
        }
      }
      return updated
    })
  }

  const handleCompleteOrder = () => {
    if (!checkoutProduct) return
    const updatedOrders = [...securedOrders, checkoutProduct.id]
    setSecuredOrders(updatedOrders)
    localStorage.setItem("vyrm-secured-orders", JSON.stringify(updatedOrders))
    setCheckoutStep(4)
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

  // Bookmark toggle & save handler
  const isCurrentBookmarked = bookmarks.some(
    bm => bm.bookId === selectedBook?.id && bm.chapterId === selectedChapter?.id
  )

  const handleToggleBookmark = () => {
    if (!selectedBook || !selectedChapter) return
    const scrollTop = typeof window !== 'undefined' ? (window.scrollY || document.documentElement.scrollTop) : 0
    const scrollHeight = typeof document !== 'undefined' ? (document.documentElement.scrollHeight - document.documentElement.clientHeight) : 0
    const scrollPercent = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0

    let quoteSnippet = ""
    if (selectedChapter.content && selectedChapter.content.length > 0) {
      const pBlock = selectedChapter.content.find(b => b.type === 'p' && b.text)
      if (pBlock) quoteSnippet = pBlock.text.slice(0, 95) + "..."
    }

    const existingIndex = bookmarks.findIndex(
      bm => bm.bookId === selectedBook.id && bm.chapterId === selectedChapter.id
    )

    let updated = []
    if (existingIndex !== -1) {
      updated = bookmarks.filter((_, idx) => idx !== existingIndex)
      setBookmarkToast("Bookmark removed")
    } else {
      const newBm = {
        id: `bm-${Date.now()}`,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        chapterId: selectedChapter.id,
        chapterTitle: selectedChapter.title,
        chapterLabel: selectedChapter.label || "Chapter",
        scrollTop,
        scrollPercent,
        quoteSnippet,
        dateFormatted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      }
      updated = [newBm, ...bookmarks]
      setBookmarkToast(`✦ Bookmark Saved (${scrollPercent}%)`)
    }

    setBookmarks(updated)
    try {
      localStorage.setItem("absconded-bookmarks", JSON.stringify(updated))
    } catch (e) {}
    setTimeout(() => setBookmarkToast(""), 2500)
  }

  const handleSelectBookmark = (bm) => {
    let targetBook = books.find(b => b.id === bm.bookId)
    if (!targetBook) {
      try {
        const stored = localStorage.getItem("absconded-custom-books")
        if (stored) {
          const list = JSON.parse(stored)
          targetBook = list.find(b => b.id === bm.bookId)
        }
      } catch (e) {}
    }

    if (!targetBook) return

    const targetChapter = targetBook.sections?.find(s => s.id === bm.chapterId) || targetBook.sections?.[0]
    if (!targetChapter) return

    navigate(() => {
      setSelectedBook(targetBook)
      setSelectedChapter(targetChapter)
      setPage("book")
      setShowCover(false)
    })

    setTimeout(() => {
      if (typeof window !== 'undefined' && bm.scrollTop) {
        window.scrollTo({
          top: bm.scrollTop,
          behavior: "smooth"
        })
      }
    }, 400)
  }

  const handleDeleteBookmark = (id) => {
    const updated = bookmarks.filter(b => b.id !== id)
    setBookmarks(updated)
    try {
      localStorage.setItem("absconded-bookmarks", JSON.stringify(updated))
    } catch (e) {}
  }

  const isReading = page === "book" && selectedChapter

  return (
    <>
      {/* Scroll Progress Bar for Active Reading */}
      {isReading && <ScrollProgressBar content={selectedChapter.content} />}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-bg/85 backdrop-blur-md border-b border-white/5 pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          <button 
            onClick={() => {
              navigate(() => {
                setPage("library");
                setSelectedBook(null);
                setSelectedChapter(null);
                setMenuOpen(false);
              });
            }}
            className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity duration-300 whitespace-nowrap z-[60] shrink-0"
          >
            <img src="/logo.jpg" alt="Absconded // VYRM Logo" className="h-6 w-6 sm:h-7 sm:w-7 rounded-sm border border-white/10 object-cover bg-black shrink-0" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-normal text-white/90 hover:text-white transition-colors duration-300">
              <span>Absconded</span>
              <span className="hidden sm:inline"> // VYRM</span>
            </span>
          </button>

          {/* Reading Context indicator on Desktop */}
          {page === "book" && selectedBook && selectedChapter && (
            <div className="hidden md:flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase text-secondary">
              <span>{selectedBook.title}</span>
              <span className="text-white/20">{"\u00B7"}</span>
              <span className="text-white">{selectedChapter.title}</span>
              {getChapterStats() && (
                <>
                  <span className="text-white/20">{"\u00B7"}</span>
                  <span>{getChapterStats().current} / {getChapterStats().total}</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4 z-[60] shrink-0">
            {/* Direct Bookmark button when inside reader */}
            {isReading && (
              <button
                onClick={handleToggleBookmark}
                className={`flex items-center gap-1.5 text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full border transition-all ${
                  isCurrentBookmarked
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-medium shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "border-white/10 text-secondary hover:text-white hover:border-white/30 bg-white/[0.02]"
                }`}
                title="Bookmark current reading position"
                aria-label="Bookmark position"
              >
                <span className="text-xs">🔖</span>
                <span className="hidden sm:inline">{isCurrentBookmarked ? "Saved" : "Bookmark"}</span>
                {isCurrentBookmarked && (
                  <span className="sm:hidden text-[8px] font-mono text-emerald-400 font-bold">Saved</span>
                )}
              </button>
            )}

            {/* Bookmarks Drawer Trigger if not reading */}
            {bookmarks.length > 0 && !isReading && (
              <button
                onClick={() => setBookmarksOpen(true)}
                className="flex items-center gap-1.5 text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-secondary hover:text-white border border-white/10 hover:border-white/30 bg-white/[0.02] px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full transition-all"
                title="Open Bookmarks"
                aria-label="Open Bookmarks"
              >
                <span className="text-xs">🔖</span>
                <span className="hidden sm:inline">Bookmarks</span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-white/90 font-medium">
                  {bookmarks.length}
                </span>
              </button>
            )}

            {/* Hamburger Trigger */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-8 h-8 flex flex-col justify-center items-center group focus:outline-none shrink-0"
              aria-label="Toggle Menu"
            >
              <span 
                style={{ backgroundColor: 'var(--text)' }}
                className={`block w-5 sm:w-6 h-[1.5px] transition-all duration-300 ease-out absolute ${
                  menuOpen ? "rotate-45" : "-translate-y-1.5"
                }`} 
              />
              <span 
                style={{ backgroundColor: 'var(--text)' }}
                className={`block w-5 sm:w-6 h-[1.5px] transition-all duration-300 ease-out absolute ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`} 
              />
              <span 
                style={{ backgroundColor: 'var(--text)' }}
                className={`block w-5 sm:w-6 h-[1.5px] transition-all duration-300 ease-out absolute ${
                  menuOpen ? "-rotate-45" : "translate-y-1.5"
                }`} 
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Overlay Navigation Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl transition-all duration-500 ease-in-out overflow-y-auto overscroll-contain ${
          menuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        }`}
      >
        {/* Decorative Grid Lines */}
        <div className="fixed inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15] pointer-events-none" />
        
        <div className="min-h-full flex flex-col justify-between p-6 sm:p-16 max-w-xl mx-auto w-full relative z-10">
          <div className="h-16 shrink-0" />

          {/* Navigation Links */}
          <div className="flex flex-col gap-5 sm:gap-8 justify-center my-auto py-6">
            {[
              { label: "Shelf", value: "library" },
              { label: "Universal Reader", value: "transcoder" },
              { label: "Oracle", value: "oracle" },
              { label: "Signals Feed", value: "signals" },
              { label: "About", value: "about" },
              { label: "Storehouse", value: "store" }
            ].map((link, idx) => (
              <button
                key={link.value}
                onClick={() => {
                  navigate(() => {
                    setPage(link.value);
                    setSelectedBook(null);
                    setSelectedChapter(null);
                    setMenuOpen(false);
                  });
                }}
                className="group text-left flex items-baseline gap-4 outline-none"
              >
                <span className="text-[10px] sm:text-xs font-mono text-secondary tracking-widest opacity-40">
                  0{idx + 1}
                </span>
                <span className={`text-2xl sm:text-5xl font-serif italic tracking-wide transition-all duration-300 relative ${
                  page === link.value ? "text-white" : "text-secondary hover:text-white"
                }`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 right-0 h-[1px] bg-white transition-all duration-500 origin-left scale-x-0 group-hover:scale-x-100 ${
                    page === link.value ? "scale-x-100" : ""
                  }`} />
                </span>
              </button>
            ))}

            {/* Bookmarks link in menu if any saved */}
            {bookmarks.length > 0 && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setBookmarksOpen(true);
                }}
                className="group text-left flex items-baseline gap-4 outline-none pt-4 border-t border-white/5"
              >
                <span className="text-[10px] sm:text-xs font-mono text-secondary tracking-widest opacity-40">
                  ★
                </span>
                <span className="text-xl sm:text-3xl font-serif italic text-emerald-400/90 hover:text-emerald-300 transition-colors flex items-center gap-3">
                  <span>Bookmarks</span>
                  <span className="text-[8px] font-mono tracking-widest uppercase px-2.5 py-0.5 border border-emerald-500/30 rounded-full text-emerald-400 bg-emerald-500/10">
                    {bookmarks.length} Saved
                  </span>
                </span>
              </button>
            )}
          </div>

          {/* Theme Switcher & Details */}
          <div className="w-full border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shrink-0 mt-6 pb-6 sm:pb-0">
            <div className="flex flex-col gap-2">
              <span className="text-[8px] tracking-[0.3em] uppercase text-secondary">Aesthetic Interface Mode</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleThemeChange("oled")}
                  className={`flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase transition-all ${
                    theme === "oled" ? "text-white font-bold" : "text-secondary hover:text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black border border-white/40" />
                  OLED Dark
                </button>
                <span className="text-white/10">|</span>
                <button 
                  onClick={() => handleThemeChange("light")}
                  className={`flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase transition-all ${
                    theme === "light" ? "text-black font-bold" : "text-secondary hover:text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f8f5ee] border border-black/40" />
                  Paper Light
                </button>
                <span className="text-white/10">|</span>
                <button 
                  onClick={() => handleThemeChange("terminal")}
                  className={`flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase transition-all ${
                    theme === "terminal" ? "text-white font-bold" : "text-secondary hover:text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 border border-[#00ff88]/30" />
                  Terminal
                </button>
              </div>
            </div>
            
            <div className="text-[8px] tracking-[0.2em] uppercase text-secondary/60 text-left sm:text-right">
              ABSCONDED ARCHIVE // VYRM · 2026
            </div>
          </div>
        </div>
      </div>

      <main className={`min-h-screen bg-bg text-text transition-opacity duration-300 selection:bg-white/10 selection:text-white ${transitioning ? "opacity-0" : "opacity-100"}`}>

      {/* View 1: Shelf (Library) */}
      {page === "library" && (
        <section className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-6xl mx-auto fade-in">
          <header className="mb-10 sm:mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Digital Manuscript Library</p>
            <h1 className="text-3xl sm:text-4xl font-serif italic">The Signal Collection</h1>
          </header>

          {/* Filter Categories & Universal Reader Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-14 border-b border-white/5 pb-4">
            {/* Horizontal Scrollable/Spaced Tabs */}
            <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar py-1">
              {["all", "manuscripts", "shorts"].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-all duration-300 relative py-2 whitespace-nowrap shrink-0 ${
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

            {/* Read Any Book CTA Button */}
            <button
              onClick={() => {
                navigate(() => {
                  setPage("transcoder");
                  setSelectedBook(null);
                  setSelectedChapter(null);
                });
              }}
              className="w-full sm:w-auto text-[9px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-secondary hover:text-white flex items-center justify-center sm:justify-start gap-2 border border-white/10 hover:border-white/30 px-4 py-2.5 sm:py-1.5 rounded-full transition-all bg-white/[0.02] hover:bg-white/5 active:scale-[0.98] shrink-0"
            >
              <span>✦ Read Any Book</span>
              <span className="opacity-60 hidden md:inline">(Classics & Upload)</span>
              <span>→</span>
            </button>
          </div>

          {/* Resume Reading Card if bookmarks exist */}
          {bookmarks.length > 0 && (
            <div className="mb-10 sm:mb-14 p-4 sm:p-8 border border-white/10 hover:border-white/20 rounded-sm bg-white/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 transition-all duration-300">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400">🔖</span>
                  <span className="text-[8px] tracking-[0.3em] uppercase text-secondary font-mono">Last Saved Bookmark</span>
                </div>
                <h3 className="text-base sm:text-2xl font-serif italic text-white leading-tight">
                  {bookmarks[0].chapterTitle}
                </h3>
                <p className="text-[9px] tracking-[0.2em] uppercase text-secondary/70">
                  {bookmarks[0].bookTitle} · <span className="font-mono text-emerald-400">{bookmarks[0].scrollPercent}% read</span>
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto pt-2 sm:pt-0">
                <button
                  onClick={() => handleSelectBookmark(bookmarks[0])}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-bg hover:bg-white/90 text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-bold rounded-sm transition-all shadow-sm text-center"
                >
                  Resume Reading →
                </button>
                <button
                  onClick={() => setBookmarksOpen(true)}
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 border border-white/10 hover:border-white/30 text-secondary hover:text-white text-[8px] sm:text-[9px] tracking-[0.2em] uppercase rounded-sm transition-all shrink-0"
                >
                  All ({bookmarks.length})
                </button>
              </div>
            </div>
          )}

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
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-[1.01] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-85 z-10" />
                    
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                      <h2 className="text-3xl font-serif italic mb-2 text-always-white">{book.title}</h2>
                      <p className="text-[9px] tracking-[0.3em] uppercase text-always-white-60">{book.subtitle}</p>
                    </div>

                    <div className="absolute top-6 right-6 flex gap-2 z-20">
                      <span className="text-[8px] tracking-[0.2em] uppercase text-always-white-80 border border-always-white-10 px-3 py-1 bg-always-black-40 backdrop-blur-sm">
                        {book.type === "manuscript" ? "Manuscript" : "Short Story"}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] uppercase text-always-white-60 border border-always-white-10 px-3 py-1 bg-always-black-40 backdrop-blur-sm">
                        {calculateBookReadingTime(book)} read
                      </span>
                      {bookStats[book.id] !== undefined && (
                        <span className="text-[8px] tracking-[0.2em] uppercase text-always-white-60 border border-always-white-10 px-3 py-1 bg-always-black-40 backdrop-blur-sm">
                          {bookStats[book.id]} {bookStats[book.id] === 1 ? 'reader' : 'readers'}
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
        <section className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-2xl mx-auto fade-in">
          <header className="mb-10 sm:mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Real-time Builder Activity</p>
            <h1 className="text-3xl sm:text-4xl font-serif italic">The Signal Feed</h1>
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
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 fade-in">
          <div className="text-center max-w-2xl">
            {selectedBook.coverImage && (
              <div className="mx-auto mb-8 w-44 sm:w-52 aspect-[2/3] relative rounded shadow-2xl overflow-hidden border border-white/10 group bg-black/50">
                <img 
                  src={selectedBook.coverImage} 
                  alt={selectedBook.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
            <p className="text-[9px] tracking-[0.4em] uppercase text-secondary mb-6 sm:mb-8">{selectedBook.subtitle} {"\u00B7"} {calculateBookReadingTime(selectedBook)} read</p>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif italic mb-6 sm:mb-8 tracking-tight leading-none px-2">{selectedBook.title}</h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8 sm:mb-10" />
            <div className="mb-10 text-secondary font-light leading-relaxed font-serif italic text-lg px-4">
              {selectedBook.coverQuote || '"The beginning is always today."'}
            </div>

            {selectedBook.credits && (
              <div className="max-w-lg mx-auto mb-10 p-3.5 border border-white/10 rounded-sm bg-white/[0.02] text-[10px] tracking-[0.05em] text-secondary/70 font-mono leading-relaxed">
                <span className="text-white/80 uppercase font-semibold">Provenance: </span>
                {selectedBook.credits}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => handleBeginReading(selectedBook.id)}
                className="px-12 py-4 border border-white/10 hover:border-white/40 hover:bg-white/5 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
              >
                Begin Reading
              </button>
            </div>

            <div className="mt-16 text-[9px] tracking-[0.2em] text-secondary/40 uppercase">
              {books.some(b => b.id === selectedBook.id) ? (
                "Mumbai · Twenty-Twenty-Six"
              ) : (
                `${selectedBook.edition ? `${selectedBook.edition} · ` : ""}Verified Public Domain · Distraction-Free Edition`
              )}
            </div>
          </div>
        </section>
      )}

      {/* View 4: Book Chapter Index */}
      {page === "book" && selectedBook && !showCover && !selectedChapter && (
        <section className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-2xl mx-auto fade-in">
          <div className="mb-10 sm:mb-16 flex items-center gap-4">
            <button 
              onClick={() => setShowCover(true)}
              className="text-[9px] tracking-[0.3em] uppercase text-secondary hover:text-white transition-colors flex items-center gap-2"
            >
              <span>{"\u2190"}</span> Cover
            </button>
          </div>

          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Manuscript Index {"\u00B7"} {calculateBookReadingTime(selectedBook)} total read</h2>
          <p className="font-serif italic text-2xl mb-6">{selectedBook.title}</p>
          <p className="text-sm font-light text-secondary/80 leading-relaxed mb-16 font-serif italic max-w-xl">
            {selectedBook.description}
          </p>

          {selectedBook.parts && (
            <div className="flex flex-wrap gap-8 mb-16 border-b border-white/5 pb-4">
              {selectedBook.parts.map((part) => (
                <button 
                  key={part.id}
                  onClick={() => setActivePart(part.id)}
                  className={`text-[10px] tracking-[0.3em] uppercase transition-all duration-300 relative pb-4 -mb-[17px] ${
                    activePart === part.id ? "text-white font-medium" : "text-secondary hover:text-white"
                  }`}
                >
                  {part.title}
                  {activePart === part.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white animate-fade-in" />
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedBook.parts && activePart === "book-4" ? (
            <div className="py-16 text-center border border-white/5 rounded-sm bg-white/[0.01] px-8 max-w-xl mx-auto fade-in">
              <span className="text-3xl mb-6 block">{"\uD83D\uDD12"}</span>
              <h3 className="font-serif italic text-xl mb-4">Book Four: The Astronaut's Door</h3>
              <p className="text-sm font-light text-secondary leading-relaxed mb-6 font-serif">
                The fourth door at the end of the wing is cold to the touch and lacks a brass plaque. 
                Aldous stands beside it, checking his pocket watch.
              </p>
              <div className="border-l-2 border-white/10 pl-6 italic text-left text-xs text-secondary/80 max-w-md mx-auto leading-relaxed font-serif">
                "This life isn't ready to be lived yet, Wren. Some doors cannot be opened until you've faced what's behind the others. Be patient. The launch window hasn't arrived."
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedBook.sections
                .filter((section) => {
                  if (!selectedBook.parts) return true;
                  if (activePart === "book-1") {
                    return section.id === "prologue" || (section.label && section.label.startsWith("Book One"));
                  }
                  if (activePart === "book-2") {
                    return section.label && section.label.startsWith("Book Two");
                  }
                  if (activePart === "book-3") {
                    return section.label && section.label.startsWith("Book Three");
                  }
                  return false;
                })
                .map((section) => (
                  <div 
                    key={section.id}
                    onClick={() => { navigate(() => setSelectedChapter(section)); }}
                    className="chapter-card cursor-pointer group"
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <div className="flex items-baseline gap-6">
                        <span className="text-[10px] font-light text-secondary group-hover:text-white/40 transition-colors">
                          {["prologue", "epilogue", "author-note", "mirror-threshold", "mirror-reflects"].includes(section.id) 
                            ? "\u2605" 
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
          )}

          {/* Only show "Written by Tanvir Khan" on front-page books */}
          {books.some(b => b.id === selectedBook.id) && (
            <div className="mt-32 flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-1000">
              <img src="/author.png" className="w-12 h-12 rounded-full grayscale object-cover" alt="Author" />
              <div className="flex flex-col">
                <span className="text-[9px] tracking-[0.3em] uppercase text-secondary">Written by</span>
                <span className="text-sm font-serif italic">Tanvir Khan</span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* View 5: Reading View (Chapter Mode) */}
      {page === "book" && selectedBook && selectedChapter && (
        <section className="pt-24 sm:pt-36 pb-24 sm:pb-32 px-4 sm:px-6 fade-in">
          <div className="book-container">
            <header className="mb-12 sm:mb-20 text-center">
              <div className="text-[10px] tracking-[0.3em] text-secondary mb-3 uppercase flex items-center justify-center gap-2">
                <span>{selectedChapter.label}</span>
                {getChapterStats() && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="text-secondary/60 font-mono">Part {getChapterStats().current} of {getChapterStats().total}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic leading-tight px-2">
                {selectedChapter.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                <span className="text-[9px] tracking-[0.2em] text-secondary/40 uppercase">
                  {calculateReadingTime(selectedChapter.content)} chapter read
                </span>
                <span className="text-white/20">·</span>
                <button
                  onClick={handleToggleBookmark}
                  className={`text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 transition-all px-2.5 py-1 rounded-full border ${
                    isCurrentBookmarked 
                      ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-medium" 
                      : "border-white/10 text-secondary/70 hover:text-white hover:border-white/30"
                  }`}
                  title="Bookmark exact reading position"
                >
                  <span>🔖</span>
                  <span>{isCurrentBookmarked ? "Saved Bookmark" : "Save Bookmark"}</span>
                </button>
              </div>
            </header>

            <article className="book-text font-serif">
              {selectedChapter.epigraph && (
                <div className="text-secondary italic text-center mb-16 px-8 leading-relaxed">
                  {"\u201C"}{selectedChapter.epigraph}{"\u201D"}
                </div>
              )}

              <div className="space-y-10">
                {selectedChapter.content.map((block, t) => {
                  if (block.type === "heading") {
                    return (
                      <h3 key={t} className="book-heading">
                        {block.text}
                      </h3>
                    )
                  }
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
                        <span>{"\u21B3"}</span>
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
                          <div className="text-[9px] tracking-[0.2em] text-secondary/40 uppercase">Mumbai {"\u00B7"} 2026</div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              {/* Navigation within reading view */}
              <div className="mt-32 pt-16 border-t border-white/5">
                <div className="flex items-center justify-between gap-4 sm:gap-8">
                  <button 
                    onClick={() => navigate(() => setSelectedChapter(null))}
                    className="text-[9px] tracking-[0.3em] uppercase text-secondary hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>{"\u2190"}</span> Index
                  </button>

                  <button
                    onClick={scrollToTop}
                    className="text-[9px] tracking-[0.25em] uppercase text-secondary/60 hover:text-white transition-colors flex items-center gap-1.5 border border-white/10 hover:border-white/30 px-3.5 py-1.5 rounded-full bg-white/[0.02]"
                    title="Return to top of chapter"
                  >
                    <span>{"\u2191"}</span> Top
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
                      <span className="group-hover:translate-x-3 transition-transform duration-300">{"\u2192"}</span>
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
        <section className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-4xl mx-auto fade-in">
          <header className="mb-10 sm:mb-16 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Neural Query Interface</p>
            <h1 className="text-3xl sm:text-5xl font-serif italic text-white mb-6">The Signal Oracle</h1>
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
              <span>Status: Oracle Search Engine Online</span>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <span>Indexed: {books.length} Books</span>
              <span>{books.reduce((acc, b) => acc + (b.sections?.length || 0), 0)} Chapters</span>
              <span>{books.reduce((acc, b) => acc + (b.sections?.reduce((a, s) => a + (s.content?.length || 0), 0) || 0), 0)} Paragraph Chunks</span>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-14 relative">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask the Oracle (e.g., 'Why did Tanvir leave corporate life?' or 'What is the Signal?')..."
                  className="w-full bg-black/40 border border-white/15 focus:border-white/40 rounded-lg py-4 px-5 pr-10 text-sm text-white placeholder-secondary/50 outline-none transition-all duration-300"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setActiveSearch(false); }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-white text-xs px-1"
                    title="Clear"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button 
                type="submit"
                disabled={searching || !query.trim()}
                className="px-8 py-4 bg-white text-black hover:bg-white/90 disabled:bg-white/15 disabled:text-white/30 disabled:border-white/10 border border-white/30 rounded-lg text-[10px] tracking-[0.3em] uppercase transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] shrink-0"
              >
                <span>{searching ? "Scanning..." : "Query Signal"}</span>
                {!searching && <span>→</span>}
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[8px] tracking-[0.2em] uppercase text-secondary/60 mr-1">Suggestions:</span>
              {[
                "Why did Tanvir abscond?",
                "What is the Signal?",
                "Universal Reader",
                "AI vs Human Want",
                "Memecoin Survival",
                "Corporate machine"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    setSearching(true);
                    setActiveSearch(true);
                    setTimeout(() => {
                      const { results, response } = searchLibrary(suggestion);
                      setSearchResults(results);
                      setSynthesizedResponse(response);
                      setSearching(false);
                    }, 500);
                  }}
                  className="text-[8px] tracking-[0.15em] uppercase px-3 py-1 border border-white/10 hover:border-white/30 rounded-full text-secondary hover:text-white bg-white/[0.02] hover:bg-white/5 transition-all"
                >
                  {suggestion}
                </button>
              ))}
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
                              {result.chapterLabel} {"\u00B7"} {result.chapterTitle}
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
        <section className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-3xl mx-auto fade-in">
          <header className="mb-10 sm:mb-20 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">The Author & The Archive</p>
            <h1 className="text-3xl sm:text-5xl font-serif italic text-white mb-8">Behind the Signal</h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8"></div>
          </header>

          <div className="space-y-16">
            {/* The Essence of Life */}
            <div>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-6 border-b border-white/5 pb-4">The Essence</h2>
              <div className="space-y-6 text-sm font-light text-secondary/90 leading-relaxed font-serif">
                <p>
                  <span className="text-white">I am Tanvir Khan.</span> For years, I existed inside the traditional supply chain machine, a builder locked into a corporate timeline that didn't belong to me. My essence of life is rooted in the quiet act of absconding{"\u2014"}detaching from the narrative that others have built for you in order to construct your own reality from the ground up.
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
                  While <span className="text-white italic">Absconded</span> holds elements of my truth, the majority of the stories within the Signal Collection{"\u2014"}including <span className="text-white italic">The Mask Beneath</span> and the <span className="text-white italic">Signal Collection III</span>{"\u2014"}are works of fiction. 
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
                  <span className="text-white">The Universal Reader:</span> We have expanded Absconded beyond a personal manuscript archive into an ambient, distraction-free reading sanctuary. Readers can now search 70,000+ open-source public domain classics (from Kafka and Dostoevsky to Nietzsche and Plato) or drop their own EPUB, Markdown, and text manuscripts to read them in pure OLED minimalism with persistent reading progress.
                </p>
                <p>
                  The immediate roadmap also holds deeper cognitive integration of the Oracle—our semantic RAG engine—allowing readers to interrogate both the original manuscripts and the transcoded classics as dynamic, querying databases.
                </p>
              </div>
            </div>

            {/* Contact & Collaborations */}
            <div>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-6 border-b border-white/5 pb-4">Physical Editions & Availability</h2>
              <div className="space-y-6 text-sm font-light text-secondary/90 leading-relaxed font-serif">
                <p>
                  Physical chapbooks from the Signal Collection are currently available for delivery <span className="text-white">within India only</span>. All orders are printed and dispatched from Mumbai {"\u2014"} expect 4{"\u2013"}5 days for printing &amp; processing, followed by 4{"\u2013"}5 days for delivery within India.
                </p>
                <p>
                  International print-on-demand is being explored for future releases. If you're outside India and want to be notified when that's available, reach out directly at <a href="mailto:tanizcoldz@gmail.com" className="text-white hover:text-white/80 border-b border-white/20 transition-colors">tanizcoldz@gmail.com</a>.
                </p>
                <p>
                  For bulk orders, brand sponsorships, or collaboration inquiries, feel free to reach out at the same address.
                </p>
              </div>
            </div>

            {/* Solana Tip Box */}
            <div className="p-8 border border-white/5 hover:border-white/10 rounded-sm bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden">
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-4">Support the Builder (Buy Me a Coffee)</h2>
              <p className="text-xs font-light text-secondary/70 mb-6 leading-relaxed">
                If you resonate with the manuscripts, the essays, or the tools within this archive, feel free to support my work directly by sending a tip. All contributions directly fund the production of future Signal Collections.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full font-mono text-[10px] tracking-[0.05em] py-3.5 px-4 bg-black/40 border border-white/10 rounded-md text-white flex items-center justify-between gap-4 break-all">
                  <div className="flex items-center gap-2 select-all overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="text-emerald-500 font-bold text-[8px] uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded">SOL</span>
                    <span className="text-secondary/90">B1GuATf6HZKnv34syU77pqLuRocjLq7rYFLZYnoGQTkS</span>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("B1GuATf6HZKnv34syU77pqLuRocjLq7rYFLZYnoGQTkS");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-4 py-1.5 bg-white text-bg hover:bg-white/90 rounded text-[8px] tracking-[0.2em] uppercase font-bold transition-all shrink-0 active:scale-95"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 pb-12">
              <a href="https://github.com/habibixyz/Absconded" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-white/10 hover:border-white/40 hover:bg-white/5 rounded-full text-[10px] tracking-[0.3em] uppercase text-white transition-all duration-300">
                GitHub Repository
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
                    q: "Is it free?",
                    a: "Always. All original manuscripts and the 70,000+ public domain classics in the Universal Reader are completely free to read, explore, and share."
                  },
                  {
                    q: "What is the Universal Reader?",
                    a: "It is our distraction-free digital reading room. It lets you search classic public domain literature (Project Gutenberg) or drag-and-drop your own .epub, .txt, or .md files to read them in pure OLED Dark, Paper Light, or Terminal modes with full chapter navigation."
                  },
                  {
                    q: "Are my uploaded books private?",
                    a: "100% private. Files you drop into the reader are parsed locally on your device via client-side JavaScript. No file content or reading telemetry is ever sent to or stored on any server."
                  },
                  {
                    q: "What is Absconded actually about?",
                    a: "It's about the quiet act of leaving \u2014 a corporate timeline, a version of yourself that no longer fits. Set in Mumbai, it traces a builder's journey through crypto, AI, and the strange courage it takes to become someone new."
                  },
                  {
                    q: "Who is Tanvir Khan?",
                    a: "A builder from Mumbai. Spent years inside the traditional supply chain machine before quietly absconding into the internet. This library is what he found on the other side."
                  },
                  {
                    q: "Does the reader save my progress?",
                    a: "Yes. Your current chapter and exact scroll position are automatically saved in your browser's local storage so you can pick up exactly where you left off."
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
        <section className="pt-24 sm:pt-36 pb-20 px-4 sm:px-6 max-w-6xl mx-auto fade-in">
          <header className="mb-10 sm:mb-20 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Physical Manifestations</p>
            <h1 className="text-3xl sm:text-5xl font-serif italic text-white mb-8">The Storehouse</h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8"></div>
            <p className="text-sm font-light text-secondary max-w-2xl mx-auto leading-relaxed">
              Premium softcover chapbooks and bound manuscripts from the Signal Collection {"\u2014"} printed and shipped <span className="text-white">within India only</span>. International editions via print-on-demand coming soon.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {storeProducts.map((product) => {
              const isSecured = Array.isArray(securedOrders) && securedOrders.includes(product.id)
              return (
                <div key={product.id} className="group border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.01] overflow-hidden transition-all duration-500 flex flex-col justify-between">
                  <div className="aspect-[4/5] bg-bg relative overflow-hidden flex items-center justify-center p-5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                    <img src={product.coverImage} alt={product.title} className="relative z-0 w-[82%] object-cover shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 bg-black/85 border border-white/15 text-[10px] tracking-[0.15em] uppercase text-white rounded font-mono font-medium shadow-lg">
                      {"\u20B9"}{product.priceInr} INR
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif italic mb-2">{product.title}</h3>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-secondary mb-6">{product.subtitle}</p>
                      <p className="text-sm font-light text-secondary/70 mb-8 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    {isSecured ? (
                      <button 
                        disabled
                        className="w-full py-4 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-sm text-[10px] tracking-[0.3em] uppercase transition-all duration-300 font-medium"
                      >
                        {"\u2713"} Artifact Secured
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOrderProduct(product)}
                        className="w-full py-4 border border-white/10 hover:border-white/40 bg-white/[0.02] hover:bg-white/5 text-white rounded-sm text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
                      >
                        Order Chapbook
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* View: Transcoder */}
      {page === "transcoder" && (
        <Transcoder 
          onOpenBook={(book) => {
            handleSelectBook(book)
          }} 
          theme={theme}
        />
      )}

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.2em] text-secondary uppercase">
          <div className="flex gap-8">
            <a href="https://github.com/habibixyz/Absconded" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-secondary/50">
            Absconded by VYRM {"\u00B7"} {"\u00A9"} 2026 {"\u00B7"} Tanvir Khan
          </div>
        </div>
      </footer>

      {/* Bookmarks Drawer Modal */}
      <BookmarksDrawer
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={handleSelectBookmark}
        onDeleteBookmark={handleDeleteBookmark}
      />

      {/* Floating Bookmark Toast Notification */}
      {bookmarkToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] px-6 py-3 bg-bg/95 border border-white/20 rounded-full text-[9px] tracking-[0.25em] uppercase text-white shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2 font-mono">
          <span className="text-emerald-400">✦</span>
          <span>{bookmarkToast}</span>
        </div>
      )}
    </main>

      {/* Checkout Modal — outside <main> to avoid stacking context trap */}
      {checkoutProduct && (
        <div
          className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setCheckoutProduct(null) }}
        >
          <div className="relative w-full sm:max-w-md bg-bg border border-white/10 rounded-t-xl sm:rounded shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overscroll-contain">
            <button
              onClick={() => setCheckoutProduct(null)}
              className="absolute top-4 right-4 text-secondary hover:text-white transition-colors text-base p-2 z-30"
              aria-label="Close Checkout"
            >
              {"\u2715"}
            </button>

            {/* Scrollable Content Container */}
            <div className="p-5 sm:p-8 overflow-y-auto flex-grow overscroll-contain">
              {/* Product Header Summary */}
              <div className="flex gap-4 pb-5 border-b border-white/5 mb-5">
                <img src={checkoutProduct.coverImage} className="w-10 h-14 object-cover shadow border border-white/10 flex-shrink-0" alt="" />
                <div>
                  <h4 className="font-serif italic text-base text-white">{checkoutProduct.title}</h4>
                  <p className="text-[9px] tracking-[0.2em] text-secondary uppercase">{checkoutProduct.subtitle}</p>
                  <p className="text-[10px] text-white/80 mt-1 font-mono">
                    {"\u20B9"}{checkoutProduct.priceInr} INR
                  </p>
                </div>
              </div>

              {/* Step 1: Shipping Details */}
              {checkoutStep === 1 && (
                <div className="space-y-4 fade-in">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-6">Step 1: Shipping Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[8px] tracking-[0.2em] uppercase text-secondary">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={shippingInfo.name}
                        onChange={handleShippingChange}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[8px] tracking-[0.2em] uppercase text-secondary">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[8px] tracking-[0.2em] uppercase text-secondary">Shipping Address</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="123 Scriptorium Way"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-[0.2em] uppercase text-secondary">City</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Mumbai"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-[0.2em] uppercase text-secondary">State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="MH"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-[0.2em] uppercase text-secondary">ZIP / PIN Code</label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="400001"
                        value={shippingInfo.zip}
                        onChange={handleShippingChange}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder:text-secondary/40 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-[0.2em] uppercase text-secondary">Country</label>
                      <select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="w-full mt-1.5 bg-bg border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      >
                        <option value="IN">India (Razorpay Supported)</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (shippingInfo.name && shippingInfo.email && shippingInfo.address && shippingInfo.city) {
                        setCheckoutStep(2)
                      }
                    }}
                    className="w-full mt-6 py-3 bg-white text-bg hover:bg-white/90 rounded text-[10px] tracking-[0.3em] uppercase transition-all duration-300 font-medium"
                  >
                    Continue to Review {"\u2192"}
                  </button>
                </div>
              )}

              {/* Step 2: Order Review */}
              {checkoutStep === 2 && (
                <div className="space-y-6 fade-in">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-6">Step 2: Review Your Order</h3>
                  <div className="space-y-3 text-xs text-secondary/80 font-mono bg-white/[0.02] border border-white/5 rounded p-4">
                    <p><span className="text-white">SHIP TO:</span> {shippingInfo.name}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                    <p><span className="text-white">EMAIL:</span> {shippingInfo.email}</p>
                    <p><span className="text-white">AMOUNT:</span> {"\u20B9"}{checkoutProduct.priceInr} INR</p>
                    <p><span className="text-white">DELIVERY:</span> India only {"\u00B7"} 4{"\u2013"}5 days print + 4{"\u2013"}5 days ship</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 py-3 border border-white/10 hover:border-white/30 rounded text-[10px] tracking-[0.2em] uppercase transition-all"
                    >
                      {"\u2190"} Back
                    </button>
                    <button
                      onClick={() => setCheckoutStep(3)}
                      className="flex-1 py-3 bg-white text-bg hover:bg-white/90 rounded text-[10px] tracking-[0.3em] uppercase transition-all font-medium"
                    >
                      Proceed to Pay {"\u2192"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {checkoutStep === 3 && (
                <div className="space-y-6 fade-in">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-4">Step 3: Secure Payment</h3>
                  <div className="space-y-3 text-xs text-secondary/70 leading-relaxed border border-white/5 rounded p-4 bg-white/[0.02]">
                    <p>We are opening a secure payment portal in a new tab to complete your transaction for <span className="text-white">{checkoutProduct.title}</span>.</p>
                    <p>{"\u2022"} <span className="text-white">Amount:</span> {"\u20B9"}{checkoutProduct.priceInr}</p>
                    <p>{"\u2022"} <span className="text-white">Delivery:</span> 4{"\u2013"}5 days printing + 4{"\u2013"}5 days shipping (India only)</p>
                    <p>{"\u2022"} <span className="text-white">Confirmation:</span> Email sent after payment</p>
                  </div>
                  <button
                    className="w-full py-3.5 bg-white text-bg hover:bg-white/90 rounded text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-300 active:scale-95"
                    onClick={() => {
                      window.open(checkoutProduct.paymentLink, '_blank')
                      setCheckoutStep(4)
                    }}
                  >
                    Pay {"\u20B9"}{checkoutProduct.priceInr} via Razorpay {"\u2192"}
                  </button>
                  <button
                    onClick={() => setCheckoutProduct(null)}
                    className="w-full py-2 text-[9px] tracking-[0.2em] uppercase text-secondary/50 hover:text-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {checkoutStep === 4 && (
                <div className="space-y-6 fade-in text-center py-4">
                  <div className="text-3xl mb-2">{"\u2726"}</div>
                  <h3 className="text-base font-serif italic text-white">Order Initiated</h3>
                  <div className="space-y-2 text-xs text-secondary/70 font-mono text-left border border-white/5 rounded p-4 bg-white/[0.02]">
                    <p><span className="text-white">ITEM:</span> {checkoutProduct.title}</p>
                    <p><span className="text-white">STATUS:</span> Payment portal opened</p>
                    <p><span className="text-white">NEXT:</span> Complete payment in the Razorpay tab</p>
                    <p><span className="text-white">EMAIL:</span> Confirmation sent after payment</p>
                    <p><span className="text-white">DELIVERY:</span> 4{"\u2013"}5 days print + 4{"\u2013"}5 days ship</p>
                  </div>
                  <button
                    className="w-full mt-6 py-3 bg-white text-bg hover:bg-white/90 rounded text-[10px] tracking-[0.3em] uppercase transition-all duration-300 font-medium"
                    onClick={() => setCheckoutProduct(null)}
                  >
                    Return to Storehouse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Floating Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[75] flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 hover:border-white hover:bg-white hover:text-black text-white shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300 group cursor-pointer ${
          showScrollTop ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
        title="Instantly return to top of page"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-mono font-medium pr-0.5">Top</span>
      </button>
    </>
  )
}

