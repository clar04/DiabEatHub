import { NextResponse } from 'next/server';

export async function GET(request) {
    return NextResponse.json({
        id: 1,
        name: "Pengguna Testing",
        email: "test@diabeat.com",
        profile_photo_url: "https://ui-avatars.com/api/?name=Pengguna+Testing"
    });
}