import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = await cookies(); // Next.js built-in cookie reader
  const sessionCookie = cookieStore.get('sntoken');

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate the session cookie with your auth backend
  const authRes = await fetch(`${process.env.BACKEND_AUTH_URL}/api/auth/check`, {
    headers: {
      cookie: `${sessionCookie.name}=${sessionCookie.value}`,
    },
    credentials: 'include',
  });

  if (!authRes.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await authRes.json();

  // 🚀 User is authenticated here — proceed to call your backend
  const body = await req.json();

  const response = await fetch(process.env.SCRIPT_BACKEND_URL!, {
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
