import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userId } = await req.json();

        const backendRes = await fetch(`${process.env.PROJECTS_URL}/api/get-images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        
        if (!backendRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
        }

        const data = await backendRes.json();
        return NextResponse.json({ images: data.images || [] });
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
