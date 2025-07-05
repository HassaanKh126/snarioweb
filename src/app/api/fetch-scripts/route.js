import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userId } = await req.json();

        const backendRes = await fetch(`${process.env.PROJECTS_URL}/api/fetch-scripts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (!backendRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch scripts' }, { status: 500 });
        }

        const data = await backendRes.json();
        return NextResponse.json({ scripts: data.scripts || [] });
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
