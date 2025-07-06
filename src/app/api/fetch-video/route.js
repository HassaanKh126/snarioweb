import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { id } = await req.json();

        const backendRes = await fetch(`${process.env.PROJECTS_URL}/api/fetch-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        
        if (!backendRes.ok) {
            const error = await backendRes.json();
            return NextResponse.json(
                { error: error.error || 'Failed to fetch video' },
                { status: 500 }
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
