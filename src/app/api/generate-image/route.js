import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// Create the LRU cache instance (lives outside the handler so it persists)
const rateLimit = new LRUCache({
  max: 1000,             // track up to 1000 unique IPs
  ttl: 1000 * 60,        // each IP entry lives for 1 minute
});

const REQUESTS_PER_MINUTE = 5;

export async function POST(req) {
  try {
    // Get client IP (fallback to 'unknown')
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Check current request count
    const currentCount = rateLimit.get(ip) || 0;

    if (currentCount >= REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Increment counter
    rateLimit.set(ip, currentCount + 1);

    // Read request body
    const { userId, prompt, ar, id } = await req.json();

    // Decide endpoint
    const endpoint =
      id === ""
        ? `${process.env.PROJECTS_URL}/api/create-image`
        : `${process.env.PROJECTS_URL}/api/add-image`;

    // Call backend
    const backendRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, prompt, ar, id }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || data?.success !== true) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
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
