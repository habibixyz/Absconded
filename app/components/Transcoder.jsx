'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { CLASSICS_CATALOG } from './classicsCatalog'

export default function Transcoder({ onOpenBook, theme }) {
  const [activeTab, setActiveTab] = useState("explore") // "explore", "upload", "saved"
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [remoteResults, setRemoteResults] = useState([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loadingBookId, setLoadingBookId] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [savedBooks, setSavedBooks] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Load saved imported books from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("absconded-custom-books")
      if (stored) {
        setSavedBooks(JSON.parse(stored))
      }
    } catch (e) {
      console.warn("Failed to load custom books", e)
    }
  }, [])

  // Save book into local storage archive
  const persistCustomBook = (book) => {
    try {
      const stored = localStorage.getItem("absconded-custom-books")
      const list = stored ? JSON.parse(stored) : []
      const updated = [book, ...list.filter(b => b.id !== book.id)].slice(0, 40)
      localStorage.setItem("absconded-custom-books", JSON.stringify(updated))
      setSavedBooks(updated)
    } catch (e) {
      console.warn("LocalStorage save error", e)
    }
  }

  // Delete saved book
  const handleDeleteCustomBook = (bookId, e) => {
    e.stopPropagation()
    const updated = savedBooks.filter(b => b.id !== bookId)
    setSavedBooks(updated)
    localStorage.setItem("absconded-custom-books", JSON.stringify(updated))
  }

  // Instant 0ms client-side search across the catalog
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = CLASSICS_CATALOG

    if (categoryFilter !== "all") {
      list = list.filter(item => item.category === categoryFilter)
    }

    if (!q) return list

    return list.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.coverTag && item.coverTag.toLowerCase().includes(q)) ||
      (item.year && item.year.toLowerCase().includes(q))
    )
  }, [searchQuery, categoryFilter])

  // Optional background deep search across 70,000+ Gutenberg books via API
  const handleDeepSearch = async (e) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    setStatusMessage(`Searching extended public domain archive for "${searchQuery}"...`)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000)

      let data = null
      try {
        const localApiRes = await fetch(`/api/transcode?search=${encodeURIComponent(searchQuery.trim())}`, {
          signal: controller.signal
        })
        if (localApiRes.ok) {
          data = await localApiRes.json()
        }
      } catch (err) {}

      clearTimeout(timeoutId)

      const results = (data && data.results) ? data.results : []
      const formatted = results.slice(0, 18).map(item => {
        const author = item.authors?.[0]?.name ? item.authors[0].name.split(',').reverse().join(' ').trim() : 'Unknown Author'
        const coverImg = item.formats?.['image/jpeg'] || null
        
        return {
          id: `gutenberg-${item.id}`,
          gutenbergId: item.id,
          title: item.title,
          author: author,
          subjects: item.subjects?.slice(0, 2).join(', ') || 'Literature',
          downloadCount: item.download_count || 0,
          coverImage: coverImg,
          readingTime: "Classic Manuscript",
          coverTag: "Gutenberg Archive"
        }
      })

      // Filter out duplicates that already exist in filteredCatalog
      const uniqueRemote = formatted.filter(r => !CLASSICS_CATALOG.some(c => c.gutenbergId === r.gutenbergId))
      setRemoteResults(uniqueRemote)

      if (filteredCatalog.length === 0 && uniqueRemote.length === 0) {
        setStatusMessage("No matching manuscripts found. Try searching for other authors (e.g. 'Tolstoy', 'Kafka', 'Plato') or titles.")
      } else {
        setStatusMessage(`Found ${filteredCatalog.length + uniqueRemote.length} manuscripts.`)
      }
    } catch (err) {
      console.warn("Deep search error:", err)
      setStatusMessage(`Found ${filteredCatalog.length} manuscripts in instant catalog.`)
    } finally {
      setSearching(false)
    }
  }

  // Parse raw text into Absconded Chapter & Section Structure
  const parseRawTextToBook = (rawText, title, author = "Public Domain Archive") => {
    let cleanText = rawText
    const startIdx = cleanText.search(/\*\*\* START OF (THE|THIS) PROJECT GUTENBERG/i)
    if (startIdx !== -1) {
      const endHeaderIdx = cleanText.indexOf('\n', startIdx)
      cleanText = cleanText.substring(endHeaderIdx + 1)
    }
    const endIdx = cleanText.search(/\*\*\* END OF (THE|THIS) PROJECT GUTENBERG/i)
    if (endIdx !== -1) {
      cleanText = cleanText.substring(0, endIdx)
    }

    const lines = cleanText.split(/\r?\n/)
    const chapters = []
    let currentChapter = {
      id: "chapter-1",
      number: 1,
      label: "Chapter One",
      title: "Inception",
      epigraph: "",
      content: []
    }

    let currentParagraph = []
    const chapterRegex = /^(?:CHAPTER|Chapter|BOOK|Book|PART|Part|ACT|Act|SCENE|Scene|SECTION|Section|LETTER|Letter|STAVE|Stave)\s+([IVXLCDM0-9]+)?(?:\s*[:.\-—]\s*(.*))?$/i
    let chapterCount = 0

    const pushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ").trim()
        if (text.length > 0) {
          if (text.length < 140 && (text.startsWith('"') || text.startsWith('“') || text.endsWith('"') || text.endsWith('”'))) {
            currentChapter.content.push({ type: "pull", text })
          } else {
            currentChapter.content.push({ type: "p", text })
          }
        }
        currentParagraph = []
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (!line) {
        pushParagraph()
        continue
      }

      const match = line.match(chapterRegex)
      if (match || (line.length < 40 && line.toUpperCase() === line && line.length > 3 && !line.includes('.'))) {
        pushParagraph()
        if (currentChapter.content.length > 0) {
          chapters.push(currentChapter)
          chapterCount++
          currentChapter = {
            id: `chapter-${chapterCount + 1}`,
            number: chapterCount + 1,
            label: `Chapter ${chapterCount + 1}`,
            title: line.replace(/^[#\s*]+/, '').trim() || `Chapter ${chapterCount + 1}`,
            epigraph: "",
            content: []
          }
          continue
        } else {
          currentChapter.title = line
          continue
        }
      }

      currentParagraph.push(line)
    }

    pushParagraph()
    if (currentChapter.content.length > 0) {
      chapters.push(currentChapter)
    }

    // If no chapters detected or only 1 huge chapter, chunk into readable ~1,200 word sections
    if (chapters.length <= 1 && (chapters[0]?.content?.length || 0) > 25) {
      const allContent = chapters[0]?.content || []
      const chunked = []
      const chunkSize = 20
      for (let i = 0; i < allContent.length; i += chunkSize) {
        const partNum = Math.floor(i / chunkSize) + 1
        chunked.push({
          id: `section-${partNum}`,
          number: partNum,
          label: `Section ${String(partNum).padStart(2, '0')}`,
          title: partNum === 1 ? "Inception" : `Part ${partNum}`,
          epigraph: "",
          content: allContent.slice(i, i + chunkSize)
        })
      }
      return {
        id: `book-${Date.now()}`,
        type: "manuscript",
        title: title || "Transcoded Manuscript",
        subtitle: `Archived by ${author}`,
        coverQuote: `"Language is the ultimate protocol."`,
        readingTime: `${Math.ceil(allContent.length * 45 / 60)} min`,
        description: `Imported manuscript by ${author}. Transcoded for distraction-free synthesis.`,
        sections: chunked
      }
    }

    return {
      id: `book-${Date.now()}`,
      type: "manuscript",
      title: title || "Transcoded Manuscript",
      subtitle: `Archived by ${author}`,
      coverQuote: `"Transcoded directly into the Signal Archive."`,
      readingTime: `${Math.max(15, chapters.length * 8)} min`,
      description: `Manuscript containing ${chapters.length} chapters by ${author}.`,
      sections: chapters.length > 0 ? chapters : [{
        id: "section-1",
        number: 1,
        label: "Manuscript",
        title: title || "Text",
        content: [{ type: "p", text: rawText }]
      }]
    }
  }

  // Load and Transcode a Gutenberg public domain book by ID
  const handleLoadGutenberg = async (item) => {
    setLoadingBookId(item.id)
    setStatusMessage(`Transcoding "${item.title}" into Signal Reader...`)

    try {
      const gutenbergId = item.gutenbergId
      let rawText = ""

      // 1. Primary: Server-side Next.js route (zero CORS issues)
      try {
        const apiRes = await fetch(`/api/transcode?id=${gutenbergId}`)
        if (apiRes.ok) {
          rawText = await apiRes.text()
        }
      } catch (e) {
        console.warn("Local API transcode route bypassed:", e)
      }

      // 2. Secondary fallback: direct public mirrors
      if (!rawText || rawText.length < 200) {
        const fallbackMirrors = [
          `https://raw.githubusercontent.com/GITenberg/${gutenbergId}/master/${gutenbergId}.txt`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.gutenberg.org/files/${gutenbergId}/${gutenbergId}-0.txt`)}`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`)}`
        ]

        for (const mirrorUrl of fallbackMirrors) {
          try {
            const res = await fetch(mirrorUrl)
            if (res.ok) {
              const txt = await res.text()
              if (txt && txt.length > 200) {
                rawText = txt
                break
              }
            }
          } catch (err) {}
        }
      }

      if (!rawText || rawText.length < 100) {
        throw new Error("Unable to retrieve book text stream from archive.")
      }

      const book = parseRawTextToBook(rawText, item.title, item.author)
      book.id = item.id
      book.coverImage = item.coverImage || "/cover-manuscript.png"
      
      persistCustomBook(book)
      setStatusMessage("")
      onOpenBook(book)
    } catch (err) {
      console.error("Transcode failure:", err)
      setStatusMessage(`Transcode error: ${err.message}. Check your network connection.`)
    } finally {
      setLoadingBookId(null)
    }
  }

  // Handle Local File Uploads (.txt, .md, .epub, .json)
  const processUploadedFile = (file) => {
    if (!file) return

    const fileName = file.name
    const title = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
    setStatusMessage(`Parsing "${fileName}" locally on device...`)

    const reader = new FileReader()

    if (fileName.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result)
          if (parsed.sections && Array.isArray(parsed.sections)) {
            persistCustomBook(parsed)
            onOpenBook(parsed)
          } else {
            const book = parseRawTextToBook(JSON.stringify(parsed, null, 2), title, "Local File")
            persistCustomBook(book)
            onOpenBook(book)
          }
        } catch (err) {
          setStatusMessage("Invalid JSON format.")
        }
      }
      reader.readAsText(file)
    } else if (fileName.endsWith('.epub')) {
      reader.onload = async (e) => {
        try {
          const buffer = e.target.result
          setStatusMessage("Extracting EPUB chapters...")
          
          const decoder = new TextDecoder("utf-8")
          const text = decoder.decode(new Uint8Array(buffer))
          
          const clean = text
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<[^>]+>/g, "\n")
            .replace(/&nbsp;/g, " ")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/\n\s*\n/g, "\n\n")

          const book = parseRawTextToBook(clean, title, "EPUB Import")
          persistCustomBook(book)
          onOpenBook(book)
        } catch (err) {
          setStatusMessage("Could not parse EPUB directly. Try converting to .txt or .md.")
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      reader.onload = (e) => {
        try {
          const text = e.target.result
          const book = parseRawTextToBook(text, title, "Local Import")
          persistCustomBook(book)
          onOpenBook(book)
        } catch (err) {
          setStatusMessage(`Error parsing text file: ${err.message}`)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0])
    }
  }

  // Combined all visible books (filtered catalog + any remote search results)
  const allDisplayBooks = useMemo(() => {
    if (remoteResults.length === 0) return filteredCatalog
    return [...filteredCatalog, ...remoteResults.filter(r => !filteredCatalog.some(f => f.gutenbergId === r.gutenbergId))]
  }, [filteredCatalog, remoteResults])

  return (
    <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto fade-in">
      <header className="mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Distraction-Free Reading Engine</p>
        <h1 className="text-4xl sm:text-6xl font-serif italic text-white mb-6">The Universal Reader</h1>
        <p className="text-sm font-light text-secondary max-w-2xl mx-auto leading-relaxed">
          Read any literature in the Absconded interface. Browse and search <span className="text-white">70,000+ public domain classics</span> (Kafka, Dostoevsky, Nietzsche, Shelley, Plato, Shakespeare, etc.) or drag-and-drop your own <span className="text-white font-mono">.epub</span>, <span className="text-white font-mono">.txt</span>, or <span className="text-white font-mono">.md</span> files for instant private reading.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-12 border-b border-white/5 pb-4">
        {[
          { id: "explore", label: `Classic Books (${CLASSICS_CATALOG.length})` },
          { id: "upload", label: "Upload Book (EPUB / TXT)" },
          { id: "saved", label: `Your Saved Books (${savedBooks.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setStatusMessage(""); }}
            className={`text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-all duration-300 relative py-2 whitespace-nowrap ${
              activeTab === tab.id ? "text-white font-medium" : "text-secondary hover:text-white"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white animate-fade-in" />
            )}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      {statusMessage && (
        <div className="max-w-2xl mx-auto mb-8 p-4 border border-white/10 rounded-sm bg-white/[0.02] text-center font-mono text-xs text-secondary animate-pulse">
          {statusMessage}
        </div>
      )}

      {/* Tab 1: Explore & Instant Search Catalog */}
      {activeTab === "explore" && (
        <div className="space-y-12">
          {/* Instant Search Bar */}
          <form onSubmit={handleDeepSearch} className="max-w-2xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setRemoteResults([])
              }}
              placeholder="Search by author or title (e.g. 'Dostoevsky', 'Kafka', 'Plato', 'Shakespeare', 'Tolstoy')..."
              className="w-full bg-black/40 border border-white/10 focus:border-white/30 rounded-lg py-4 px-6 pr-36 text-sm text-white placeholder-secondary/40 outline-none transition-all"
            />
            <div className="absolute right-2.5 top-2.5 bottom-2.5 flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setRemoteResults([])
                    setStatusMessage("")
                  }}
                  className="text-secondary/40 hover:text-white text-xs px-2"
                  title="Clear"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                disabled={searching || !searchQuery.trim()}
                className="px-5 bg-white text-bg hover:bg-white/90 disabled:bg-white/10 disabled:text-secondary/50 rounded-md text-[9px] tracking-[0.25em] uppercase transition-all font-medium h-full"
              >
                {searching ? "Searching..." : "Deep Search"}
              </button>
            </div>
          </form>

          {/* Quick Filter Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: "all", label: `All (${CLASSICS_CATALOG.length})` },
              { id: "existential", label: "Existential & Psychological" },
              { id: "scifi", label: "Sci-Fi & Gothic" },
              { id: "philosophy", label: "Philosophy & Sovereignty" },
              { id: "strategy", label: "Strategy & Power" },
              { id: "literature", label: "Literary Epics" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategoryFilter(cat.id); setRemoteResults([]); }}
                className={`text-[8px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-all ${
                  categoryFilter === cat.id
                    ? "border-white text-white bg-white/10 font-bold"
                    : "border-white/10 text-secondary hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Display */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs uppercase tracking-[0.3em] text-secondary">
                {searchQuery ? `Search Results (${allDisplayBooks.length} Manuscripts)` : `Foundational Archive (${allDisplayBooks.length} Works)`}
              </h3>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setRemoteResults([])
                    setStatusMessage("")
                  }}
                  className="text-[9px] uppercase tracking-[0.2em] text-secondary hover:text-white border border-white/10 px-3 py-1 rounded"
                >
                  Reset Filter ✕
                </button>
              )}
            </div>

            {allDisplayBooks.length === 0 ? (
              <div className="p-16 border border-white/5 rounded-sm bg-white/[0.01] text-center space-y-4">
                <p className="text-lg font-serif italic text-white/90">No manuscripts matched "{searchQuery}".</p>
                <p className="text-xs text-secondary/60 max-w-md mx-auto">
                  Click "Deep Search" above to search the global 70,000+ Project Gutenberg archive or check author spelling.
                </p>
                <button
                  onClick={handleDeepSearch}
                  className="px-6 py-2.5 border border-white/20 hover:bg-white hover:text-bg text-[9px] tracking-[0.3em] uppercase rounded-full transition-all"
                >
                  Run Deep Archive Search →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allDisplayBooks.map((book) => (
                  <div
                    key={book.id}
                    className="group border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.01] hover:bg-white/[0.02] p-8 transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border border-white/10 text-secondary">
                          {book.coverTag || "Public Domain"}
                        </span>
                        <span className="text-[8px] tracking-[0.2em] font-mono text-secondary/40">
                          {book.readingTime || "Classic"}
                        </span>
                      </div>
                      <h4 className="text-2xl font-serif italic text-white mb-2 group-hover:translate-x-1 transition-transform">
                        {book.title}
                      </h4>
                      <p className="text-[9px] tracking-[0.3em] uppercase text-secondary mb-4">
                        {book.author} {book.year ? `· ${book.year}` : ''}
                      </p>
                      <p className="text-xs font-light text-secondary/70 leading-relaxed mb-8 line-clamp-3">
                        {book.description || book.subjects}
                      </p>
                    </div>

                    <button
                      onClick={() => handleLoadGutenberg(book)}
                      disabled={loadingBookId === book.id}
                      className="w-full py-3.5 border border-white/10 hover:border-white hover:bg-white hover:text-bg text-[9px] tracking-[0.3em] uppercase transition-all duration-300 rounded-sm font-medium disabled:opacity-50"
                    >
                      {loadingBookId === book.id ? "Opening Manuscript..." : "Read Manuscript →"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Dropzone & File Importer */}
      {activeTab === "upload" && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? "border-white bg-white/5 scale-[1.01]" 
                : "border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.02]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.epub,.json"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processUploadedFile(e.target.files[0])
                }
              }}
              className="hidden"
            />

            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
              ⇪
            </div>
            
            <h3 className="text-2xl font-serif italic mb-3">Drop Any Book Here</h3>
            <p className="text-xs font-light text-secondary/80 mb-6 max-w-md mx-auto leading-relaxed">
              Drag and drop any <span className="text-white font-mono">.epub</span>, <span className="text-white font-mono">.txt</span>, or <span className="text-white font-mono">.md</span> file. It will be parsed directly in your browser and opened in the reading interface.
            </p>

            <div className="flex justify-center gap-4 text-[8px] tracking-[0.2em] uppercase font-mono text-secondary/60">
              <span className="border border-white/5 px-3 py-1">Zero Server Upload</span>
              <span className="border border-white/5 px-3 py-1">100% Private</span>
              <span className="border border-white/5 px-3 py-1">OLED Compatible</span>
            </div>
          </div>

          <div className="p-6 border border-white/5 rounded-sm bg-white/[0.01] space-y-3">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-secondary">Supported Formats:</h4>
            <ul className="text-xs font-light text-secondary/70 space-y-2 leading-relaxed">
              <li>• <strong className="text-white">.EPUB</strong> — Electronic book packages with chapters extracted natively.</li>
              <li>• <strong className="text-white">.TXT</strong> — Plain text books automatically split by chapter headings or smart word chunks.</li>
              <li>• <strong className="text-white">.MD</strong> — Markdown essays, docs, or web fiction formatted with headings and pull-quotes.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Saved & Transcoded Shelf */}
      {activeTab === "saved" && (
        <div className="space-y-8">
          {savedBooks.length === 0 ? (
            <div className="text-center py-20 border border-white/5 rounded-sm bg-white/[0.01]">
              <p className="text-sm font-serif italic text-secondary mb-4">Your transcoded shelf is empty.</p>
              <p className="text-xs text-secondary/50 mb-8">Search a public domain classic or drop a book file to save it locally.</p>
              <button
                onClick={() => setActiveTab("explore")}
                className="px-8 py-3 border border-white/10 hover:bg-white hover:text-bg rounded-full text-[9px] tracking-[0.3em] uppercase transition-all"
              >
                Browse Classics
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onOpenBook(book)}
                  className="group border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.01] p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[8px] tracking-[0.2em] font-mono text-secondary uppercase">
                        {book.sections?.length || 1} Chapters
                      </span>
                      <button
                        onClick={(e) => handleDeleteCustomBook(book.id, e)}
                        className="text-secondary/40 hover:text-red-400 text-xs transition-colors p-1"
                        title="Remove from Shelf"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="text-2xl font-serif italic text-white mb-2 group-hover:translate-x-1 transition-transform">
                      {book.title}
                    </h4>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-secondary mb-4">
                      {book.subtitle}
                    </p>
                    <p className="text-xs font-light text-secondary/70 line-clamp-3 mb-6">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] tracking-[0.2em] uppercase text-secondary group-hover:text-white">
                    <span>Read Manuscript</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
