'use client'

import { useState, useEffect } from 'react'
import { manuscripts } from './data/manuscripts'

export default function Home() {
  const [view, setView] = useState('library') // 'library', 'book', 'signals'
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [showCover, setShowCover] = useState(true)

  const signals = [
    { id: 1, type: 'CORE', date: '2026.05.15', text: 'Integrating "The Mask Beneath" into the Signal Collection. Data architecture migration complete.' },
    { id: 2, type: 'LORE', date: '2026.05.14', text: 'The Vyrm organism is showing signs of autonomous identity formation in the latest simulation.' },
    { id: 3, type: 'BUILD', date: '2026.05.12', text: 'Android APK build 1.0.4 confirmed stable for mobile manuscript consumption.' },
    { id: 4, type: 'SIGNAL', date: '2026.05.10', text: 'The boundary between builder and creation is thinning. Every line of code is a confession.' },
    { id: 5, type: 'CORE', date: '2026.05.08', text: 'Absconded library initialized. Preparing for the multi-book era.' }
  ]

  const handleBookSelect = (book) => {
    setSelectedBook(book)
    setView('book')
    setShowCover(true)
    setSelectedSection(null)
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    if (!selectedSection || !selectedBook) return
    const currentIndex = selectedBook.sections.findIndex(s => s.id === selectedSection.id)
    if (currentIndex < selectedBook.sections.length - 1) {
      setSelectedSection(selectedBook.sections[currentIndex + 1])
      window.scrollTo(0, 0)
    } else {
      setSelectedSection(null)
      setShowCover(true)
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text selection:bg-white/10 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <button 
            onClick={() => { setView('library'); setSelectedBook(null); }}
            className="text-[10px] tracking-[0.3em] uppercase font-light hover:text-accent transition-colors"
          >
            Absconded Library
          </button>
          <div className="flex gap-8 items-center">
            <button 
              onClick={() => { setView('library'); setSelectedBook(null); }}
              className={`nav-link ${view === 'library' ? 'text-white' : 'text-secondary'}`}
            >
              Shelf
            </button>
            <button 
              onClick={() => { setView('signals'); setSelectedBook(null); }}
              className={`nav-link ${view === 'signals' ? 'text-white' : 'text-secondary'}`}
            >
              Signals
            </button>
            <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="nav-link">
              Twitter
            </a>
          </div>
        </div>
      </nav>

      {/* Library View */}
      {view === 'library' && (
        <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto fade-in">
          <header className="mb-20">
            <h1 className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Digital Manuscript Library</h1>
            <p className="text-4xl serif italic">The Signal Collection</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {manuscripts.map((book) => (
              <div 
                key={book.id}
                onClick={() => handleBookSelect(book)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-sm border border-white/5 transition-all duration-700 group-hover:border-white/20 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.03)]">
                  <img 
                    src={book.id === 'absconded' ? '/absconded-cover.png' : '/mask-cover.png'} 
                    alt={book.title}
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-[1.01] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h2 className="text-3xl serif italic mb-2">{book.title}</h2>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-secondary">{book.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm font-light text-secondary leading-relaxed max-w-md">
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
            <h1 className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Real-time Builder Activity</h1>
            <p className="text-4xl serif italic">The Signal Feed</p>
          </header>
          
          <div className="space-y-12">
            {signals.map((signal) => (
              <div key={signal.id} className="relative pl-8 border-l border-white/10 group">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-white/20 group-hover:bg-accent transition-colors" />
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[8px] tracking-[0.2em] font-mono text-accent">{signal.type}</span>
                  <span className="text-[8px] tracking-[0.2em] font-mono text-secondary">{signal.date}</span>
                </div>
                <p className="text-sm font-light leading-relaxed group-hover:text-white transition-colors">
                  {signal.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-32 p-12 border border-white/5 rounded-sm bg-white/5 flex flex-col items-center text-center">
            <div className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-6 italic">Collector's Status</div>
            <p className="text-xl serif italic mb-8 italic">Own a piece of the evolution.</p>
            <button className="px-12 py-4 border border-white/10 text-[9px] tracking-[0.4em] uppercase hover:bg-white hover:text-bg transition-all duration-500">
              Enter Storehouse
            </button>
          </div>
        </section>
      )}

      {/* Cover Page */}
      {showCover && view === 'book' && selectedBook && (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20 fade-in">
          <div className="text-center max-w-2xl">
            <h1 className="text-6xl md:text-8xl serif italic mb-6 tracking-tight">
              {selectedBook.title}
            </h1>
            <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-16">
              A Builder's Evolution
            </p>
            
            <div className="mb-20 space-y-4 text-secondary font-light leading-relaxed">
              <p>"Disappearing is easy. Becoming is the hard part."</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowCover(false)}
                className="px-12 py-4 border border-white/10 hover:border-white/40 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
              >
                Begin Reading
              </button>
              
              <a 
                href="/absconded.apk" 
                download 
                className="px-12 py-4 border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/40 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500 flex items-center gap-2"
              >
                <span>Download Android App</span>
                <span className="text-xs">↓</span>
              </a>
            </div>

            <div className="mt-32 text-[9px] tracking-[0.2em] text-secondary/50 uppercase">
              Mumbai / Twenty-Twenty-Six
            </div>
          </div>
        </section>
      )}

      {/* Index / Contents */}
      {view === 'book' && selectedBook && !showCover && !selectedSection && (
        <section className="pt-40 pb-20 px-6 max-w-2xl mx-auto fade-in">
          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary mb-16">Manuscript Index</h2>
          <div className="space-y-2">
            {selectedBook.sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className="chapter-card cursor-pointer group"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-[10px] font-light text-secondary group-hover:text-accent transition-colors">
                    {section.number === 0 || section.number === 11 ? '★' : String(section.number).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl serif group-hover:italic transition-all duration-300">
                    {section.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-32 flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-1000">
            <img src="/author.png" className="w-12 h-12 rounded-full grayscale object-cover" alt="Author" />
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.3em] uppercase text-secondary">Author</span>
              <span className="text-sm serif italic">Tanvir Khan</span>
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
              <h1 className="text-4xl md:text-5xl serif italic leading-tight">
                {selectedSection.title}
              </h1>
            </header>

            <article className="book-text serif">
              <div className="text-secondary italic text-center mb-16 px-8 leading-relaxed">
                "{selectedSection.epigraph}"
              </div>
              
              <div className="space-y-10">
                {selectedSection.content.map((block, i) => {
                  if (block.type === 'p') {
                    return <p key={i} className={i === 0 ? 'drop-cap' : ''}>{block.text}</p>
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
                      <div key={i} className="pt-20 flex flex-col items-center">
                        <img 
                          src="/author.png" 
                          alt="Tanvir Khan" 
                          className="w-32 h-32 object-cover grayscale brightness-110 opacity-70 rounded-full mb-6 filter blur-[0.3px] hover:opacity-100 hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="text-[10px] tracking-[0.4em] uppercase text-secondary">
                          Tanvir Khan
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
              
              <div className="mt-32 pt-20 border-t border-white/5 text-center">
                <button 
                  onClick={handleNext}
                  className="group flex flex-col items-center gap-6 mx-auto"
                >
                  <span className="text-[10px] tracking-[0.4em] uppercase text-secondary group-hover:text-accent transition-colors">
                    {selectedSection.number === selectedBook.sections.length - 1 ? 'End of Manuscript' : 'Continue Evolution'}
                  </span>
                  <div className="text-4xl serif italic group-hover:gap-8 transition-all duration-500 flex items-center gap-4">
                    <span>{selectedSection.number === selectedBook.sections.length - 1 ? 'Return Home' : 'Next Chapter'}</span>
                    <span className="text-2xl group-hover:translate-x-4 transition-transform">→</span>
                  </div>
                </button>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-12">
            <div>
              <h3 className="text-lg serif italic mb-4">How do I install the Android App?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                After downloading the APK, open it on your phone. You may need to enable "Install from Unknown Sources" in your security settings. This is a standard procedure for apps not distributed through the Play Store.
              </p>
            </div>
            <div>
              <h3 className="text-lg serif italic mb-4">Is the app free?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                Yes. The manuscript is a digital artifact meant to be shared. The app provides a more immersive, focused reading experience away from the distractions of a browser.
              </p>
            </div>
            <div>
              <h3 className="text-lg serif italic mb-4">What is 'Absconded' about?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                It's a meditation on the builder's journey—the transition from a traditional career to an internet-native existence. It's about Mumbai, crypto, AI, and the process of becoming.
              </p>
            </div>
            <div>
              <h3 className="text-lg serif italic mb-4">Who is Tanvir Khan?</h3>
              <p className="text-sm font-light text-secondary leading-relaxed">
                A builder from Mumbai who spent years in the traditional supply chain before unravelling into the digital frontier. This manuscript is his signal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.2em] text-secondary uppercase">
          <div className="flex gap-8">
            <a href="https://github.com/habibixyz/Absconded" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter</a>
          </div>
          <div>
            Absconded / © 2026
          </div>
        </div>
      </footer>
    </main>
  )
}
