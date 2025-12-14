import { NextResponse } from 'next/server';

export async function POST(request) {
    // Kita pura-pura baca body request (email/password) tapi diabaikan saja
    const body = await request.json().catch(() => { });

    // Langsung kembalikan SUKSES
    return NextResponse.json({
        success: true,
        message: "Login Berhasil (Mode Testing)",
        // Data user dummy
        user: {
            id: 1,
            name: "Pengguna Testing",
            email: body?.email || "test@diabeat.com",
            role: "user"
        },
        // Token palsu (biar frontend seneng)
        token: "dummy-token-12345-abcdef"
    });
}