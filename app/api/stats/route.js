import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const localDbPath = path.join(process.cwd(), 'public', 'views.json');

// Helper to hash IP + User Agent natively using Web Crypto API
async function getReaderHash(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const ua = request.headers.get('user-agent') || '';
  
  const msgBuffer = new TextEncoder().encode(ip + ua);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper to execute Upstash/Vercel KV REST commands without SDK
async function runKvCommand(command, isPipeline = false) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    return null; // Fallback to local file db
  }

  try {
    const endpoint = isPipeline ? `${url}/pipeline` : url;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error("Vercel KV returned non-200:", res.status);
      return null;
    }
    
    const data = await res.json();
    return isPipeline ? data.map(d => d.result) : data.result;
  } catch (err) {
    console.error("Error connecting to Vercel KV REST API:", err);
    return null;
  }
}

// Local file database helpers for development fallback
function readLocalDb() {
  try {
    if (!fs.existsSync(localDbPath)) {
      return {};
    }
    const data = fs.readFileSync(localDbPath, 'utf-8');
    return JSON.parse(data || '{}');
  } catch (e) {
    console.error("Error reading local views db:", e);
    return {};
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing local views db:", e);
  }
}

// GET: Fetch unique reader counts for all books
export async function GET() {
  const bookIds = [
    "absconded", 
    "mask-beneath", 
    "frequency-of-kin", 
    "the-mask-compiler", 
    "the-last-performance-review", 
    "the-deletion-protocol", 
    "the-counterparty",
    "silent-protocol",
    "room-between-lives"
  ];
  
  const stats = {};
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;

  if (url) {
    // Production Vercel KV mode: build a pipeline to get all SCARD sizes
    const pipeline = bookIds.map(id => ["SCARD", `book:${id}:readers`]);
    const results = await runKvCommand(pipeline, true);
    
    if (results) {
      bookIds.forEach((id, index) => {
        stats[id] = results[index] || 0;
      });
      return NextResponse.json({ stats, source: "kv" });
    }
  }

  // Local file fallback mode (or if KV fails)
  const localDb = readLocalDb();
  bookIds.forEach(id => {
    stats[id] = localDb[id] ? localDb[id].length : 0;
  });
  
  return NextResponse.json({ stats, source: "local" });
}

// POST: Register a unique view/read action for a book
export async function POST(request) {
  try {
    const { bookId } = await request.json();
    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
    }

    const hash = await getReaderHash(request);
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;

    if (url) {
      // Production Vercel KV mode
      const pipeline = [
        ["SADD", `book:${bookId}:readers`, hash],
        ["SCARD", `book:${bookId}:readers`]
      ];
      const results = await runKvCommand(pipeline, true);
      if (results) {
        return NextResponse.json({ 
          success: true, 
          added: results[0] === 1, 
          count: results[1] || 0,
          source: "kv"
        });
      }
    }

    // Local file fallback mode
    const localDb = readLocalDb();
    if (!localDb[bookId]) {
      localDb[bookId] = [];
    }

    const alreadyRead = localDb[bookId].includes(hash);
    if (!alreadyRead) {
      localDb[bookId].push(hash);
      writeLocalDb(localDb);
    }

    return NextResponse.json({
      success: true,
      added: !alreadyRead,
      count: localDb[bookId].length,
      source: "local"
    });

  } catch (error) {
    console.error("Error registering view:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
