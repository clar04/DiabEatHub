// src/app/api/recipes/diabetes/route.js

import { NextResponse } from 'next/server';

// ==========================================
// BAGIAN 1: LOGIC SPOONACULAR (Langsung Disini)
// ==========================================
const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

function extractNutrients(nutritionObj) {
    const nutrients = nutritionObj.nutrients || [];
    const map = {
        'Calories': 'calories',
        'Carbohydrates': 'carbs_g',
        'Sugar': 'sugar_g',
        'Fiber': 'fiber_g',
        'Fat': 'fat_g',
        'Saturated Fat': 'saturated_fat_g',
        'Sodium': 'sodium_mg',
        'Protein': 'protein_g'
    };

    const result = {};
    Object.values(map).forEach(key => result[key] = 0);

    nutrients.forEach(n => {
        if (map[n.name]) {
            result[map[n.name]] = n.amount;
        }
    });

    return result;
}

async function fetchDiabetesRecipes(maxCarbs = 30) {
    if (!API_KEY) return []; // Safety check

    const params = new URLSearchParams({
        apiKey: API_KEY,
        addRecipeNutrition: true,
        maxCarbs: maxCarbs,
        number: 6
    });

    try {
        const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
        if (!res.ok) return [];

        const data = await res.json();
        const results = data.results || [];

        return results.map(item => ({
            id: item.id,
            name: item.title,
            image: item.image,
            ready_in_min: item.readyInMinutes || 0,
            source: 'spoonacular_recipe',
            raw: item,
            ...extractNutrients(item.nutrition || {})
        }));
    } catch (e) {
        console.error("Spoonacular Error:", e);
        return [];
    }
}

// ==========================================
// BAGIAN 2: LOGIC DIABETES RULES (Langsung Disini)
// ==========================================
function evaluateDiabetesRules(item) {
    const getVal = (val) => parseFloat(val) || 0;

    const nutrients = {
        calories: getVal(item.calories),
        carbs_g: getVal(item.carbs_g),
        sugar_g: getVal(item.sugar_g),
        fiber_g: getVal(item.fiber_g),
        fat_g: getVal(item.fat_g),
        saturated_fat_g: getVal(item.saturated_fat_g),
        sodium_mg: getVal(item.sodium_mg),
    };

    const calories = nutrients.calories > 0 ? nutrients.calories : 1;
    const flags = [];
    const notes = [];
    let score = 0;

    // A. Karbohidrat
    if (nutrients.carbs_g <= 45) {
        flags.push('carb_ok');
        score += 2;
    } else if (nutrients.carbs_g <= 60) {
        flags.push('carb_borderline');
        notes.push('Karbohidrat agak tinggi (45-60g), perhatikan porsi.');
    } else {
        flags.push('carb_high');
        notes.push('Tinggi karbohidrat (>60g). Sebaiknya dikurangi.');
    }

    // B. Gula
    if (nutrients.sugar_g <= 5) {
        flags.push('sugar_low');
        score += 2;
    } else if (nutrients.sugar_g <= 10) {
        flags.push('sugar_moderate');
    } else if (nutrients.sugar_g <= 20) {
        flags.push('sugar_high');
        notes.push('Gula cukup tinggi (>10g).');
    } else {
        flags.push('sugar_very_high');
        notes.push('Sangat tinggi gula (>20g)! Cari alternatif lain.');
    }

    // C. Serat
    if (nutrients.fiber_g >= 8) {
        flags.push('fiber_very_good');
        score += 2;
        notes.push('Kaya serat, sangat bagus untuk kontrol gula darah.');
    } else if (nutrients.fiber_g >= 5) {
        flags.push('fiber_good');
        score += 2;
    } else {
        flags.push('fiber_low');
        if (nutrients.carbs_g > 30) {
            notes.push('Rendah serat tapi tinggi karbo (risiko lonjakan gula).');
        }
    }

    // D. Lemak Jenuh
    const satFatPct = (nutrients.saturated_fat_g * 9 / calories) * 100;
    if (satFatPct <= 10 && nutrients.saturated_fat_g <= 4) {
        flags.push('satfat_ok');
        score += 1;
    } else {
        flags.push('satfat_high');
        notes.push('Tinggi lemak jenuh (>10% kalori), batasi konsumsi.');
    }

    // E. Sodium
    if (nutrients.sodium_mg <= 140) {
        flags.push('sodium_low');
        score += 1;
    } else if (nutrients.sodium_mg <= 400) {
        flags.push('sodium_ok');
        score += 1;
    } else if (nutrients.sodium_mg <= 700) {
        flags.push('sodium_caution');
        notes.push('Hati-hati, kandungan garam menengah.');
    } else {
        flags.push('sodium_high');
        notes.push('Tinggi garam (>700mg). Tidak disarankan untuk hipertensi.');
    }

    let category = 'not_recommended';
    let badgeColor = 'red';
    let label = 'Kurang Ideal';

    if (score >= 7) {
        category = 'diabetes_friendly';
        badgeColor = 'green';
        label = 'Ramah Diabetes';
    } else if (score >= 4) {
        category = 'can_be_adjusted';
        badgeColor = 'yellow';
        label = 'Boleh dengan Kontrol Porsi';
    }

    return {
        ...item,
        analysis: {
            score,
            category,
            label,
            badge_color: badgeColor,
            flags,
            notes,
            disclaimer: 'Informasi ini bukan saran medis. Konsultasikan dengan dokter/ahli gizi.'
        }
    };
}

// ==========================================
// BAGIAN 3: ENDPOINT UTAMA (GET)
// ==========================================
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const maxCarbs = searchParams.get('maxCarbs') || 30;

    // 1. Ambil data
    const recipes = await fetchDiabetesRecipes(maxCarbs);

    // 2. Evaluasi
    const evaluated = recipes.map(recipe => {
        const result = evaluateDiabetesRules(recipe);
        result.diabetes_friendly = (result.analysis.category === 'diabetes_friendly');
        return result;
    });

    return NextResponse.json({
        success: true,
        items: evaluated
    });
}