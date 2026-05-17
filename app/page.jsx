'use client'

import { useState, useEffect, useRef } from 'react'
import { manuscripts } from './data/manuscripts'

function ReadingProgress({ content }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      if (scrollHeight > 0) setProgress((scrollTop / scrollHeight) * 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed left-0 right-0 z-[60] h-[2px] bg-white/5" style={{ top: 'var(--safe-area-top, 0px)' }}>
      <div
        className="h-full bg-white/40 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function estimateReadTime(content) {
  if (!content) return '< 1 min'
  const words = content.map(b => b.text || '').join(' ').split(/\s+/).length
  const mins = Math.ceil(words / 220)
  return `${mins} min read`
}

export default function Home() {
  const [view, setView] = useState('library')
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [showCover, setShowCover] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // Automatically reset scroll position to top on navigation/view change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view, selectedBook, selectedSection, showCover])

  const filteredManuscripts = manuscripts.filter((book) => {
    if (activeTab === 'all') return true
    if (activeTab === 'manuscripts') return book.type === 'manuscript'
    if (activeTab === 'shorts') return book.type === 'short-story'
    return true
  })

  const signals = [
    { id: 1, type: 'CORE', date: '2026.05.17', text: 'Three cyber-existential short stories integrated: "The Frequency of Kin", "The Mask Compiler", and "The Last Performance Review" are now fully readable.' },
    { id: 2, type: 'BUILD', date: '2026.05.17', text: 'SEO and discoverability upgrade completed: Robots rules, absolute Google Bot indexes, and sitemap.xml generated and pushed to production.' },
    { id: 3, type: 'UI', date: '2026.05.16', text: 'Standalone FAQ interface (The Library Codex) designed and decoupled from the layout footer. Scroll transitions stabilized to guarantee top-of-page focus.' },
    { id: 4, type: 'CORE', date: '2026.05.15', text: 'Integrating "The Mask Beneath" into the Signal Collection. Data architecture migration complete.' },
    { id: 5, type: 'LORE', date: '2026.05.14', text: 'The Vyrm organism is showing signs of autonomous identity formation in the latest simulation.' },
    { id: 6, type: 'BUILD', date: '2026.05.12', text: 'Android APK build 1.0.4 confirmed stable for mobile manuscript consumption.' },
    { id: 7, type: 'SIGNAL', date: '2026.05.10', text: 'The boundary between builder and creation is thinning. Every line of code is a confession.' },
    { id: 8, type: 'CORE', date: '2026.05.08', text: 'Absconded library initialized. Preparing for the multi-book era.' }
  ]

  const navigate = (fn) => {
    setTransitioning(true)
    setTimeout(() => {
      fn()
      setTransitioning(false)
      window.scrollTo(0, 0)
    }, 280)
  }

  const handleBookSelect = (book) => {
    navigate(() => {
      setSelectedBook(book)
      setView('book')
      setShowCover(true)
      setSelectedSection(null)
    })
  }

  const handleNext = () => {
    if (!selectedSection || !selectedBook) return
    const currentIndex = selectedBook.sections.findIndex(s => s.id === selectedSection.id)
    navigate(() => {
      if (currentIndex < selectedBook.sections.length - 1) {
        setSelectedSection(selectedBook.sections[currentIndex + 1])
      } else {
        setSelectedSection(null)
        setShowCover(true)
      }
    })
  }

  const goHome = () => {
    navigate(() => {
      setView('library')
      setSelectedBook(null)
      setSelectedSection(null)
    })
  }

  const goToShelf = () => {
    navigate(() => {
      setView('library')
      setSelectedBook(null)
    })
  }

  const goToSignals = () => {
    navigate(() => {
      setView('signals')
      setSelectedBook(null)
    })
  }

  const goToFaq = () => {
    navigate(() => {
      setView('faq')
      setSelectedBook(null)
    })
  }

  const getSectionProgress = () => {
    if (!selectedBook || !selectedSection) return null
    const idx = selectedBook.sections.findIndex(s => s.id === selectedSection.id)
    return { current: idx + 1, total: selectedBook.sections.length }
  }

  const isReading = view === 'book' && selectedSection

  return (
    <main className={`min-h-screen bg-bg text-text transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
      {isReading && <ReadingProgress content={selectedSection.content} />}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <button
            onClick={goHome}
            className="text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.3em] uppercase font-light hover:text-white transition-colors duration-300 text-secondary whitespace-nowrap"
          >
            Absconded<span className="hidden sm:inline"> Library</span>
          </button>

          {/* Breadcrumb for reading view */}
          {isReading && selectedBook && (
            <div className="hidden md:flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase text-secondary">
              <span>{selectedBook.title}</span>
              <span className="text-white/20">·</span>
              <span className="text-white">{selectedSection.title}</span>
              {getSectionProgress() && (
                <>
                  <span className="text-white/20">·</span>
                  <span>{getSectionProgress().current} / {getSectionProgress().total}</span>
                </>
              )}
            </div>
          )}

          <div className="flex gap-4 sm:gap-8 items-center">
            <button
              onClick={goToShelf}
              className={`nav-link ${view === 'library' ? 'text-white' : 'text-secondary'}`}
            >
              Shelf
            </button>
            <button
              onClick={goToSignals}
              className={`nav-link ${view === 'signals' ? 'text-white' : 'text-secondary'}`}
            >
              Signals
            </button>
            <button
              onClick={goToFaq}
              className={`nav-link ${view === 'faq' ? 'text-white' : 'text-secondary'}`}
            >
              FAQ
            </button>
            <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="nav-link text-secondary">
              Twitter
            </a>
          </div>
        </div>
      </nav>

      {/* Library View */}
      {view === 'library' && (
        <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto fade-in">
          <header className="mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Digital Manuscript Library</p>
            <h1 className="text-4xl font-serif italic">The Signal Collection</h1>
          </header>

          {/* Format filtering tabs */}
          <div className="flex gap-8 mb-16 border-b border-white/5 pb-4">
            {['all', 'manuscripts', 'shorts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] tracking-[0.3em] uppercase transition-all duration-300 relative pb-4 -mb-[17px] ${
                  activeTab === tab ? 'text-white font-medium' : 'text-secondary hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Signals' : tab === 'manuscripts' ? 'Manuscripts' : 'Short Stories'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white animate-fade-in" />
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {filteredManuscripts.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookSelect(book)}
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
                  {/* Format & Reading time badge */}
                  <div className="absolute top-6 right-6 flex gap-2">
                    <span className="text-[8px] tracking-[0.2em] uppercase text-secondary/80 border border-white/10 px-3 py-1 bg-bg/60 backdrop-blur-sm">
                      {book.type === 'manuscript' ? 'Manuscript' : 'Short Story'}
                    </span>
                    {book.readingTime && (
                      <span className="text-[8px] tracking-[0.2em] uppercase text-secondary/60 border border-white/10 px-3 py-1 bg-bg/60 backdrop-blur-sm">
                        {book.readingTime}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm font-light text-secondary leading-relaxed">
                  {book.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Signal Feed View */}
      {view === 'signals' && (
        <section className="pt-40 pb-20 px-6 max-w-2xl mx-auto fade-in">
          <header className="mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Real-time Builder Activity</p>
            <h1 className="text-4xl font-serif italic">The Signal Feed</h1>
          </header>

          <div className="space-y-12">
            {signals.map((signal) => (
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

      {/* Cover Page — fully dynamic per book */}
      {showCover && view === 'book' && selectedBook && (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20 fade-in">
          <div className="text-center max-w-2xl">
            <p className="text-[9px] tracking-[0.4em] uppercase text-secondary mb-10">
              {selectedBook.subtitle}
            </p>
            <h1 className="text-6xl md:text-8xl font-serif italic mb-8 tracking-tight leading-none">
              {selectedBook.title}
            </h1>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-12" />

            <div className="mb-16 text-secondary font-light leading-relaxed font-serif italic text-lg">
              {selectedBook.coverQuote || `"The beginning is always today."`}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowCover(false)}
                className="px-12 py-4 border border-white/10 hover:border-white/40 hover:bg-white/5 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
              >
                Begin Reading
              </button>

              <a
                href="https://drive.google.com/file/d/12UaSwZ9HLP5TTy57NwitxPJ1AHvsNLvL/view?usp=sharing"
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

      {/* Index / Contents */}
      {view === 'book' && selectedBook && !showCover && !selectedSection && (
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
            {selectedBook.sections.map((section, i) => (
              <div
                key={section.id}
                onClick={() => navigate(() => setSelectedSection(section))}
                className="chapter-card cursor-pointer group"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-[10px] font-light text-secondary group-hover:text-white/40 transition-colors">
                      {section.id === 'prologue' || section.id === 'epilogue' || section.id === 'author-note' ? '★' : String(section.number).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl font-serif group-hover:italic transition-all duration-300">
                      {section.title}
                    </h3>
                  </div>
                  <span className="text-[8px] tracking-[0.15em] text-secondary/40 uppercase shrink-0">
                    {estimateReadTime(section.content)}
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

      {/* Section View */}
      {view === 'book' && selectedBook && selectedSection && (
        <section className="pt-40 pb-32 px-6 fade-in">
          <div className="book-container">
            <header className="mb-20 text-center">
              <div className="text-[10px] tracking-[0.3em] text-secondary mb-4 uppercase">
                {selectedSection.label}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif italic leading-tight">
                {selectedSection.title}
              </h1>
              <div className="mt-4 text-[9px] tracking-[0.2em] text-secondary/40 uppercase">
                {estimateReadTime(selectedSection.content)}
              </div>
            </header>

            <article className="book-text font-serif">
              {selectedSection.epigraph && (
                <div className="text-secondary italic text-center mb-16 px-8 leading-relaxed">
                  &ldquo;{selectedSection.epigraph}&rdquo;
                </div>
              )}

              <div className="space-y-10">
                {selectedSection.content.map((block, i) => {
                  if (block.type === 'p') {
                    return <p key={i} className={i === 0 || (i === 1 && selectedSection.epigraph) ? 'drop-cap' : ''}>{block.text}</p>
                  }
                  if (block.type === 'twist') {
                    return (
                      <div key={i} className="twist-block">
                        <span>↳</span>
                        <span>{block.text}</span>
                      </div>
                    )
                  }
                  if (block.type === 'pull') {
                    return (
                      <div key={i} className="pull-quote">
                        {block.text}
                      </div>
                    )
                  }
                  if (block.type === 'terminal') {
                    return (
                      <div key={i} className="terminal-block">
                        {block.text}
                      </div>
                    )
                  }
                  if (block.type === 'portrait') {
                    return (
                      <div key={i} className="pt-20 flex flex-col items-center gap-6">
                        <img
                          src="/author.png"
                          alt="Tanvir Khan"
                          className="w-32 h-32 object-cover grayscale brightness-110 opacity-70 rounded-full filter blur-[0.3px] hover:opacity-100 hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-[10px] tracking-[0.4em] uppercase text-secondary">
                            Tanvir Khan
                          </div>
                          <div className="text-[9px] tracking-[0.2em] text-secondary/40 uppercase">
                            Mumbai · 2026
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              {/* Navigation Footer */}
              <div className="mt-32 pt-16 border-t border-white/5">
                <div className="flex items-center justify-between gap-8">
                  {/* Back to index */}
                  <button
                    onClick={() => navigate(() => setSelectedSection(null))}
                    className="text-[9px] tracking-[0.3em] uppercase text-secondary hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>←</span> Index
                  </button>

                  {/* Next chapter */}
                  <button
                    onClick={handleNext}
                    className="group flex flex-col items-end gap-3"
                  >
                    <span className="text-[9px] tracking-[0.3em] uppercase text-secondary group-hover:text-white transition-colors">
                      {getSectionProgress()?.current === selectedBook.sections.length
                        ? 'End of Manuscript'
                        : 'Continue'}
                    </span>
                    <div className="text-2xl font-serif italic group-hover:gap-6 transition-all duration-500 flex items-center gap-3">
                      <span>
                        {getSectionProgress()?.current === selectedBook.sections.length
                          ? 'Return Home'
                          : selectedBook.sections[selectedBook.sections.findIndex(s => s.id === selectedSection.id) + 1]?.title || 'Finish'}
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

      {/* FAQ View */}
      {view === 'faq' && (
        <section className="pt-40 pb-20 px-6 max-w-2xl mx-auto fade-in">
          <header className="mb-20 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Frequently Asked Questions</p>
            <h1 className="text-4xl font-serif italic text-white mb-4">The Library Codex</h1>
          </header>

          <div className="space-y-12">
            <div>
              <h3 className="text-lg font-serif italic mb-4">How do I install the Android App?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                Download the APK and open it on your Android phone. You'll need to enable "Install from Unknown Sources" in your security settings — standard for any app outside the Play Store. Takes about 30 seconds.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif italic mb-4">Is it free?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                Always. The manuscript is meant to be read, shared, and felt. The app just makes that experience more immersive — no browser chrome, no distractions, just the words.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif italic mb-4">What is Absconded actually about?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                It's about the quiet act of leaving — a corporate timeline, a version of yourself that no longer fits. Set in Mumbai, it traces a builder's journey through crypto, AI, and the strange courage it takes to become someone new.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif italic mb-4">Who is Tanvir Khan?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                A builder from Mumbai. Spent years inside the traditional supply chain machine before quietly absconding into the internet. This library is what he found on the other side.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.2em] text-secondary uppercase">
          <div className="flex gap-8">
            <a href="https://github.com/habibixyz/Absconded" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
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
