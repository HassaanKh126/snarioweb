import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.json();

        const backendRes = await fetch(`${process.env.BACKEND_AUTH_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: backendRes.status }
            );
        }

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { message: err.message || 'Server error' },
            { status: 500 }
        );
    }
}
