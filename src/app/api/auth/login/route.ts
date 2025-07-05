import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        const backendRes = await fetch(`${process.env.BACKEND_AUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!backendRes.ok) {
            const { message } = await backendRes.json();
            return NextResponse.json({ error: message || 'Login failed' }, { status: 401 });
        }

        // 📝 Copy the set-cookie header from backend to browser if needed
        const response = NextResponse.json({ success: true });
        const setCookie = backendRes.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;

    } catch (err) {
        return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 });
    }
}
