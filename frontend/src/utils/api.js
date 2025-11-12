const BASE = "/api"; // sesuaikan bila perlu

async function http(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: "include",
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// Food
export const getFoodCheck = (q) => http(`/food/check?q=${encodeURIComponent(q)}`);

// Products
export const searchProducts = (q) => http(`/products/search?q=${encodeURIComponent(q)}`);

// Recipes
export const getRecipes = (maxCarbs) => http(`/recipes/diabetes?maxCarbs=${maxCarbs ?? ""}`);
export const getRecipeDetail = (id) => http(`/recipes/${encodeURIComponent(id)}`);

// History
export const getFoodHistory = () => http(`/history/food`);

// Auth (opsional)
export const login = (payload) => http(`/login`, { method: "POST", body: JSON.stringify(payload) });
export const register = (payload) => http(`/register`, { method: "POST", body: JSON.stringify(payload) });
export const me = () => http(`/me`);

export default {
  getFoodCheck, searchProducts, getRecipes, getRecipeDetail, getFoodHistory, login, register, me,
};
