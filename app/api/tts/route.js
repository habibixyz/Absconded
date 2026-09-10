export const dynamic = 'force-dynamic'

/**
 * Natural Human Male TTS Proxy
 * Uses studio quality male narrator voice (en_male_narration / en_us_006)
 * GET /api/tts?text=Hello+World
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const text = (searchParams.get('text') || '').trim().slice(0, 300)

  if (!text) {
    return new Response('No text provided', { status: 400 })
  }

  // 1. Primary: Studio Male Narrator (en_male_narration)
  try {
    const upstream = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        text: text,
        voice: 'en_male_narration'
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (upstream.ok) {
      const json = await upstream.json()
      if (json.success && json.data) {
        const audioBuffer = Buffer.from(json.data, 'base64')
        return new Response(audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400',
            'X-TTS-Voice': 'en_male_narration',
          },
        })
      }
    }
  } catch (err) {
    console.warn('[TTS Proxy] Primary narrator attempt failed:', err?.message || err)
  }

  // 2. Secondary fallback: Deep Male Voice (en_us_006)
  try {
    const upstream2 = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        text: text,
        voice: 'en_us_006'
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (upstream2.ok) {
      const json2 = await upstream2.json()
      if (json2.success && json2.data) {
        const audioBuffer2 = Buffer.from(json2.data, 'base64')
        return new Response(audioBuffer2, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400',
            'X-TTS-Voice': 'en_us_006',
          },
        })
      }
    }
  } catch (err) {
    console.warn('[TTS Proxy] Secondary narrator attempt failed:', err?.message || err)
  }

  // 3. Final resilience fallback: Google TTS audio proxy
  try {
    const googleRes = await fetch(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(6000),
      }
    )
    if (googleRes.ok) {
      const audioArray = await googleRes.arrayBuffer()
      return new Response(audioArray, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'X-TTS-Voice': 'google-fallback',
        },
      })
    }
  } catch (err) {
    console.error('[TTS Proxy] All TTS fallbacks failed:', err?.message || err)
  }

  return new Response('TTS service unavailable', { status: 503 })
}
