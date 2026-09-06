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
      let data = null

      // 1. Primary: server-side Next.js proxy route (no CORS on Vercel/prod)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 6000)
        const localApiRes = await fetch(`/api/transcode?search=${encodeURIComponent(searchQuery.trim())}`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (localApiRes.ok) {
          data = await localApiRes.json()
        }
      } catch (err) {
        console.warn("Local API deep search bypassed, trying direct:", err.message)
      }

      // 2. Fallback: call gutendex.com directly from browser (works locally)
      if (!data || !data.results) {
        try {
          const directRes = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(searchQuery.trim())}`, {
            headers: { 'Accept': 'application/json' }
          })
          if (directRes.ok) {
            data = await directRes.json()
          }
        } catch (err) {
          console.warn("Direct gutendex search failed:", err.message)
        }
      }

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

  // Parse raw text stream into beautifully formatted, balanced chapters
  const parseRawTextToBook = (rawText, title, author = "Public Domain Archive") => {
    let text = rawText || ""

    // Strip Gutenberg header and footer blocks
    const startIdx = text.search(/\*\*\* START OF (THE|THIS) PROJECT GUTENBERG/i)
    if (startIdx !== -1) {
      const endHeaderIdx = text.indexOf('\n', startIdx)
      text = text.substring(endHeaderIdx + 1)
    }
    const endIdx = text.search(/\*\*\* END OF (THE|THIS) PROJECT GUTENBERG/i)
    if (endIdx !== -1) {
      text = text.substring(0, endIdx)
    }

    // Strip illustrations and transcriber notes
    text = text.replace(/\[Illustration:[^\]]*\]/gi, '')
    text = text.replace(/\[Illustration\]/gi, '')
    text = text.replace(/Transcriber[’']s Notes?:[\s\S]*?(?=\n\s*\n\s*[A-Z])/gi, '')

    // Strip Table of Contents blocks (from 'Contents' until the first real Chapter or Preface)
    const lines = text.split(/\r?\n/)
    let inTOC = false
    const filteredLines = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (/^(?:Contents|Table of Contents|INDEX)$/i.test(line)) {
        inTOC = true
        continue
      }
      if (inTOC) {
        if (/^(?:CHAPTER|BOOK|PART|ACT|STAVE|LETTER)\s+(?:[IVXLCDM0-9]+|ONE|FIRST)\b/i.test(line) ||
            /^(?:PREFACE|FOREWORD|PROLOGUE|INTRODUCTION)\b/i.test(line)) {
          inTOC = false
        } else {
          continue
        }
      }
      filteredLines.push(lines[i])
    }

    const rawParagraphs = []
    let currentP = []

    for (let line of filteredLines) {
      const trimmed = line.trim()
      if (!trimmed) {
        if (currentP.length > 0) {
          rawParagraphs.push(currentP.join(' ').trim())
          currentP = []
        }
        continue
      }
      // Skip decorative divider lines (* * *, ---, ===)
      if (/^[\*\-_=\s]{3,}$/.test(trimmed)) {
        if (currentP.length > 0) {
          rawParagraphs.push(currentP.join(' ').trim())
          currentP = []
        }
        continue
      }
      currentP.push(trimmed)
    }
    if (currentP.length > 0) rawParagraphs.push(currentP.join(' ').trim())

    // Identify Table of Contents blocks that got joined into a single paragraph
    const isTOCParagraph = (p) => {
      const romanCount = (p.match(/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)\.\s+[A-Z]/g) || []).length
      if (romanCount >= 2) return true
      const chapCount = (p.match(/\b(?:CHAPTER|Chapter)\s+[0-9IVXLCDM]+/gi) || []).length
      if (chapCount >= 2) return true
      return false
    }

    // Identify front-matter boilerplate (publisher info, prices, TOC listings)
    const isJunkLine = (p) => {
      if (p.length < 3) return true
      if (isTOCParagraph(p)) return true
      if (/^(PRICE|PUBLISHED BY|COPYRIGHT|PRINTED IN|NEW YORK|LONDON|BOSTON|HOLYOKE|ALL RIGHTS RESERVED|Produced by|Author of)/i.test(p)) return true
      if (/^BY\s+[A-Z\s\.]+$/i.test(p)) return true
      if (/^CONTENTS$/i.test(p) || /^TABLE OF CONTENTS$/i.test(p) || /^PAGE$/i.test(p)) return true
      if (/^(?:[IVXLCDM0-9]+[\.\s]+[A-Z\s,–—\-]+(?:\s+[0-9]+)?)$/i.test(p) && p.length < 80) return true
      return false
    }

    // Locate the actual narrative starting point
    let startIndex = 0
    for (let i = 0; i < Math.min(rawParagraphs.length, 40); i++) {
      const p = rawParagraphs[i]
      if (p.length > 120 && !isJunkLine(p)) {
        if (i > 0 && rawParagraphs[i - 1].length < 80 && !isJunkLine(rawParagraphs[i - 1])) {
          startIndex = i - 1
        } else {
          startIndex = i
        }
        break
      }
    }

    const cleanParagraphs = rawParagraphs.slice(startIndex).filter(p => !isJunkLine(p))

    // Chapter heading detection
    const chapterRegex = /^(?:CHAPTER|Chapter|BOOK|Book|PART|Part|ACT|Act|SECTION|Section|STAVE|Stave)\s+([IVXLCDM0-9]+)?(?:\s*[:.\-—]\s*(.*))?$/i
    const romanTitleRegex = /^(?:[IVXLCDM0-9]+[\.\s]+)([A-Z\s,–—\-]{3,60})$/
    const namedSectionRegex = /^(?:FOREWORD|PREFACE|PROLOGUE|INTRODUCTION|EPILOGUE|CONCLUSION|SERENITY|THE EPILOGUE)$/i

    const isChapterHeading = (p) => {
      if (p.length > 80) return false
      if (chapterRegex.test(p)) return true
      if (romanTitleRegex.test(p)) return true
      if (namedSectionRegex.test(p)) return true
      if (p === p.toUpperCase() && p.length >= 4 && p.length <= 55 && /^[A-Z\s,'’\-—–]+$/.test(p)) {
        const words = p.split(/\s+/).length
        return words >= 1 && words <= 8
      }
      return false
    }

    const rawChapters = []
    let curChapter = { title: "Chapter 1", paragraphs: [] }

    for (let p of cleanParagraphs) {
      if (isChapterHeading(p) && curChapter.paragraphs.length > 0) {
        rawChapters.push(curChapter)
        curChapter = { title: p.replace(/^[#\s*]+/, '').trim(), paragraphs: [] }
      } else if (isChapterHeading(p) && curChapter.paragraphs.length === 0) {
        curChapter.title = p.replace(/^[#\s*]+/, '').trim()
      } else {
        curChapter.paragraphs.push(p)
      }
    }
    if (curChapter.paragraphs.length > 0) rawChapters.push(curChapter)

    // Merge any orphan short chapters and filter out TOC chapters
    // A chapter is too short if it has ≤3 paragraphs OR ≤80 words total
    const validChapters = []
    for (let c of rawChapters) {
      if (c.paragraphs.length === 0) continue
      // If a chapter is actually a TOC block, discard it
      if (c.paragraphs.some(isTOCParagraph)) continue

      const totalWords = c.paragraphs.join(' ').split(/\s+/).length
      const isTooShort = (c.paragraphs.length <= 3 && totalWords < 80) ||
                         (c.paragraphs.length === 1 && totalWords < 120)
      if (isTooShort && validChapters.length > 0) {
        // Merge into the previous chapter
        validChapters[validChapters.length - 1].paragraphs.push(...c.paragraphs)
      } else {
        validChapters.push(c)
      }
    }

    // Smart Balanced Pagination:
    // Target 10-16 paragraphs per section. If a chapter is longer, split it.
    // Minimum 5 paragraphs per section (merge tiny tail chunks into the last section).
    const finalSections = []
    let sectionIndex = 1
    const MIN_SECTION_PARAGRAPHS = 5
    const MAX_SECTION_PARAGRAPHS = 14

    for (let ch of validChapters) {
      const pList = ch.paragraphs
      if (pList.length <= MAX_SECTION_PARAGRAPHS) {
        finalSections.push({
          id: `section-${sectionIndex}`,
          number: sectionIndex,
          label: `Section ${String(sectionIndex).padStart(2, '0')}`,
          title: ch.title,
          epigraph: "",
          content: pList.map(text => ({
            type: text.length < 130 && (text.startsWith('"') || text.startsWith('\u201C')) ? "pull" : "p",
            text
          }))
        })
        sectionIndex++
      } else {
        const chunkSize = 10 // ~10 paragraphs per part for comfortable reading
        const chunks = []
        for (let i = 0; i < pList.length; i += chunkSize) {
          chunks.push(pList.slice(i, i + chunkSize))
        }
        // If the last chunk is too small, balance it into the previous chunk
        if (chunks.length > 1 && chunks[chunks.length - 1].length < MIN_SECTION_PARAGRAPHS) {
          const last = chunks.pop()
          chunks[chunks.length - 1].push(...last)
        }

        const totalParts = chunks.length
        chunks.forEach((slice, idx) => {
          const partNum = idx + 1
          finalSections.push({
            id: `section-${sectionIndex}`,
            number: sectionIndex,
            label: `Section ${String(sectionIndex).padStart(2, '0')}`,
            title: totalParts > 1 ? `${ch.title} · Part ${partNum}` : ch.title,
            epigraph: "",
            content: slice.map(text => ({
              type: text.length < 130 && (text.startsWith('"') || text.startsWith('\u201C')) ? "pull" : "p",
              text
            }))
          })
          sectionIndex++
        })
      }
    }

    const totalWords = cleanParagraphs.join(' ').split(/\s+/).filter(Boolean).length

    return {
      id: `book-${Date.now()}`,
      type: "manuscript",
      title: title || "Transcoded Manuscript",
      subtitle: `Archived by ${author}`,
      coverQuote: `"Language is the ultimate protocol."`,
      readingTime: `${Math.ceil(totalWords / 220)} min`,
      description: `Complete manuscript by ${author}. Structured into ${finalSections.length} balanced reading sections.`,
      sections: finalSections.length > 0 ? finalSections : [{
        id: "section-1",
        number: 1,
        label: "Manuscript",
        title: title || "Text",
        content: cleanParagraphs.map(text => ({ type: "p", text }))
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
      book.coverImage = item.coverImage || (item.gutenbergId ? `https://www.gutenberg.org/cache/epub/${item.gutenbergId}/pg${item.gutenbergId}.cover.medium.jpg` : "/cover-manuscript.png")
      book.credits = item.credits || (item.gutenbergId ? `Archived via Project Gutenberg (#${item.gutenbergId}). Verified Public Domain.` : "")
      book.edition = item.edition || ""
      book.year = item.year || ""
      if (item.keyQuote) {
        book.coverQuote = `"${item.keyQuote}"`
      }
      book.coverTag = item.coverTag || "Public Domain Classic"
      
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
    <section className="pt-24 sm:pt-40 pb-20 px-4 sm:px-6 max-w-6xl mx-auto fade-in">
      <header className="mb-10 sm:mb-14 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-secondary mb-4">Distraction-Free Reading Engine</p>
        <h1 className="text-3xl sm:text-6xl font-serif italic text-white mb-4 sm:mb-6">The Universal Reader</h1>
        <p className="text-sm font-light text-secondary max-w-2xl mx-auto leading-relaxed">
          Read any literature in the Absconded interface. Browse and search <span className="text-white">70,000+ public domain classics</span> (Kafka, Dostoevsky, Nietzsche, Shelley, Plato, Shakespeare, etc.) or drag-and-drop your own <span className="text-white font-mono">.epub</span>, <span className="text-white font-mono">.txt</span>, or <span className="text-white font-mono">.md</span> files for instant private reading.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 border-b border-white/5 pb-4">
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
              { id: "success", label: "Mindset & Wealth (Success Codex)" },
              { id: "existential", label: "Existential & Psychological" },
              { id: "philosophy", label: "Philosophy & Sovereignty" },
              { id: "strategy", label: "Strategy & Power" },
              { id: "scifi", label: "Sci-Fi & Gothic" },
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
                    className="group border border-white/5 hover:border-white/20 rounded-sm bg-white/[0.01] hover:bg-white/[0.02] p-6 sm:p-7 transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header: Tag & Reading Time */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border border-white/10 text-secondary">
                          {book.coverTag || "Public Domain"}
                        </span>
                        <span className="text-[8px] tracking-[0.2em] font-mono text-secondary/40">
                          {book.readingTime || "Classic"}
                        </span>
                      </div>

                      {/* Cover Image & Metadata Layout */}
                      <div className="flex gap-4 sm:gap-5 mb-4 items-start">
                        {(book.coverImage || book.gutenbergId) && (
                          <div className="w-20 sm:w-24 aspect-[2/3] flex-shrink-0 relative overflow-hidden rounded-sm border border-white/10 bg-black/40 shadow-xl group-hover:border-white/30 transition-all">
                            <img
                              src={book.coverImage || `https://www.gutenberg.org/cache/epub/${book.gutenbergId}/pg${book.gutenbergId}.cover.medium.jpg`}
                              alt={book.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl sm:text-2xl font-serif italic text-white mb-1.5 group-hover:translate-x-0.5 transition-transform leading-snug">
                            {book.title}
                          </h4>
                          <p className="text-[9px] tracking-[0.25em] uppercase text-secondary mb-2">
                            {book.author} {book.year ? `· ${book.year}` : ''}
                          </p>
                          {book.edition && (
                            <p className="text-[8px] tracking-[0.15em] uppercase text-secondary/60 font-mono mb-2">
                              {book.edition}
                            </p>
                          )}
                          <p className="text-xs font-light text-secondary/70 leading-relaxed line-clamp-3">
                            {book.description || book.subjects}
                          </p>
                        </div>
                      </div>

                      {/* Key Quote if available */}
                      {book.keyQuote && (
                        <div className="mb-4 pl-3 border-l border-white/20 text-xs italic font-serif text-secondary/80">
                          "{book.keyQuote}"
                        </div>
                      )}

                      {/* Proper Respects & Credits Provenance */}
                      {book.credits && (
                        <div className="mb-5 p-2.5 border border-white/5 rounded-sm bg-white/[0.01] text-[9px] font-mono text-secondary/50 leading-relaxed">
                          <span className="text-secondary/80 uppercase font-semibold">Provenance: </span>
                          {book.credits}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleLoadGutenberg(book)}
                      disabled={loadingBookId === book.id}
                      className="w-full py-3.5 border border-white/10 hover:border-white hover:bg-white hover:text-bg text-[9px] tracking-[0.3em] uppercase transition-all duration-300 rounded-sm font-medium disabled:opacity-50 mt-2"
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
