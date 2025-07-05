import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();

        const backendRes = await fetch(`${process.env.PROJECTS_URL}/api/create-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!backendRes.ok) {
            const error = await backendRes.json();
            return NextResponse.json({ error: error.error || 'Failed' }, { status: 500 });
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
