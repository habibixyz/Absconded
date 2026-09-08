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

// Voice Personas curated for literary essence, human inflection, and dynamic cadence
export const PERSONAS = {
  noir: {
    id: 'noir',
    label: 'Noir Baritone',
    badge: 'NOIR',
    desc: 'Deep, measured, contemplative baritone',
    basePitch: 0.88,
    baseRate: 0.88,
    epigraphPitch: 0.84,
    epigraphRate: 0.84,
    quotePitch: 0.84,
    quoteRate: 0.85,
    twistPitch: 0.82,
    twistRate: 0.85,
    sentencePause: 180,
    paragraphPause: 450,
    quotePause: 480
  },
  storyteller: {
    id: 'storyteller',
    label: 'Warm Memoir',
    badge: 'WARM',
    desc: 'Intimate, warm, conversational cadence',
    basePitch: 0.96,
    baseRate: 0.93,
    epigraphPitch: 0.92,
    epigraphRate: 0.90,
    quotePitch: 0.92,
    quoteRate: 0.90,
    twistPitch: 0.90,
    twistRate: 0.92,
    sentencePause: 140,
    paragraphPause: 380,
    quotePause: 420
  },
  british: {
    id: 'british',
    label: 'Literary British',
    badge: 'UK',
    desc: 'Classic, crisp Oxford/BBC narrative cadence',
    basePitch: 0.98,
    baseRate: 0.95,
    epigraphPitch: 0.94,
    epigraphRate: 0.92,
    quotePitch: 0.94,
    quoteRate: 0.92,
    twistPitch: 0.92,
    twistRate: 0.94,
    sentencePause: 140,
    paragraphPause: 360,
    quotePause: 400
  },
  studio: {
    id: 'studio',
    label: 'Modern Studio',
    badge: 'STUDIO',
    desc: 'Clear, modern, fluid audio-essay',
    basePitch: 1.0,
    baseRate: 1.02,
    epigraphPitch: 0.96,
    epigraphRate: 0.96,
    quotePitch: 0.96,
    quoteRate: 0.96,
    twistPitch: 0.95,
    twistRate: 0.98,
    sentencePause: 120,
    paragraphPause: 280,
    quotePause: 320
  }
}

// Select the most natural human voice available for the chosen persona
function selectVoiceForPersona(voices, personaKey) {
  if (!voices || voices.length === 0) return null
  const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'))
  if (enVoices.length === 0) return voices[0] || null

  const scored = enVoices.map(voice => {
    const name = voice.name.toLowerCase()
    let score = 10

    // Neural / Online natural voices give massive quality leap
    if (name.includes('natural') || name.includes('online')) score += 100
    if (name.includes('neural')) score += 90
    if (name.includes('premium') || name.includes('enhanced') || name.includes('studio')) score += 80

    // Specific persona affinities
    if (personaKey === 'noir') {
      if (name.includes('christopher') || name.includes('guy') || name.includes('ryan') || name.includes('male') || name.includes('daniel')) score += 50
      if (name.includes('uk english male')) score += 55
    } else if (personaKey === 'storyteller') {
      if (name.includes('jenny') || name.includes('sonia') || name.includes('samantha') || name.includes('serena') || name.includes('female') || name.includes('aria')) score += 50
    } else if (personaKey === 'british') {
      if (name.includes('uk') || name.includes('great britain') || name.includes('daniel') || name.includes('ryan') || name.includes('oliver') || name.includes('sonia')) score += 50
    }

    // Heavy penalty for legacy flat desktop voices (e.g. Microsoft David Desktop)
    if (name.includes('desktop') && (name.includes('david') || name.includes('zira') || name.includes('mark'))) {
      score -= 60
    }

    return { voice, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored[0]?.voice || enVoices[0]
}

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
  
  // Audio narration with Personas, Cadence Modulation & Sentence Queuing
  const [speechState, setSpeechState] = useState('idle') // 'idle', 'playing', 'paused'
  const [speechRate, setSpeechRate] = useState(1.0)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [personaKey, setPersonaKey] = useState('noir') // 'noir', 'storyteller', 'british', 'studio'
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('')
  const [availableVoices, setAvailableVoices] = useState([])
  const personaRef = useRef(personaKey)
  const segmentsRef = useRef([])
  const currentIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const rateRef = useRef(speechRate)
  const utteranceRef = useRef(null)
  const voicesRef = useRef([])
  const pauseTimeoutRef = useRef(null)

  useEffect(() => {
    rateRef.current = speechRate
  }, [speechRate])

  useEffect(() => {
    personaRef.current = personaKey
  }, [personaKey])

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

  // 2. Initialize Web Speech & Voice Cache
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if ('speechSynthesis' in window && window.speechSynthesis) {
        setSpeechSupported(true)
        const loadVoices = () => {
          try {
            const raw = window.speechSynthesis.getVoices()
            const v = Array.isArray(raw) ? raw : []
            voicesRef.current = v
            const en = v.filter(x => x && x.lang && typeof x.lang === 'string' && x.lang.toLowerCase().startsWith('en'))
            setAvailableVoices(en.length > 0 ? en : v)
          } catch (e) {
            console.warn('Voice enumeration note:', e)
          }
        }
        loadVoices()
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    } catch (err) {
      console.warn('SpeechSynthesis initialization:', err)
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        isPlayingRef.current = false
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
        try { window.speechSynthesis.cancel() } catch (e) {}
      }
    }
  }, [])

  // Auto-reset narration if reader chapter changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      isPlayingRef.current = false
      currentIndexRef.current = 0
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      window.speechSynthesis.cancel()
      setSpeechState('idle')
    }
  }, [chapterTitle, content])

  // Build clean segments with literary block context: epigraph, paragraphs, middle quotes (pull), twists, terminals
  const getCleanSegments = useCallback(() => {
    const rawBlocks = []
    if (epigraph) {
      rawBlocks.push({ text: epigraph, type: 'epigraph' })
    }
    if (Array.isArray(content)) {
      content.forEach(b => {
        if (b && b.text && b.type !== 'portrait') {
          rawBlocks.push({ text: b.text, type: b.type || 'p' })
        }
      })
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

  // Speak segment sequentially with dynamic persona inflection and breath pacing
  const speakSegment = useCallback((index) => {
    if (!isPlayingRef.current || typeof window === 'undefined' || !window.speechSynthesis) return
    const segments = segmentsRef.current
    if (index >= segments.length) {
      isPlayingRef.current = false
      setSpeechState('idle')
      currentIndexRef.current = 0
      utteranceRef.current = null
      if (typeof window !== 'undefined') window._activeUtterance = null
      return
    }

    const synth = window.speechSynthesis
    const segment = segments[index]
    const persona = PERSONAS[personaRef.current] || PERSONAS.noir
    const utterance = new SpeechSynthesisUtterance(segment.text)

    // Dynamic literary inflection: adjust pitch & rate by block type
    let computedPitch = persona.basePitch
    let computedRate = persona.baseRate * rateRef.current

    if (segment.type === 'epigraph') {
      computedPitch = persona.epigraphPitch
      computedRate = persona.epigraphRate * rateRef.current
    } else if (segment.type === 'pull') {
      computedPitch = persona.quotePitch
      computedRate = persona.quoteRate * rateRef.current
    } else if (segment.type === 'twist') {
      computedPitch = persona.twistPitch
      computedRate = persona.twistRate * rateRef.current
    } else if (segment.type === 'heading') {
      computedPitch = Math.min(1.2, persona.basePitch * 1.04)
      computedRate = persona.baseRate * 0.96 * rateRef.current
    } else if (segment.text.endsWith('?')) {
      computedPitch = Math.min(1.2, persona.basePitch * 1.03)
    }

    utterance.pitch = Math.max(0.6, Math.min(1.5, computedPitch))
    utterance.rate = Math.max(0.6, Math.min(2.0, computedRate))

    // Retain reference to prevent V8/Chromium GC mid-utterance
    utteranceRef.current = utterance
    if (typeof window !== 'undefined') {
      window._activeUtterance = utterance
    }

    const voices = voicesRef.current.length > 0 ? voicesRef.current : synth.getVoices()
    let chosenVoice = null

    if (selectedVoiceURI) {
      chosenVoice = voices.find(v => v.voiceURI === selectedVoiceURI)
    }
    if (!chosenVoice) {
      chosenVoice = selectVoiceForPersona(voices, personaRef.current)
    }
    if (chosenVoice) {
      utterance.voice = chosenVoice
    }

    utterance.onstart = () => {
      currentIndexRef.current = index
    }

    utterance.onend = () => {
      utteranceRef.current = null
      if (typeof window !== 'undefined') window._activeUtterance = null
      if (isPlayingRef.current) {
        currentIndexRef.current = index + 1

        // Natural human breath pause between sentences & paragraphs
        let pauseDuration = persona.sentencePause
        if (segment.isLastInBlock) {
          pauseDuration = persona.paragraphPause
        } else if (segment.type === 'pull' || segment.type === 'epigraph') {
          pauseDuration = persona.quotePause
        }

        pauseTimeoutRef.current = setTimeout(() => {
          if (isPlayingRef.current) {
            speakSegment(index + 1)
          }
        }, pauseDuration)
      }
    }

    utterance.onerror = (e) => {
      utteranceRef.current = null
      if (typeof window !== 'undefined') window._activeUtterance = null
      // Ignore cancellation/interruption caused by user pause or stop
      if (e.error !== 'interrupted' && e.error !== 'canceled' && isPlayingRef.current) {
        currentIndexRef.current = index + 1
        speakSegment(index + 1)
      }
    }

    synth.speak(utterance)
  }, [selectedVoiceURI])

  // Handle Narration: Play, Pause, Resume, Stop, Persona Switch
  const handleStartNarration = useCallback(() => {
    if (!speechSupported || typeof window === 'undefined' || !window.speechSynthesis) return
    const segments = getCleanSegments()
    if (segments.length === 0) return

    segmentsRef.current = segments
    currentIndexRef.current = 0
    isPlayingRef.current = true
    setSpeechState('playing')

    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    window.speechSynthesis.cancel()
    setTimeout(() => {
      if (isPlayingRef.current) {
        speakSegment(0)
      }
    }, 60)
  }, [speechSupported, getCleanSegments, speakSegment])

  const handlePauseNarration = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    isPlayingRef.current = false
    setSpeechState('paused')
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    window.speechSynthesis.cancel()
  }

  const handleResumeNarration = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    isPlayingRef.current = true
    setSpeechState('playing')
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    window.speechSynthesis.cancel()
    setTimeout(() => {
      if (isPlayingRef.current) {
        speakSegment(currentIndexRef.current)
      }
    }, 60)
  }

  const handleStopNarration = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    isPlayingRef.current = false
    currentIndexRef.current = 0
    setSpeechState('idle')
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    window.speechSynthesis.cancel()
  }

  const cycleSpeechRate = () => {
    const nextRate = speechRate === 1.0 ? 1.25 : speechRate === 1.25 ? 1.5 : 1.0
    setSpeechRate(nextRate)
    rateRef.current = nextRate
    if (speechState === 'playing') {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      window.speechSynthesis.cancel()
      setTimeout(() => {
        if (isPlayingRef.current) {
          speakSegment(currentIndexRef.current)
        }
      }, 60)
    }
  }

  const cyclePersona = () => {
    const keys = ['noir', 'storyteller', 'british', 'studio']
    const nextIdx = (keys.indexOf(personaKey) + 1) % keys.length
    const nextKey = keys[nextIdx]
    setPersonaKey(nextKey)
    personaRef.current = nextKey
    if (speechState === 'playing') {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      window.speechSynthesis.cancel()
      setTimeout(() => {
        if (isPlayingRef.current) {
          speakSegment(currentIndexRef.current)
        }
      }, 60)
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

            {/* Narration Voice Persona & Atmosphere */}
            <div className="space-y-2.5 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary block">
                  Voice Atmosphere
                </span>
                <span className="text-[9px] font-mono text-emerald-400">
                  {PERSONAS[personaKey]?.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'noir', label: 'Noir Baritone', desc: 'Cinematic & Deep' },
                  { id: 'storyteller', label: 'Warm Memoir', desc: 'Intimate & Natural' },
                  { id: 'british', label: 'Literary British', desc: 'Classic Oxford' },
                  { id: 'studio', label: 'Modern Studio', desc: 'Fluid & Crisp' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPersonaKey(p.id)
                      personaRef.current = p.id
                      if (speechState === 'playing') {
                        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
                        window.speechSynthesis.cancel()
                        setTimeout(() => {
                          if (isPlayingRef.current) speakSegment(currentIndexRef.current)
                        }, 60)
                      }
                    }}
                    className={`p-2.5 rounded-lg text-left transition-all border ${
                      personaKey === p.id
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-white font-semibold'
                        : 'border-white/10 text-secondary hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <div className="text-[11px] font-mono leading-tight">{p.label}</div>
                    <div className="text-[9px] text-secondary/70 font-sans mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>

              {/* Specific Voice Override Dropdown */}
              {availableVoices.length > 1 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-secondary mb-1">
                    <span>NARRATOR ENGINE</span>
                    {selectedVoiceURI && (
                      <button 
                        onClick={() => setSelectedVoiceURI('')}
                        className="text-amber-400 hover:underline"
                      >
                        Auto-select
                      </button>
                    )}
                  </div>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => {
                      setSelectedVoiceURI(e.target.value)
                      if (speechState === 'playing') {
                        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
                        window.speechSynthesis.cancel()
                        setTimeout(() => {
                          if (isPlayingRef.current) speakSegment(currentIndexRef.current)
                        }, 60)
                      }
                    }}
                    className="w-full bg-[#111] border border-white/15 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-white outline-none focus:border-white/40"
                  >
                    <option value="">Auto Natural ({PERSONAS[personaKey]?.label})</option>
                    {availableVoices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} {v.name.includes('Natural') || v.name.includes('Online') ? '[Natural]' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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

        {/* Text-to-Speech Narration */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-1 sm:pr-2 shrink-0">
          {speechState === 'idle' && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleStartNarration}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all border border-transparent text-secondary hover:text-white hover:bg-white/5 min-h-[30px]"
                title={`Listen with ${PERSONAS[personaKey]?.label}`}
              >
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>LISTEN</span>
              </button>
              <button
                onClick={cyclePersona}
                className="px-1.5 py-0.5 text-[8px] font-mono text-emerald-400 hover:text-emerald-300 uppercase tracking-wider rounded border border-emerald-500/30 bg-emerald-500/10 min-h-[26px]"
                title="Cycle Voice Persona (Noir / Warm / UK / Studio)"
              >
                {PERSONAS[personaKey]?.badge}
              </button>
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
              <button
                onClick={cyclePersona}
                className="px-1.5 py-0.5 text-[8px] font-mono text-emerald-400 hover:text-emerald-300 uppercase tracking-wider rounded border border-emerald-500/30 bg-emerald-500/10 min-h-[26px]"
                title="Cycle Voice Persona (Noir / Warm / UK / Studio)"
              >
                {PERSONAS[personaKey]?.badge}
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
              <button
                onClick={cyclePersona}
                className="px-1.5 py-0.5 text-[8px] font-mono text-emerald-400 hover:text-emerald-300 uppercase tracking-wider rounded border border-emerald-500/30 bg-emerald-500/10 min-h-[26px]"
                title="Cycle Voice Persona"
              >
                {PERSONAS[personaKey]?.badge}
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
