import { NextResponse } from 'next/server';

// --- CONFIG ---
const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// --- HELPER NUTRISI ---
function extractNutrients(nutritionObj) {
    const nutrients = nutritionObj.nutrients || [];
    const map = {
        'Calories': 'calories', 'Carbohydrates': 'carbs_g', 'Sugar': 'sugar_g',
        'Fiber': 'fiber_g', 'Fat': 'fat_g', 'Saturated Fat': 'saturated_fat_g',
        'Sodium': 'sodium_mg', 'Protein': 'protein_g'
    };
    const result = {};
    Object.values(map).forEach(key => result[key] = 0);
    nutrients.forEach(n => {
        if (map[n.name]) result[map[n.name]] = n.amount;
    });
    return result;
}

// --- LOGIC DIABETES ---
function evaluateDiabetesRules(item) {
    const getVal = (val) => parseFloat(val) || 0;
    const n = {
        calories: getVal(item.calories), carbs_g: getVal(item.carbs_g),
        sugar_g: getVal(item.sugar_g), fiber_g: getVal(item.fiber_g),
        fat_g: getVal(item.fat_g), saturated_fat_g: getVal(item.saturated_fat_g),
        sodium_mg: getVal(item.sodium_mg),
    };

    let score = 0;
    const flags = [];
    const notes = [];

    // Logic Sederhana (sesuai file Laravel kamu)
    if (n.carbs_g <= 45) { flags.push('carb_ok'); score += 2; }
    else if (n.carbs_g <= 60) { flags.push('carb_borderline'); }
    else { flags.push('carb_high'); }

    if (n.sugar_g <= 5) { flags.push('sugar_low'); score += 2; }
    else if (n.sugar_g > 20) { flags.push('sugar_very_high'); }

    if (n.fiber_g >= 5) { flags.push('fiber_good'); score += 2; }

    let category = 'not_recommended';
    let badgeColor = 'red';
    let label = 'Kurang Ideal';

    if (score >= 6) {
        category = 'diabetes_friendly'; badgeColor = 'green'; label = 'Ramah Diabetes';
    } else if (score >= 4) {
        category = 'can_be_adjusted'; badgeColor = 'yellow'; label = 'Boleh (Kontrol Porsi)';
    }

    return {
        ...item,
        analysis: { score, category, label, badge_color: badgeColor, flags, notes }
    };
}

// --- API CALL ---
async function searchRecipes(query) {
    if (!API_KEY) return [];
    const params = new URLSearchParams({
        apiKey: API_KEY,
        query: query,
        addRecipeNutrition: true,
        number: 10
    });

    try {
        const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.results || []).map(item => ({
            id: item.id,
            name: item.title,
            image: item.image,
            ready_in_min: item.readyInMinutes || 0,
            source: 'spoonacular_recipe',
            raw: item,
            ...extractNutrients(item.nutrition || {})
        }));
    } catch (e) {
        console.error("Search Error:", e);
        return [];
    }
}

// --- ROUTE HANDLER ---
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ success: false, message: 'Query parameter "q" is required' }, { status: 400 });
    }

    const recipes = await searchRecipes(q);
    const evaluated = recipes.map(recipe => {
        const result = evaluateDiabetesRules(recipe);
        result.diabetes_friendly = (result.analysis.category === 'diabetes_friendly');
        return result;
    });

    return NextResponse.json({ success: true, items: evaluated });
}