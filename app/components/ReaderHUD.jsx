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

// Curated acoustic parameters for natural, warm male literary narration
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

// Known female voice name fragments — never select these
const FEMALE_VOICE_FRAGMENTS = [
  'zira', 'samantha', 'serena', 'jenny', 'aria', 'victoria',
  'karen', 'hazel', 'susan', 'catherine', 'linda', 'moira',
  'sonia', 'tessa', 'fiona', 'kathy', 'vicki', 'alice',
  'ioana', 'monica', 'paulina', 'female', 'woman', 'girl',
  'eva', 'ava', 'allison', 'zoe', 'stephanie', 'sangeeta',
  'veena', 'priya', 'sfg', 'tpf', 'gda', 'afh', 'female_1',
  'female_2', 'female#', '#female', 'smt_en_us_f', 'f01',
  'siri voice 1', 'siri voice 4', 'google us english'
]

// Check if a voice is female
export function isFemaleVoice(voice) {
  if (!voice) return false
  const name = (voice.name || '').toLowerCase()
  const uri = (voice.voiceURI || '').toLowerCase()
  return FEMALE_VOICE_FRAGMENTS.some(f => name.includes(f) || uri.includes(f))
}

// Priority order: try each pattern in order; first match is used
const MALE_VOICE_PRIORITY = [
  // Edge Neural Cloud (only in Edge browser)
  { pattern: (n, uri, isEdge) => isEdge && (n.includes('christopher') || uri.includes('christopher')) && (n.includes('natural') || n.includes('online')), label: 'Edge Christopher Natural' },
  { pattern: (n, uri, isEdge) => isEdge && (n.includes('guy') || uri.includes('guy')) && (n.includes('natural') || n.includes('online')), label: 'Edge Guy Natural' },
  { pattern: (n, uri, isEdge) => isEdge && (n.includes('ryan') || uri.includes('ryan')) && (n.includes('natural') || n.includes('online')), label: 'Edge Ryan Natural' },
  { pattern: (n, uri, isEdge) => isEdge && (n.includes('eric') || uri.includes('eric')) && (n.includes('natural') || n.includes('online')), label: 'Edge Eric Natural' },

  // Google Chrome & Android Google TTS Male Voices
  { pattern: (n, uri) => n === 'google uk english male' || uri === 'google uk english male', label: 'Google UK Male' },
  { pattern: (n, uri) => (n.includes('google') || uri.includes('google')) && (n.includes('male') || uri.includes('male')) && !n.includes('female'), label: 'Google UK Male (fuzzy)' },
  { pattern: (n, uri) => n.includes('#male') || uri.includes('#male') || n.includes('male_1') || uri.includes('male_1'), label: 'Android Google TTS Male (explicit)' },
  { pattern: (n, uri) => uri.includes('en-us-x-iom') || uri.includes('en-us-x-iob') || uri.includes('en-us-x-iol') || uri.includes('en-gb-x-rjs') || uri.includes('en-in-x-cce') || uri.includes('en-au-x-aub'), label: 'Android Male Voice Package' },

  // Apple macOS / iOS (iPhone & iPad & Mac)
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('daniel') || uri.includes('daniel')) && (n.includes('enhanced') || n.includes('premium')), label: 'Apple Daniel Enhanced' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('arthur') || uri.includes('arthur')), label: 'Apple Arthur' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('aaron') || uri.includes('aaron')), label: 'Apple Aaron' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('gordon') || uri.includes('gordon')), label: 'Apple Gordon' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('oliver') || uri.includes('oliver')), label: 'Apple Oliver' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('rishi') || uri.includes('rishi')), label: 'Apple Rishi' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('alex') || uri.includes('alex')), label: 'Apple Alex' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('daniel') || uri.includes('daniel')), label: 'Apple Daniel' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('fred') || uri.includes('fred')), label: 'Apple Fred' },
  { pattern: (n, uri, _, isApple) => isApple && (n.includes('siri voice 2') || n.includes('siri voice 3')), label: 'Apple Siri Male' },

  // Samsung Mobile TTS Male
  { pattern: (n, uri) => (n.includes('samsung') || uri.includes('samsung')) && (n.includes('male') || uri.includes('m01') || uri.includes('m02')), label: 'Samsung Male' },

  // Windows Desktop SAPI / OneCore
  { pattern: (n) => n.includes('david') && !n.includes('desktop'), label: 'Microsoft David' },
  { pattern: (n) => n.includes('mark') && !n.includes('desktop'), label: 'Microsoft Mark' },
  { pattern: (n) => n.includes('george'), label: 'Microsoft George' },
  { pattern: (n) => n.includes('ravi'), label: 'Microsoft Ravi' },
  { pattern: (n) => n.includes('richard'), label: 'Microsoft Richard' },
  { pattern: (n) => n.includes('james'), label: 'Microsoft James' },
  { pattern: (n) => n.includes('david'), label: 'Microsoft David' },

  // Generic male patterns
  { pattern: (n, uri) => (n.includes('male') || uri.includes('male')) && !n.includes('female') && !uri.includes('female'), label: 'Generic male' },
]

// Determine if a given voice is a recognized male voice
export function isMaleVoiceCandidate(voice) {
  if (!voice) return false
  if (isFemaleVoice(voice)) return false
  const name = (voice.name || '').toLowerCase()
  const uri = (voice.voiceURI || '').toLowerCase()
  const isEdge = typeof navigator !== 'undefined' && /Edg\//i.test(navigator.userAgent)
  const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
  return MALE_VOICE_PRIORITY.some(rule => rule.pattern(name, uri, isEdge, isApple))
}

// Select the single best human male voice. Returns best male voice or null.
export function selectSingleMaleVoice(voices) {
  if (!voices || voices.length === 0) return null

  const isEdge = typeof navigator !== 'undefined' && /Edg\//i.test(navigator.userAgent)
  const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Only English voices as candidates if available
  const enVoices = voices.filter(v => {
    if (!v || !v.lang) return false
    const lang = v.lang.toLowerCase()
    return lang.startsWith('en')
  })
  const pool = enVoices.length > 0 ? enVoices : voices

  // 1. Apply priority list in order — first match wins
  for (const rule of MALE_VOICE_PRIORITY) {
    for (const v of pool) {
      if (isFemaleVoice(v)) continue
      const name = (v.name || '').toLowerCase()
      const uri = (v.voiceURI || '').toLowerCase()
      // Skip Edge online voices in non-Edge browsers (will fail silently)
      if (!isEdge && (name.includes('online') || name.includes('natural'))) continue
      if (rule.pattern(name, uri, isEdge, isApple)) {
        return v
      }
    }
  }

  // 2. Secondary fallback: any voice in pool that is confirmed NOT female
  for (const v of pool) {
    if (!isFemaleVoice(v)) {
      const name = (v.name || '').toLowerCase()
      if (!isEdge && (name.includes('online') || name.includes('natural'))) continue
      return v
    }
  }

  // 3. Last fallback: return the first voice in pool rather than null (with lowered pitch in speakSegment)
  return pool[0] || null
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
  
  // Audio narration with Single Natural Studio Male Narrator (Audible / Amazon quality)
  const [speechState, setSpeechState] = useState('idle') // 'idle', 'playing', 'paused'
  const [speechRate, setSpeechRate] = useState(1.0)
  const segmentsRef = useRef([])
  const currentIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const rateRef = useRef(speechRate)
  const audioPlayerRef = useRef(null)
  const preloadAudioRef = useRef(null)
  const pauseTimeoutRef = useRef(null)

  useEffect(() => {
    rateRef.current = speechRate
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speechRate
    }
  }, [speechRate])

  // Stop audio on unmount or chapter change
  useEffect(() => {
    return () => {
      isPlayingRef.current = false
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.src = ''
        audioPlayerRef.current = null
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel() } catch (e) {}
      }
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
            const pool = en.length > 0 ? en : v
            setAvailableVoices(pool)

            try {
              const savedUri = typeof window !== 'undefined' ? localStorage.getItem('reader_preferred_voice_uri') : null
              if (savedUri && pool.some(x => x.voiceURI === savedUri)) {
                setSelectedVoiceURI(savedUri)
              } else {
                const auto = selectSingleMaleVoice(pool)
                if (auto?.voiceURI) {
                  setSelectedVoiceURI(auto.voiceURI)
                }
              }
            } catch (e) {}
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

  // Auto-reset narration if reader book, chapter, or content changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      isPlayingRef.current = false
      currentIndexRef.current = 0
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      try { window.speechSynthesis.cancel() } catch (e) {}
      setSpeechState('idle')
    }
  }, [bookTitle, chapterTitle, content])

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

  // Fallback speech synthesis if device is offline
  const speakFallbackSpeechSynthesis = useCallback((segment, index) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !isPlayingRef.current) return
    try {
      const synth = window.speechSynthesis
      synth.cancel()
      const utterance = new SpeechSynthesisUtterance(segment.text)
      utterance.lang = 'en-US'
      utterance.rate = MALE_NARRATOR.baseRate * rateRef.current
      utterance.pitch = 0.68 // Baritone modulation
      utterance.onend = () => {
        if (isPlayingRef.current) {
          currentIndexRef.current = index + 1
          const pauseTime = segment.isLastInBlock ? 380 : 140
          pauseTimeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) speakSegment(index + 1)
          }, pauseTime)
        }
      }
      utterance.onerror = () => {
        if (isPlayingRef.current) {
          currentIndexRef.current = index + 1
          speakSegment(index + 1)
        }
      }
      synth.speak(utterance)
    } catch (err) {
      if (isPlayingRef.current) {
        currentIndexRef.current = index + 1
        speakSegment(index + 1)
      }
    }
  }, [])

  // Speak segment sequentially with Studio-grade Neural Audiobook Voice (Christopher)
  const speakSegment = useCallback((index) => {
    if (!isPlayingRef.current || typeof window === 'undefined') return
    const segments = segmentsRef.current
    if (!segments || index >= segments.length) {
      isPlayingRef.current = false
      setSpeechState('idle')
      currentIndexRef.current = 0
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.src = ''
      }
      return
    }

    const segment = segments[index]
    if (!segment || !segment.text) {
      if (index + 1 < segments.length) {
        speakSegment(index + 1)
      } else {
        isPlayingRef.current = false
        setSpeechState('idle')
        currentIndexRef.current = 0
      }
      return
    }

    currentIndexRef.current = index

    // Stop any currently playing audio
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.src = ''
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch (e) {}
    }

    // Preload next segment in background for zero-latency gapless transitions
    if (index + 1 < segments.length && segments[index + 1]?.text) {
      try {
        const nextUrl = `/api/tts?text=${encodeURIComponent(segments[index + 1].text)}&rate=${rateRef.current}`
        if (!preloadAudioRef.current) {
          preloadAudioRef.current = new Audio()
        }
        preloadAudioRef.current.src = nextUrl
        preloadAudioRef.current.preload = 'auto'
      } catch (e) {}
    }

    // Stream studio-grade natural human audio from our dedicated TTS endpoint
    const audioUrl = `/api/tts?text=${encodeURIComponent(segment.text)}&rate=${rateRef.current}`
    const audio = new Audio(audioUrl)
    audioPlayerRef.current = audio

    audio.onended = () => {
      audioPlayerRef.current = null
      if (isPlayingRef.current) {
        currentIndexRef.current = index + 1
        const pauseTime = segment.isLastInBlock ? 380 : (segment.type === 'pull' || segment.type === 'epigraph' ? 420 : 160)
        pauseTimeoutRef.current = setTimeout(() => {
          if (isPlayingRef.current) {
            speakSegment(index + 1)
          }
        }, pauseTime)
      }
    }

    audio.onerror = () => {
      console.warn('Audio streaming notice: Falling back to local synthesizer')
      speakFallbackSpeechSynthesis(segment, index)
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio playback notice:', err)
        // If audio stream fails or blocked by user gesture, try fallback
        speakFallbackSpeechSynthesis(segment, index)
      })
    }
  }, [speakFallbackSpeechSynthesis])

  // Handle Narration: Play, Pause, Resume, Stop (Synchronous user activation)
  const handleStartNarration = useCallback(() => {
    if (typeof window === 'undefined') return
    const segments = getCleanSegments()
    if (!segments || segments.length === 0) return

    segmentsRef.current = segments
    currentIndexRef.current = 0
    isPlayingRef.current = true
    setSpeechState('playing')

    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)

    // Execute immediately in current user gesture frame!
    speakSegment(0)
  }, [getCleanSegments, speakSegment])

  const handlePauseNarration = () => {
    if (typeof window === 'undefined') return
    isPlayingRef.current = false
    setSpeechState('paused')
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    if (audioPlayerRef.current) {
      try { audioPlayerRef.current.pause() } catch (e) {}
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch (e) {}
    }
  }

  const handleResumeNarration = () => {
    if (typeof window === 'undefined') return
    isPlayingRef.current = true
    setSpeechState('playing')
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)

    if (audioPlayerRef.current && audioPlayerRef.current.src && !audioPlayerRef.current.ended) {
      audioPlayerRef.current.play().catch(() => {
        speakSegment(currentIndexRef.current)
      })
    } else {
      speakSegment(currentIndexRef.current)
    }
  }

  const handleStopNarration = () => {
    if (typeof window === 'undefined') return
    isPlayingRef.current = false
    currentIndexRef.current = 0
    setSpeechState('idle')
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.src = ''
        audioPlayerRef.current = null
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch (e) {}
    }
  }

  const cycleSpeechRate = () => {
    const nextRate = speechRate === 1.0 ? 1.25 : speechRate === 1.25 ? 1.5 : 1.0
    setSpeechRate(nextRate)
    rateRef.current = nextRate
    if (speechState === 'playing') {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      if (audioPlayerRef.current) {
        try { audioPlayerRef.current.pause() } catch (e) {}
      }
      setTimeout(() => {
        if (isPlayingRef.current) {
          speakSegment(currentIndexRef.current)
        }
      }, 50)
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
                        if (speechState === 'playing') {
                          if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
                          try { window.speechSynthesis.cancel() } catch (e) {}
                          setTimeout(() => {
                            if (isPlayingRef.current) speakSegment(currentIndexRef.current)
                          }, 60)
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

        {/* Text-to-Speech Narration */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-1 sm:pr-2 shrink-0">
          {speechState === 'idle' && (
            <button
              onClick={handleStartNarration}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all border border-transparent text-secondary hover:text-white hover:bg-white/5 min-h-[30px]"
              title="Listen to chapter narration with natural male voice"
            >
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>LISTEN</span>
            </button>
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
