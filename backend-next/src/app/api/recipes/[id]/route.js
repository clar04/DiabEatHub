import { NextResponse } from 'next/server';

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

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

function evaluateDiabetesRules(item) {
    const getVal = (val) => parseFloat(val) || 0;
    const n = {
        calories: getVal(item.calories), carbs_g: getVal(item.carbs_g),
        sugar_g: getVal(item.sugar_g), fiber_g: getVal(item.fiber_g),
    };

    let score = 0;
    // Logic scoring singkat
    if (n.carbs_g <= 45) score += 2;
    if (n.sugar_g <= 5) score += 2;
    if (n.fiber_g >= 5) score += 2;

    let category = 'not_recommended';
    let label = 'Kurang Ideal';
    let badgeColor = 'red';

    if (score >= 6) { category = 'diabetes_friendly'; label = 'Ramah Diabetes'; badgeColor = 'green'; }
    else if (score >= 4) { category = 'can_be_adjusted'; label = 'Boleh (Kontrol Porsi)'; badgeColor = 'yellow'; }

    return {
        ...item,
        analysis: { score, category, label, badge_color: badgeColor }
    };
}

async function getRecipeDetail(id) {
    if (!API_KEY) return null;
    const params = new URLSearchParams({ apiKey: API_KEY, includeNutrition: true });

    try {
        const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);
        if (!res.ok) return null;
        const data = await res.json();
        return {
            name: data.title,
            image: data.image || '',
            ready_in_min: data.readyInMinutes || 0,
            extendedIngredients: data.extendedIngredients || [],
            instructions: data.instructions || '',
            source: 'spoonacular_recipe',
            raw: data,
            ...extractNutrients(data.nutrition || {})
        };
    } catch (e) {
        console.error("Detail Error:", e);
        return null;
    }
}

export async function GET(request, { params }) {
    // Await params karena di Next.js versi baru params itu Promise
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const recipe = await getRecipeDetail(id);

    if (!recipe) {
        return NextResponse.json({ success: false, message: 'Recipe not found' }, { status: 404 });
    }

    const evaluated = evaluateDiabetesRules(recipe);

    return NextResponse.json({
        success: true,
        item: {
            diabetes: evaluated,
            raw: recipe.raw
        }
    });
}