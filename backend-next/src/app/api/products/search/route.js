import { NextResponse } from 'next/server';

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';
// Base URL khusus untuk gambar produk Spoonacular
const IMAGE_BASE_URL = 'https://img.spoonacular.com/products/';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json(
            { success: false, message: 'Butuh query pencarian' },
            { status: 400 }
        );
    }

    try {
        const params = new URLSearchParams({
            apiKey: API_KEY,
            query: query,
            number: '10', // Kirim sebagai string
            // addProductInformation: true // HAPUS INI: Parameter ini biasanya tidak valid untuk endpoint search products, cuma bikin berat/error.
        });

        const res = await fetch(`${BASE_URL}/food/products/search?${params}`);

        // Cek jika API Spoonacular error (misal quota habis)
        if (!res.ok) {
            throw new Error(`Spoonacular API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        // Safety check: pastikan data.products ada dan berupa array
        const rawProducts = Array.isArray(data.products) ? data.products : [];

        const products = rawProducts.map(item => {
            // LOGIKA GAMBAR LEBIH AMAN:
            // Cek apakah image sudah full URL (https...) atau masih nama file saja.
            // Jika nama file saja, gabungkan dengan IMAGE_BASE_URL.
            let imageUrl = item.image;
            if (item.image && !item.image.startsWith('http')) {
                imageUrl = `${IMAGE_BASE_URL}${item.image}`;
            }

            return {
                id: item.id,
                title: item.title,
                image: imageUrl, // Gunakan URL yang sudah dipastikan lengkap
                imageType: item.imageType,
                source: 'spoonacular_product'
            };
        });

        return NextResponse.json({
            success: true,
            items: products
        });

    } catch (error) {
        console.error("Product Search Error:", error);
        return NextResponse.json(
            { success: false, items: [], error: error.message },
            { status: 500 }
        );
    }
}