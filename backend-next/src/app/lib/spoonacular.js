// src/lib/spoonacular.js

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Helper untuk ambil nutrisi tertentu saja (sama seperti di PHP kamu)
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
    // Set default 0
    Object.values(map).forEach(key => result[key] = 0);

    nutrients.forEach(n => {
        if (map[n.name]) {
            result[map[n.name]] = n.amount;
        }
    });

    return result;
}

// === PUBLIC FUNCTIONS ===

export async function fetchDiabetesRecipes(maxCarbs = 30) {
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
            raw: item, // Simpan raw data untuk logic diabetes
            ...extractNutrients(item.nutrition || {})
        }));
    } catch (e) {
        console.error("Spoonacular Error:", e);
        return [];
    }
}

export async function searchRecipes(query) {
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
        console.error("Spoonacular Search Error:", e);
        return [];
    }
}

export async function getRecipeDetail(id) {
    const params = new URLSearchParams({
        apiKey: API_KEY,
        includeNutrition: true
    });

    try {
        const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);
        if (!res.ok) return null;

        const data = await res.json();
        const nutrition = extractNutrients(data.nutrition || {});

        return {
            name: data.title,
            image: data.image || '',
            ready_in_min: data.readyInMinutes || 0,
            extendedIngredients: data.extendedIngredients || [],
            instructions: data.instructions || '',
            source: 'spoonacular_recipe',
            raw: data, // Simpan raw
            ...nutrition
        };

    } catch (e) {
        console.error("Detail Error:", e);
        return null;
    }
}