const NUTRITIONIX_APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;
const SPOONACULAR_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const OFF_BASE = import.meta.env.VITE_OFF_BASE_URL || "https://world.openfoodfacts.org";

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

/* ============================================
   1) Nutritionix – Food Check
   Mengembalikan ARRAY makanan
=============================================== */

export async function checkFoodNutritionix(query) {
  const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";

  const body = { query };

  const json = await safeFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": NUTRITIONIX_APP_ID,
      "x-app-key": NUTRITIONIX_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!json.foods || json.foods.length === 0) return [];

  return json.foods.map((f) => ({
    name: f.food_name,
    serving: `${f.serving_qty} ${f.serving_unit}`,
    nutr: {
      kcal: Math.round(f.nf_calories || 0),
      protein: Math.round(f.nf_protein || 0),
      fat: Math.round(f.nf_total_fat || 0),
      carb: Math.round(f.nf_total_carbohydrate || 0),
      sugar: Math.round(f.nf_sugars || 0),
      sodium: Math.round(f.nf_sodium || 0),
    },
    raw: f,
  }));
}

/* ============================================
   2) Spoonacular – Diabetes-Friendly Recipes
=============================================== */

// List resep diabetes-friendly
export async function getDiabetesRecipes() {
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_KEY}&number=12&maxCarbs=40&addRecipeNutrition=true`;

  const json = await safeFetch(url);

  return (json.results || []).map((r) => ({
    id: r.id,
    title: r.title,
    cookTime: r.readyInMinutes,
    kcal: Math.round(
      r.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || 0
    ),
    carbs: Math.round(
      r.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")?.amount || 0
    ),
    sugar: Math.round(
      r.nutrition?.nutrients?.find((n) => n.name === "Sugar")?.amount || 0
    ),
    protein: Math.round(
      r.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount || 0
    ),
    fat: Math.round(
      r.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount || 0
    ),
    image: r.image,
  }));
}

// Detail resep
export async function getRecipeDetail(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_KEY}&includeNutrition=true`;

  const r = await safeFetch(url);

  const carbs = Math.round(
    r.nutrition?.nutrients?.find((n) => n.name === "Carbohydrates")?.amount || 0
  );
  const sugar = Math.round(
    r.nutrition?.nutrients?.find((n) => n.name === "Sugar")?.amount || 0
  );
  const protein = Math.round(
    r.nutrition?.nutrients?.find((n) => n.name === "Protein")?.amount || 0
  );
  const fat = Math.round(
    r.nutrition?.nutrients?.find((n) => n.name === "Fat")?.amount || 0
  );
  const kcal = Math.round(
    r.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || 0
  );

  return {
    id: r.id,
    title: r.title,
    cookTime: r.readyInMinutes,
    servings: r.servings,
    image: r.image,

    carbs,
    sugar,
    protein,
    fat,
    kcal,

    ingredients: r.extendedIngredients?.map((i) => i.original) || [],
    steps:
      r.analyzedInstructions?.[0]?.steps?.map((s) => s.step) || [
        "Instruksi tidak tersedia.",
      ],
  };
}

/* ============================================
   3) Open Food Facts – Product Check
=============================================== */

// Search by keyword
export async function searchProductsOFF(keyword) {
  const url = `${OFF_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(
    keyword
  )}&search_simple=1&json=1`;

  const json = await safeFetch(url);

  return (json.products || []).slice(0, 10).map((p) => ({
    id: p._id || p.id || p.code,
    name: p.product_name || "Produk tanpa nama",
    brand: p.brands || "",
    nutriments: p.nutriments || {},
  }));
}
