import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();

        const backendRes = await fetch(`${process.env.RENDER_LINK}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json({ error: data.error || 'Failed to render video' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
