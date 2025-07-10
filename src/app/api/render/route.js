import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// LRU cache instance
const rateLimit = new LRUCache({
  max: 1000,             // track up to 1000 unique IPs
  ttl: 1000 * 60,        // each IP entry lives for 1 minute
});

const REQUESTS_PER_MINUTE = 5;

export async function POST(req) {
  try {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    const currentCount = rateLimit.get(ip) || 0;

    if (currentCount >= REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Increment count
    rateLimit.set(ip, currentCount + 1);

    // Parse request body
    const body = await req.json();

    // Call backend
    const backendRes = await fetch(`${process.env.RENDER_LINK}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to render video' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
