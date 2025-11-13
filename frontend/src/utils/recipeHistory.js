const KEY = "smc_recipe_history_v1";

export function readRecipeHistory() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// item minimal yg disimpan ke history (plus resep lengkap)
function toHistoryItem(recipe) {
  if (!recipe) return null;

  return {
    // ringkasan untuk list
    id: recipe.id,
    title: recipe.title,
    kcal: recipe.kcal,
    carbs: recipe.carbs,
    sugar: recipe.sugar,
    protein: recipe.protein,
    fat: recipe.fat,
    cookTime: recipe.cookTime,
    flag: recipe.flag, 
    badge: recipe.badge,
    savedAt: new Date().toISOString(),

    recipe: {
      id: recipe.id,
      title: recipe.title,
      cookTime: recipe.cookTime,
      kcal: recipe.kcal,
      carbs: recipe.carbs,
      sugar: recipe.sugar,
      protein: recipe.protein,
      fat: recipe.fat,
      flag: recipe.flag,
      badge: recipe.badge,
      ingredients: [...(recipe.ingredients || [])],
      steps: [...(recipe.steps || [])],
      notes: recipe.notes || "",
    },
  };
}

export function pushRecipeHistory(recipe) {
  if (typeof window === "undefined") return;
  const item = toHistoryItem(recipe);
  if (!item || !item.id) return;

  const current = readRecipeHistory();

  // buang duplikat id yang sama
  const filtered = current.filter((r) => r.id !== item.id);

  // tambah di depan, batasi 10
  const next = [item, ...filtered].slice(0, 10);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearRecipeHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
