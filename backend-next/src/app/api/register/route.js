import { NextResponse } from 'next/server';

export async function POST(request) {
    return NextResponse.json({
        success: true,
        message: "Registrasi Berhasil (Mode Testing)",
        user: {
            id: 2,
            name: "User Baru",
            email: "new@diabeat.com",
        },
        token: "dummy-token-register-xyz"
    });
}