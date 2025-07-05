import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'id is required' }, { status: 400 });
        }

        // Call your actual backend service here
        const backendRes = await fetch(`${process.env.PROJECTS_URL}/api/get-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!backendRes.ok) {
            const error = await backendRes.json();
            return NextResponse.json(
                { error: error.error || 'Failed to fetch image' },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: err.message || 'Server error' },
            { status: 500 }
        );
    }
}
