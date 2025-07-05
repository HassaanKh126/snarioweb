import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userId } = await req.json();

        const backendRes = await fetch(`${process.env.PROJECTS_URL}/api/get-videos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (!backendRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
        }

        const data = await backendRes.json();
        return NextResponse.json({ videos: data.videos || [] });
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
