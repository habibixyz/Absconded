import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    // Handle Search Proxy
    if (search) {
      try {
        const gdRes = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(search.trim())}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AbscondedReader/1.0)',
            'Accept': 'application/json'
          },
          next: { revalidate: 3600 }
        });
        if (gdRes.ok) {
          const data = await gdRes.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.error("Search proxy error:", err);
      }
      return NextResponse.json({ results: [] });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing book ID or search parameter" }, { status: 400 });
    }

    const cleanId = id.replace(/[^0-9]/g, '');
    if (!cleanId) {
      return NextResponse.json({ error: "Invalid Gutenberg ID" }, { status: 400 });
    }

    // Try Gutenberg mirror endpoints server-side (no browser CORS)
    const urls = [
      `https://www.gutenberg.org/files/${cleanId}/${cleanId}-0.txt`,
      `https://www.gutenberg.org/cache/epub/${cleanId}/pg${cleanId}.txt`,
      `https://raw.githubusercontent.com/GITenberg/${cleanId}/master/${cleanId}.txt`
    ];

    let text = "";
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/plain,text/html,*/*'
          },
          next: { revalidate: 86400 } // Cache 24 hours
        });

        if (res.ok) {
          text = await res.text();
          if (text && text.length > 200) {
            break;
          }
        }
      } catch (e) {
        // try next url
      }
    }

    // Fallback: try querying Gutendex for direct format links
    if (!text || text.length < 200) {
      try {
        const gdRes = await fetch(`https://gutendex.com/books/${cleanId}`);
        if (gdRes.ok) {
          const gdData = await gdRes.json();
          const textUrl = gdData.formats?.['text/plain; charset=utf-8'] || gdData.formats?.['text/plain; charset=us-ascii'] || gdData.formats?.['text/plain'];
          if (textUrl) {
            const tRes = await fetch(textUrl);
            if (tRes.ok) {
              text = await tRes.text();
            }
          }
        }
      } catch (e) {}
    }

    if (!text || text.length < 100) {
      return NextResponse.json({ error: "Could not retrieve manuscript text from Project Gutenberg." }, { status: 404 });
    }

    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
    console.error("Transcode API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
