import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userId, prompt, ar, id } = await req.json();

        // determine which endpoint to call
        const endpoint =
            id === ""
                ? `${process.env.PROJECTS_URL}/api/create-image`
                : `${process.env.PROJECTS_URL}/api/add-image`;

        const backendRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, prompt, ar, id }),
        });

        const data = await backendRes.json();

        if (!backendRes.ok || data?.success !== true) {
            return NextResponse.json(
                { error: 'Failed to generate image' },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: err.message || 'Server error' },
            { status: 500 }
        );
    }
}
