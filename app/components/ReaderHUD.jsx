'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Sanitize text for natural human-like voice over narration (removes underscores, asterisks, dividers, etc.)
function cleanTextForSpeech(raw) {
  if (!raw) return ''
  return raw
    // Strip horizontal dividers (e.g., ___ or --- or *** or ===)
    .replace(/^[\s\-_*=~]{3,}$/gm, ' ')
    // Strip markdown italics/bolds _word_ or *word* -> word
    .replace(/[_*]{1,3}(.*?)[_*]{1,3}/g, '$1')
    // Remove all remaining underscores (snake_case -> snake case, ___ -> space)
    .replace(/_+/g, ' ')
    // Remove backticks `code` -> code
    .replace(/`([^`]+)`/g, '$1')
    .replace(/`/g, '')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Replace em-dash, en-dash, or multiple hyphens with a natural pause
    .replace(/[—–]|-{2,}/g, ', ')
    // Strip decorative glyphs that TTS awkwardly pronounces
    .replace(/[#*~^|\\<>{}[\]•·↳→★✦❖]/g, ' ')
    // Normalize curly quotes into clean quotes
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

// Split text into natural sentence chunks
function splitIntoSentences(text) {
  if (!text) return []
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' })
      return Array.from(segmenter.segment(text), s => s.segment.trim()).filter(Boolean)
    } catch (e) {
      // fallback below
    }
  }
  // Robust regex that preserves sentences ending in punctuation or trailing quotes/spaces
  const matches = text.match(/[^.!?]+(?:[.!?]+(?:['"”’\s]+|$)|$)/g) || [text]
  return matches.map(s => s.trim()).filter(Boolean)
}

// Group sentences into TTS-ready text chunks (max maxLen chars each)
function groupSentencesIntoChunks(sentences, maxLen = 260) {
  const chunks = []
  let current = ''
  for (const s of sentences) {
    const sentence = s.trim()
    if (!sentence) continue
    if (current && (current + ' ' + sentence).length > maxLen) {
      chunks.push(current)
      current = sentence
    } else {
      current = current ? current + ' ' + sentence : sentence
    }
  }
  if (current) chunks.push(current)
  return chunks
}

// Kept for legacy export compatibility
export const MALE_NARRATOR = {
  id: 'male',
  label: 'Literary Male Narrator',
  basePitch: 0.90, // Rich, warm baritone tone removing robotic high frequencies
  baseRate: 0.92,  // Measured, contemplative literary cadence
  epigraphPitch: 0.86,
  epigraphRate: 0.86,
  quotePitch: 0.86,
  quoteRate: 0.88,
  twistPitch: 0.84,
  twistRate: 0.88,
  sentencePause: 160,
  paragraphPause: 420,
  quotePause: 460
}

// ─── End of narration helpers ───


export default function ReaderHUD({
  bookTitle,
  author = 'Tanvir Khan',
  chapterTitle,
  content = [],
  epigraph = '',
  bionic,
  setBionic,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  lineHeight,
  setLineHeight,
  onCopyQuote
}) {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(1)
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  // Audio narration — Brian voice (StreamElements/Amazon Polly, works on all devices)
  const [speechState, setSpeechState] = useState('idle') // 'idle'|'loading'|'playing'|'paused'
  const [speechRate, setSpeechRate] = useState(1.0)
  const audioPlayerRef = useRef(null)   // <audio> element
  const chunkQueueRef = useRef([])      // Array of text strings
  const currentChunkRef = useRef(0)     // Index of current playing chunk
  const isPlayingRef = useRef(false)
  const rateRef = useRef(1.0)
  const blobUrlsRef = useRef([])        // Blob URLs to revoke on stop
  const prefetchedBlobRef = useRef(null) // Pre-fetched next chunk URL
  const pauseTimeoutRef = useRef(null)  // Kept for compatibility

  useEffect(() => {
    rateRef.current = speechRate
  }, [speechRate])

  // Stop audio on unmount or chapter change
  useEffect(() => {
    return () => {
      isPlayingRef.current = false
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      if (audioPlayerRef.current) {
        try { audioPlayerRef.current.pause(); audioPlayerRef.current.src = '' } catch (e) {}
      }
      blobUrlsRef.current.forEach(u => { try { URL.revokeObjectURL(u) } catch(e) {} })
      blobUrlsRef.current = []
      prefetchedBlobRef.current = null
    }
  }, [bookTitle, chapterTitle, content])

  // Ambient sound synthesizer (Web Audio API)
  const [ambientType, setAmbientType] = useState('off') // 'off', 'rain', 'deep'
  const [ambientVolume] = useState(0.25)
  const audioContextRef = useRef(null)
  const noiseNodeRef = useRef(null)
  const gainNodeRef = useRef(null)

  // Selection & Dictionary
  const [selectedText, setSelectedText] = useState('')
  const [selectionPos, setSelectionPos] = useState(null)
  const [dictModal, setDictModal] = useState(null) // { word, phonetic, meanings: [] }
  const [dictLoading, setDictLoading] = useState(false)
  const [dictError, setDictError] = useState('')

  // 1. Calculate word count and dynamic time left
  const totalWords = useRef(0)
  useEffect(() => {
    if (!content || !Array.isArray(content)) {
      totalWords.current = 0
      return
    }
    const words = content.map(block => block.text || '').join(' ').split(/\s+/).filter(Boolean).length
    totalWords.current = words
  }, [content])

  // Track scroll position and calculate remaining reading time
  useEffect(() => {
    const updateScrollMetrics = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop || document.body.scrollTop
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      const percent = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0
      setScrollPercent(Math.round(percent))

      const remainingWords = Math.max(0, totalWords.current * (1 - percent / 100))
      const minutesRemaining = Math.max(1, Math.ceil(remainingWords / 220))
      setTimeLeftMinutes(percent >= 97 ? 0 : minutesRemaining)
    }

    window.addEventListener('scroll', updateScrollMetrics, { passive: true })
    updateScrollMetrics()
    return () => window.removeEventListener('scroll', updateScrollMetrics)
  }, [content])

  // 2. Auto-reset narration when book/chapter changes
  useEffect(() => {
    isPlayingRef.current = false
    currentChunkRef.current = 0
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    if (audioPlayerRef.current) {
      try { audioPlayerRef.current.pause(); audioPlayerRef.current.src = '' } catch (e) {}
    }
    blobUrlsRef.current.forEach(u => { try { URL.revokeObjectURL(u) } catch(e) {} })
    blobUrlsRef.current = []
    prefetchedBlobRef.current = null
    setSpeechState('idle')
  }, [bookTitle, chapterTitle, content])

  // (placeholder — kept as unused effect stub so line references stay stable)
  useEffect(() => {
    // Audio element init — no-op, just ensures effect runs once
  }, [])

  // ── TTS Audio Engine ──────────────────────────────────────────────────────

  // Cleanup all blob URLs to free memory
  const cleanupBlobs = useCallback(() => {
    blobUrlsRef.current.forEach(u => { try { URL.revokeObjectURL(u) } catch(e) {} })
    blobUrlsRef.current = []
    prefetchedBlobRef.current = null
  }, [])

  // Fetch one text chunk from TTS API, returns blob URL
  const fetchTTSBlob = useCallback(async (text) => {
    const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`)
    if (!res.ok) throw new Error(`TTS ${res.status}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    blobUrlsRef.current.push(url)
    return url
  }, [])

  // Play chunk at given index — chains via onended
  const startPlayingChunk = useCallback(async (index) => {
    if (!isPlayingRef.current || !audioPlayerRef.current) return
    const chunks = chunkQueueRef.current
    if (index >= chunks.length) {
      isPlayingRef.current = false
      setSpeechState('idle')
      cleanupBlobs()
      currentChunkRef.current = 0
      return
    }
    currentChunkRef.current = index

    try {
      let blobUrl
      if (prefetchedBlobRef.current) {
        blobUrl = prefetchedBlobRef.current
        prefetchedBlobRef.current = null
      } else {
        blobUrl = await fetchTTSBlob(chunks[index])
      }

      if (!isPlayingRef.current) {
        try { URL.revokeObjectURL(blobUrl) } catch(e) {}
        return
      }

      // Pre-fetch next chunk in background while current plays
      if (index + 1 < chunks.length) {
        fetchTTSBlob(chunks[index + 1]).then(nextUrl => {
          if (isPlayingRef.current) {
            prefetchedBlobRef.current = nextUrl
          } else {
            try { URL.revokeObjectURL(nextUrl) } catch(e) {}
          }
        }).catch(() => {})
      }

      const audio = audioPlayerRef.current
      audio.src = blobUrl
      audio.playbackRate = Math.max(0.5, Math.min(2.0, rateRef.current))
      audio.onended = () => {
        if (isPlayingRef.current) startPlayingChunk(index + 1)
      }
      audio.onerror = () => {
        if (isPlayingRef.current) startPlayingChunk(index + 1)
      }

      setSpeechState('playing')
      await audio.play()
    } catch (err) {
      console.warn('[TTS] Chunk error:', err?.message || err)
      if (isPlayingRef.current) startPlayingChunk(index + 1)
    }
  }, [fetchTTSBlob, cleanupBlobs])

  // Build clean segments across ALL book structures: manuscripts, classics, imported EPUBs, and plain text
  const getCleanSegments = useCallback(() => {
    const rawBlocks = []
    if (epigraph && typeof epigraph === 'string' && epigraph.trim()) {
      rawBlocks.push({ text: epigraph.trim(), type: 'epigraph' })
    }
    if (Array.isArray(content)) {
      content.forEach(b => {
        if (!b) return
        if (typeof b === 'string' && b.trim()) {
          rawBlocks.push({ text: b.trim(), type: 'p' })
        } else if (typeof b === 'object' && b.text && b.type !== 'portrait') {
          rawBlocks.push({ text: String(b.text).trim(), type: b.type || 'p' })
        }
      })
    } else if (typeof content === 'string' && content.trim()) {
      rawBlocks.push({ text: content.trim(), type: 'p' })
    }

    const segments = []
    rawBlocks.forEach((block, bIdx) => {
      const cleaned = cleanTextForSpeech(block.text)
      if (!cleaned) return
      const sentences = splitIntoSentences(cleaned)
      sentences.forEach((sentence, sIdx) => {
        const isLastInBlock = sIdx === sentences.length - 1
        segments.push({
          text: sentence,
          type: block.type,
          isLastInBlock,
          isLastInChapter: bIdx === rawBlocks.length - 1 && isLastInBlock
        })
      })
    })
    return segments
  }, [content, epigraph])

  // (legacy speakSegment — no longer used)
  const speakSegment = useCallback((_index) => {}, [])

  // ── Narration Handlers ───────────────────────────────────────────────────

  const handleStartNarration = useCallback(async () => {
    if (!audioPlayerRef.current) return
    const segments = getCleanSegments()
    if (!segments || segments.length === 0) return

    // Build all text as sentence chunks
    const allSentences = segments.flatMap(seg => splitIntoSentences(seg.text))
    const chunks = groupSentencesIntoChunks(allSentences)
    if (chunks.length === 0) return

    cleanupBlobs()
    chunkQueueRef.current = chunks
    currentChunkRef.current = 0
    isPlayingRef.current = true
    setSpeechState('loading')

    await startPlayingChunk(0)
  }, [getCleanSegments, startPlayingChunk, cleanupBlobs])

  const handlePauseNarration = () => {
    isPlayingRef.current = false
    setSpeechState('paused')
    if (audioPlayerRef.current) {
      try { audioPlayerRef.current.pause() } catch(e) {}
    }
  }

  const handleResumeNarration = async () => {
    isPlayingRef.current = true
    const audio = audioPlayerRef.current
    if (audio && audio.src && !audio.ended && audio.readyState >= 2) {
      try {
        audio.playbackRate = rateRef.current
        await audio.play()
        setSpeechState('playing')
      } catch(e) {
        // Blob URL may have been revoked — re-fetch chunk
        setSpeechState('loading')
        await startPlayingChunk(currentChunkRef.current)
      }
    } else {
      setSpeechState('loading')
      await startPlayingChunk(currentChunkRef.current)
    }
  }

  const handleStopNarration = () => {
    isPlayingRef.current = false
    currentChunkRef.current = 0
    setSpeechState('idle')
    if (audioPlayerRef.current) {
      try { audioPlayerRef.current.pause(); audioPlayerRef.current.src = '' } catch(e) {}
    }
    cleanupBlobs()
  }

  const cycleSpeechRate = () => {
    const rates = [0.85, 1.0, 1.25, 1.5]
    const idx = rates.indexOf(speechRate)
    const nextRate = rates[(idx + 1) % rates.length]
    setSpeechRate(nextRate)
    rateRef.current = nextRate
    if (audioPlayerRef.current && speechState === 'playing') {
      audioPlayerRef.current.playbackRate = nextRate
    }
  }

  // 3. Web Audio Ambient Sound Generator
  const stopAmbient = useCallback(() => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime)
        gainNodeRef.current.disconnect()
      }
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop()
        noiseNodeRef.current.disconnect()
        noiseNodeRef.current = null
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
    } catch (e) {
      console.warn('Error stopping ambient audio:', e)
    }
    setAmbientType('off')
  }, [])

  const startAmbient = useCallback((type) => {
    stopAmbient()
    if (type === 'off') return

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      const bufferSize = ctx.sampleRate * 4
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        if (type === 'rain') {
          lastOut = (lastOut * 0.95) + (white * 0.05)
          data[i] = lastOut * 3.5
        } else {
          lastOut = (lastOut + (0.02 * white)) / 1.02
          data[i] = lastOut * 3.0
        }
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = buffer
      whiteNoise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = type === 'rain' ? 'bandpass' : 'lowpass'
      filter.frequency.value = type === 'rain' ? 800 : 250
      filter.Q.value = type === 'rain' ? 0.7 : 1.0

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(ambientVolume * 0.4, ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      whiteNoise.start(0)
      noiseNodeRef.current = whiteNoise
      gainNodeRef.current = gain
      setAmbientType(type)
    } catch (err) {
      console.warn('Ambient Web Audio not initialized:', err)
      setAmbientType('off')
    }
  }, [ambientVolume, stopAmbient])


  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      stopAmbient()
    }
  }, [stopAmbient])

  // 4. Text Selection Handling (Mouse + Touch for iPhone & iPad)
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) {
        setSelectedText('')
        setSelectionPos(null)
        return
      }

      const text = selection.toString().trim()
      if (!text || text.length < 2) {
        setSelectedText('')
        setSelectionPos(null)
        return
      }

      try {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        
        // Position floating toolbar above selection with screen boundary clamping
        setSelectionPos({
          top: Math.max(12, rect.top - 48),
          left: Math.max(12, Math.min(window.innerWidth - 200, rect.left + rect.width / 2 - 80))
        })
        setSelectedText(text)
      } catch (e) {
        // Range exception fallback
      }
    }

    const handleTouchEnd = () => {
      setTimeout(handleSelection, 150)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  // Look up dictionary definition for selected word
  const handleLookupDictionary = async () => {
    const cleanWord = selectedText.replace(/[^a-zA-Z]/g, '').toLowerCase()
    if (!cleanWord) return

    setDictLoading(true)
    setDictError('')
    setDictModal({ word: cleanWord, meanings: [] })

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`)
      if (!res.ok) {
        throw new Error('Definition not found')
      }
      const data = await res.json()
      if (Array.isArray(data) && data[0]) {
        const item = data[0]
        setDictModal({
          word: item.word,
          phonetic: item.phonetic || (item.phonetics && item.phonetics[0]?.text) || '',
          meanings: item.meanings || []
        })
      }
    } catch (err) {
      setDictError(`No definition found for "${cleanWord}".`)
    } finally {
      setDictLoading(false)
      setSelectedText('')
      setSelectionPos(null)
    }
  }

  // Copy selected quote
  const handleCopyQuote = () => {
    const quoteText = `"${selectedText}"\n— ${author}, ${bookTitle || ''} (${chapterTitle || ''})`
    navigator.clipboard.writeText(quoteText)
    if (onCopyQuote) onCopyQuote()
    setSelectedText('')
    setSelectionPos(null)
  }

  return (
    <>
      {/* ── Selection Floating Pill ── */}
      {selectedText && selectionPos && (
        <div
          style={{
            position: 'fixed',
            top: `${selectionPos.top}px`,
            left: `${selectionPos.left}px`,
            zIndex: 80
          }}
          className="flex items-center gap-1 bg-[#0a0a0a]/95 border border-white/20 rounded-full px-2.5 py-1 shadow-2xl backdrop-blur-md animate-fade-in"
        >
          {selectedText.split(/\s+/).length <= 3 && (
            <button
              onClick={handleLookupDictionary}
              className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white hover:text-emerald-400 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1.5"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Define</span>
            </button>
          )}

          <button
            onClick={handleCopyQuote}
            className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white hover:text-amber-400 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1.5"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Quote</span>
          </button>
        </div>
      )}

      {/* ── Dictionary Modal ── */}
      {dictModal && (
        <div 
          onClick={() => setDictModal(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/15 rounded-lg p-6 shadow-2xl relative text-left"
          >
            <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-serif italic text-white capitalize">{dictModal.word}</h3>
                {dictModal.phonetic && (
                  <span className="text-xs font-mono text-secondary">{dictModal.phonetic}</span>
                )}
              </div>
              <button
                onClick={() => setDictModal(null)}
                className="text-secondary hover:text-white text-xs font-mono"
              >
                CLOSE
              </button>
            </div>

            {dictLoading ? (
              <div className="py-8 text-center text-xs font-mono tracking-widest text-secondary uppercase animate-pulse">
                Fetching Definition...
              </div>
            ) : dictError ? (
              <div className="py-6 text-xs text-secondary/80 font-mono leading-relaxed">
                {dictError}
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-4 pr-1 text-sm">
                {dictModal.meanings.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-500 font-medium">
                      {m.partOfSpeech}
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-secondary/90 leading-relaxed font-serif">
                      {m.definitions.slice(0, 2).map((d, dIdx) => (
                        <li key={dIdx}>
                          {d.definition}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* ── Typography & Appearance Drawer (Optimized for iPhone, iPad, & Desktop) ── */}
      {settingsOpen && (
        <div 
          onClick={() => setSettingsOpen(false)}
          className="fixed inset-0 z-[75] bg-black/75 backdrop-blur-sm fade-in flex items-end sm:items-center justify-center pb-[calc(max(1rem,env(safe-area-inset-bottom,0px))+4.75rem)] sm:pb-0 px-3 sm:px-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm sm:max-w-md bg-[#0c0c0c] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-secondary">
                Reader Appearance
              </span>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-secondary hover:text-white text-xs font-mono px-2 py-1 min-h-[32px] flex items-center"
              >
                DONE
              </button>
            </div>

            {/* Bionic Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-white font-medium">Bionic Reading</span>
                <span className="text-[9px] text-secondary/60">Bolds word fixations for rapid comprehension</span>
              </div>
              <button
                onClick={() => setBionic(!bionic)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase transition-all border min-h-[32px] ${
                  bionic
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'border-white/10 text-secondary hover:text-white'
                }`}
              >
                {bionic ? 'ENABLED' : 'OFF'}
              </button>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary block">
                Type Size
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'S', size: 'small' },
                  { label: 'M', size: 'medium' },
                  { label: 'L', size: 'large' },
                  { label: 'XL', size: 'xlarge' }
                ].map(opt => (
                  <button
                    key={opt.size}
                    onClick={() => setFontSize(opt.size)}
                    className={`py-2 rounded-lg text-[11px] font-mono transition-all border min-h-[36px] ${
                      fontSize === opt.size
                        ? 'border-white/40 bg-white/15 text-white font-semibold'
                        : 'border-white/10 text-secondary hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary block">
                Typeface
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Serif', val: 'serif' },
                  { label: 'Sans', val: 'sans' },
                  { label: 'Mono', val: 'mono' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setFontFamily(opt.val)}
                    className={`py-2 rounded-lg text-[10px] uppercase font-mono tracking-wider transition-all border min-h-[36px] ${
                      fontFamily === opt.val
                        ? 'border-white/40 bg-white/15 text-white font-semibold'
                        : 'border-white/10 text-secondary hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Spacing */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary block">
                Line Spacing
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Compact', val: 'compact' },
                  { label: 'Relaxed', val: 'relaxed' },
                  { label: 'Spacious', val: 'spacious' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setLineHeight(opt.val)}
                    className={`py-2 rounded-lg text-[9px] uppercase font-mono tracking-wider transition-all border min-h-[36px] ${
                      lineHeight === opt.val
                        ? 'border-white/40 bg-white/15 text-white font-semibold'
                        : 'border-white/10 text-secondary hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Narrator Settings (Single Natural Studio Voice) */}
            <div className="space-y-2.5 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary block">
                  Audio Narrator
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                  STUDIO VOICE
                </span>
              </div>

              {/* Active Voice Card */}
              <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-mono text-white font-medium flex items-center gap-1.5">
                    <span>Christopher</span>
                    <span className="text-[9px] text-emerald-400 font-sans">⭐ Natural Human</span>
                  </div>
                  <div className="text-[9px] text-secondary/70 font-sans mt-0.5">
                    Audible-grade, warm baritone cadence with human literary pacing
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if (audioPlayerRef.current) {
                        audioPlayerRef.current.pause()
                      }
                      const testAudio = new Audio(`/api/tts?text=${encodeURIComponent('Absconded. A novel written by Tanvir Khan.')}&rate=${rateRef.current}`)
                      testAudio.play().catch(() => {})
                    } catch (e) {}
                  }}
                  className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded shrink-0 transition-colors cursor-pointer"
                  title="Test voice sample"
                >
                  ▶ TEST
                </button>
              </div>

              {/* Playback speed selector */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-mono text-secondary uppercase tracking-wider block">
                  Playback Speed
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[0.85, 1.0, 1.25, 1.5].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setSpeechRate(rate)
                        rateRef.current = rate
                        if (audioPlayerRef.current && speechState === 'playing') {
                          audioPlayerRef.current.playbackRate = rate
                        }
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-mono transition-all border min-h-[32px] ${
                        speechRate === rate
                          ? 'border-white/40 bg-white/15 text-white font-semibold'
                          : 'border-white/10 text-secondary hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed Floating HUD Pill (Optimized for iPhone, iPad & Desktop) ── */}
      <nav 
        aria-label="Reader Controls"
        style={{
          bottom: 'calc(max(0.75rem, env(safe-area-inset-bottom, 0px)) + 0.5rem)'
        }}
        className="fixed left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0a0a0a]/92 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.85)] backdrop-blur-xl select-none max-w-[calc(100vw-1.25rem)] sm:max-w-2xl overflow-x-auto scrollbar-none touch-manipulation"
      >
        {/* Dynamic Time Remaining */}
        <div 
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 text-[8px] sm:text-[9px] font-mono tracking-[0.15em] sm:tracking-[0.2em] text-secondary/80 uppercase border-r border-white/10 shrink-0"
          title={`Chapter scroll progress: ${scrollPercent}%`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>
            {timeLeftMinutes > 0 ? (
              <>
                <span className="sm:hidden">{timeLeftMinutes}m</span>
                <span className="hidden sm:inline">{timeLeftMinutes} MIN LEFT</span>
              </>
            ) : (
              'END'
            )}
          </span>
        </div>

        {/* Hidden audio element — Brian voice playback engine */}
        <audio ref={audioPlayerRef} preload="none" style={{ display: 'none' }} />

        {/* Text-to-Speech Narration */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-1 sm:pr-2 shrink-0">
          {(speechState === 'idle') && (
            <button
              onClick={handleStartNarration}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all border border-transparent text-secondary hover:text-white hover:bg-white/5 min-h-[30px]"
              title="Listen to chapter narration — Brian voice"
            >
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>LISTEN</span>
            </button>
          )}

          {(speechState === 'loading') && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 min-h-[30px]">
              <svg className="w-3 h-3 text-emerald-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-emerald-400">Loading…</span>
            </div>
          )}

          {speechState === 'playing' && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePauseNarration}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold min-h-[30px]"
                title="Pause Narration"
              >
                <svg className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
                </svg>
                <span>PAUSE</span>
              </button>
              <button
                onClick={handleStopNarration}
                className="px-2 py-1 rounded-full text-[8px] font-mono uppercase tracking-[0.15em] border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-bold min-h-[30px]"
                title="Stop Narration Completely"
              >
                STOP
              </button>
              <button
                onClick={cycleSpeechRate}
                className="px-1.5 py-0.5 text-[8px] font-mono text-secondary hover:text-white uppercase tracking-wider rounded border border-white/10 min-h-[26px]"
                title="Change playback speed"
              >
                {speechRate}x
              </button>
            </div>
          )}

          {speechState === 'paused' && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleResumeNarration}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] border border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold min-h-[30px]"
                title="Resume Narration"
              >
                <span>RESUME</span>
              </button>
              <button
                onClick={handleStopNarration}
                className="px-2 py-1 rounded-full text-[8px] font-mono uppercase tracking-[0.15em] border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-bold min-h-[30px]"
                title="Stop Narration Completely"
              >
                STOP
              </button>
            </div>
          )}
        </div>

        {/* Ambient Noise (Focus) */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-1 sm:pr-2 shrink-0">
          {ambientType !== 'off' ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-blue-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping shrink-0" />
                {ambientType === 'rain' ? 'RAIN' : 'HUM'}
              </span>
              <button
                onClick={stopAmbient}
                className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-[0.15em] border border-red-500/40 bg-red-500/15 text-red-300 hover:bg-red-500/25 transition-all font-bold min-h-[26px]"
                title="Turn Off Ambient Noise"
              >
                STOP
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => startAmbient('rain')}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-secondary hover:text-white hover:bg-white/5 transition-all min-h-[30px]"
                title="Play Ambient Rain"
              >
                <svg className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>RAIN</span>
              </button>

              <button
                onClick={() => startAmbient('deep')}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-secondary hover:text-white hover:bg-white/5 transition-all min-h-[30px]"
                title="Play Deep Focus Hum"
              >
                <span>HUM</span>
              </button>
            </>
          )}
        </div>

        {/* Bionic Mode Quick Toggle */}
        <button
          onClick={() => setBionic(!bionic)}
          className={`px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all border shrink-0 min-h-[30px] ${
            bionic
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold'
              : 'border-transparent text-secondary hover:text-white hover:bg-white/5'
          }`}
          title="Toggle Bionic Reading Mode"
        >
          <span className="sm:hidden">BIO</span>
          <span className="hidden sm:inline">BIONIC</span>
        </button>

        {/* Typography / Settings (Aa) */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-serif font-bold uppercase transition-all border shrink-0 min-h-[30px] ${
            settingsOpen
              ? 'border-white/40 bg-white/10 text-white'
              : 'border-transparent text-secondary hover:text-white hover:bg-white/5'
          }`}
          title="Typography & Appearance"
        >
          <span>Aa</span>
        </button>
      </nav>
    </>
  )
}
