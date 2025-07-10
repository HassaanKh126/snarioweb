import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

// Create the LRU cache instance (outside the handler so it persists across calls)
const rateLimit = new LRUCache({
  max: 1000,             // track up to 1000 unique IPs
  ttl: 1000 * 60,        // each IP entry lives for 1 minute
});

const REQUESTS_PER_MINUTE = 5;

export async function POST(req) {
  // Get the client IP
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  // Look up how many times this IP has already called
  const currentCount = rateLimit.get(ip) || 0;

  if (currentCount >= REQUESTS_PER_MINUTE) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // Increment the count and store back
  rateLimit.set(ip, currentCount + 1);

  // Process the actual request
  const body = await req.json();

  const response = await fetch(process.env.SCRIPT_BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
