import { NextResponse } from 'next/server'
import { Communicate } from 'edge-tts-universal'

export const runtime = 'nodejs'

// In-memory audio segment cache (prevents redundant TTS calls for the same sentence)
const audioCache = new Map()
const MAX_CACHE_SIZE = 500

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get('text')
  const rate = parseFloat(searchParams.get('rate') || '1.0')
  return handleTTS(text, rate)
}

export async function POST(req) {
  try {
    const body = await req.json()
    const text = body.text
    const rate = parseFloat(body.rate || '1.0')
    return handleTTS(text, rate)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }
}

async function handleTTS(rawText, rate = 1.0) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 })
  }

  const text = rawText.trim()
  const clampedRate = Math.max(0.7, Math.min(1.8, isNaN(rate) ? 1.0 : rate))
  const ratePercent = Math.round((clampedRate - 1.0) * 100)
  const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`

  // Cache key
  const cacheKey = `${clampedRate.toFixed(2)}:${text}`
  if (audioCache.has(cacheKey)) {
    const cachedBuffer = audioCache.get(cacheKey)
    return new NextResponse(cachedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800, immutable'
      }
    })
  }

  try {
    // Single perfect studio narrator voice: en-US-ChristopherNeural (warm, natural, non-robotic)
    const communicate = new Communicate(text, {
      voice: 'en-US-ChristopherNeural',
      rate: rateStr,
      pitch: '+0Hz'
    })

    const chunks = []
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio' && chunk.data) {
        chunks.push(chunk.data)
      }
    }

    if (chunks.length === 0) {
      return NextResponse.json({ error: 'No audio generated' }, { status: 500 })
    }

    const fullBuffer = Buffer.concat(chunks)

    // Store in LRU-style cache
    if (audioCache.size >= MAX_CACHE_SIZE) {
      const firstKey = audioCache.keys().next().value
      audioCache.delete(firstKey)
    }
    audioCache.set(cacheKey, fullBuffer)

    return new NextResponse(fullBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800, immutable'
      }
    })
  } catch (err) {
    console.error('Edge TTS streaming error:', err)
    return NextResponse.json({ error: 'Speech synthesis error: ' + (err?.message || 'unknown') }, { status: 500 })
  }
}
