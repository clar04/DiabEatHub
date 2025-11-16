const token = localStorage.getItem('authToken');
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function apiFetch(path, options = {}) {
  try {
    const headers = {
      ...options.headers,
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let detail = null;
      try {
        detail = await res.json();
      } catch (_) {
      }
      const message = detail?.detail || `HTTP ${res.status}`;
      throw new Error(message);
    }

    if (res.status === 204) return null; 
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

/* ============================================
   1) Food Check – /food/check
   (nama fungsi tetap: checkFoodNutritionix)
=============================================== */

/**
 * Cek makanan dari teks (misal: "rice", "1 bowl rice")
 * Backend response:
 * {
 *   "success": true,
 *   "items": [
 *     {
 *       "name": "rice",
 *       "serving": "100 g",
 *       "carbs_g": 28.4,
 *       "sugar_g": 0.1,
 *       "source": "api-ninjas",
 *       "diabetes_flag": "Watch Carbs",
 *       "notes": "Carbohydrates are high, control portion."
 *     }
 *   ]
 * }
 */
export async function checkFoodNutritionix(query) {
  const json = await apiFetch(
    `/food/check?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
    }
  );

  if (!json?.success || !Array.isArray(json.items)) return [];

  return json.items.map((item) => ({
    name: item.name,
    serving: item.serving,
    carbs: item.carbs_g,
    sugar: item.sugar_g,
    diabetesFlag: item.diabetes_flag,
    notes: item.notes,
    source: item.source,
    raw: item,
  }));
}

/**
 * History food – /history/food
 * Backend response:
 * {
 *   "success": true,
 *   "items": [
 *     {
 *       "id": 16,
 *       "query": "rice",
 *       "result": { ...food object... },
 *       "created_at": "...",
 *       "updated_at": "..."
 *     },
 *     ...
 *   ]
 * }
 */
export async function getFoodHistory() {
  const json = await apiFetch("/history/food", {
    method: "GET",
  });

  if (!json?.success || !Array.isArray(json.items)) return [];

  return json.items.map((h) => {
    const r = h.result || {};
    return {
      id: h.id,
      query: h.query,
      createdAt: h.created_at,
      updatedAt: h.updated_at,
      // hasil cek makanan yang disimpan di history
      result: {
        name: r.name,
        serving: r.serving,
        carbs: r.carbs_g,
        sugar: r.sugar_g,
        diabetesFlag: r.diabetes_flag,
        notes: r.notes,
        source: r.source,
        raw: r,
      },
      raw: h,
    };
  });
}

/* ============================================
   2) Products – /products/search
=============================================== */

/**
 * Cari produk makanan/minuman dari OpenFoodFacts (via backend)
 *
 * Backend response:
 * {
 *   "success": true,
 *   "items": [
 *     {
 *       "name": "...",
 *       "serving": "100 g",
 *       "carbs_g": 4.9,
 *       "sugar_g": 4.9,
 *       "ingredients": "...",
 *       "source": "openfoodfacts",
 *       "diabetes_flag": "OK",
 *       "notes": "..."
 *     },
 *     ...
 *   ]
 * }
 */
export async function searchProductsOFF(keyword) {
  const json = await apiFetch(
    `/products/search?q=${encodeURIComponent(keyword)}`,
    {
      method: "GET",
    }
  );

  if (!json?.success || !Array.isArray(json.items)) return [];

  return json.items.map((item) => ({
    name: item.name,
    serving: item.serving,
    carbs: item.carbs_g,
    sugar: item.sugar_g,
    ingredients: item.ingredients,
    diabetesFlag: item.diabetes_flag,
    notes: item.notes,
    source: item.source,
    raw: item,
  }));
}

/* ============================================
   3) Recipes – /recipes/diabetes & /recipes/{id}
=============================================== */

/**
 * List resep diabetes-friendly
 *
 * Backend response (/recipes/diabetes):
 * {
 *   "success": true,
 *   "items": [
 *     {
 *       "name": "Red Lentil Soup...",
 *       "ready_in_min": null,
 *       "carbs_g": 27.98,
 *       "sugar_g": 0,
 *       "source": "spoonacular",
 *       "diabetes_flag": "Watch Carbs",
 *       "notes": "...",
 *       "raw": {
 *         "id": 715415,
 *         "title": "...",
 *         "image": "...",
 *         "nutrition": {...}
 *       },
 *       "diabetes_friendly": false
 *     },
 *     ...
 *   ]
 * }
 */
export async function getDiabetesRecipes() {
  const json = await apiFetch("/recipes/diabetes", {
    method: "GET",
  });

  if (!json?.success || !Array.isArray(json.items)) return [];

  return json.items.map((item) => {
    const raw = item.raw || {};
    const cookTime =
      item.ready_in_min ?? raw.readyInMinutes ?? null;

    return {
      id: raw.id ?? null,
      title: raw.title || item.name,
      image: raw.image || null,
      cookTime,
      carbs: item.carbs_g,
      sugar: item.sugar_g,
      diabetesFlag: item.diabetes_flag,
      diabetesFriendly: item.diabetes_friendly,
      notes: item.notes,
      source: item.source,
      raw,
    };
  });
}

/**
 * Detail satu resep
 *
 * Backend response (/recipes/{id}):
 * {
 *   "success": true,
 *   "item": {
 *     "diabetes": {
 *       "name": "...",
 *       "carbs_g": 0,
 *       "sugar_g": 0,
 *       "source": "spoonacular",
 *       "extendedIngredients": [...],
 *       "diabetes_flag": "OK",
 *       "notes": "..."
 *     },
 *     "raw": {
 *       "id": 716406,
 *       "title": "...",
 *       "image": "...",
 *       "readyInMinutes": 20,
 *       "servings": 2,
 *       "extendedIngredients": [...],
 *       "analyzedInstructions": [...]
 *       ...
 *     }
 *   }
 * }
 */
export async function getRecipeDetail(id) {
  const json = await apiFetch(`/recipes/${id}`, {
    method: "GET",
  });

  if (!json?.success || !json.item) {
    throw new Error("Recipe not found");
  }

  const d = json.item.diabetes || {};
  const raw = json.item.raw || {};

  const ingredientsArr =
    d.extendedIngredients ||
    raw.extendedIngredients ||
    [];

  const ingredients =
    ingredientsArr.map((ing) => ing.original || ing.name);

  const steps =
    raw.analyzedInstructions?.[0]?.steps?.map((s) => s.step) ||
    ["Instructions not available."];

  return {
    id: raw.id ?? null,
    title: raw.title || d.name || "",
    image: raw.image || null,
    cookTime: raw.readyInMinutes ?? null,
    servings: raw.servings ?? null,

    carbs: d.carbs_g ?? 0,
    sugar: d.sugar_g ?? 0,
    diabetesFlag: d.diabetes_flag ?? null,
    notes: d.notes ?? "",
    source: d.source ?? "spoonacular",

    ingredients,
    steps,

    raw,
  };
}