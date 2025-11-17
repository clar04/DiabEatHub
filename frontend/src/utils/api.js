// api.js
// ======================================================
// Centralized fetch wrapper + helpers for Laravel Sanctum
// ======================================================

const TOKEN_KEY = "authToken";
const DEFAULT_TIMEOUT_MS = 20000; // 20s

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// ---- Token helpers ----
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// ---- Internal: fetch with timeout ----
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ---- Core wrapper ----
export async function apiFetch(path, options = {}) {
  try {
    const method = (options.method || "GET").toUpperCase();
    const token = getAuthToken();
    const isFormData = options.body instanceof FormData;

    const baseHeaders = {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const headers = {
      ...baseHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    // Auto stringify JSON body
    let body = options.body;
    if (!isFormData && body && typeof body === "object") {
      body = JSON.stringify(body);
    }

    const res = await fetchWithTimeout(`${API_BASE}${path}`, {
      ...options,
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : body,
    });

    // Non-OK → parse error body if possible
    if (!res.ok) {
      let detail = null;
      try {
        detail = await res.json();
      } catch (_) {
        // ignore parse error
      }

      const message =
        detail?.message ||
        detail?.error ||
        detail?.detail ||
        `HTTP ${res.status}`;

      // Optional: auto-clear token when unauthorized
      if (res.status === 401) setAuthToken(null);

      const err = new Error(message);
      err.status = res.status;
      err.detail = detail;
      throw err;
    }

    // No content
    if (res.status === 204) return null;

    // Try JSON, fallback text
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await res.json();
    } else {
      const text = await res.text();
      return text;
    }
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

// ======================================================
// Auth helpers (Laravel Sanctum Bearer token style)
// ======================================================

/**
 * Register → { success, user:{id,name}, token }
 */
export async function authRegister(username, password) {
  const data = await apiFetch("/register", {
    method: "POST",
    body: { username, password },
  });
  if (data?.token) setAuthToken(data.token);
  return data;
}

/**
 * Login → { success, user:{id,name}, token }
 */
export async function authLogin(username, password) {
  const data = await apiFetch("/login", {
    method: "POST",
    body: { username, password },
  });
  if (data?.token) setAuthToken(data.token);
  return data;
}

/**
 * Me (protected) → { success, user:{id,name} }
 */
export async function authMe() {
  return await apiFetch("/me", { method: "GET" });
}

/**
 * Logout (protected) → { success, message }
 */
export async function authLogout() {
  try {
    await apiFetch("/logout", { method: "POST" });
  } finally {
    setAuthToken(null);
  }
}

// ======================================================
/* 1) Food Check – /food/check
   BE should accept ?q=... (or alias of ?query=...) */
// ======================================================
export async function checkFoodNutritionix(query) {
  const json = await apiFetch(`/food/check?q=${encodeURIComponent(query)}`, {
    method: "GET",
  });

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

// ======================================================
/* History – /history/food (public or protected, sesuai BE) */
// ======================================================
export async function getFoodHistory() {
  const json = await apiFetch("/history/food", { method: "GET" });
  if (!json?.success || !Array.isArray(json.items)) return [];
  return json.items.map((h) => {
    const r = h.result || {};
    return {
      id: h.id,
      query: h.query,
      createdAt: h.created_at,
      updatedAt: h.updated_at,
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

// ======================================================
/* 2) Products – /products/search (OpenFoodFacts) */
// ======================================================
export async function searchProductsOFF(keyword) {
  const json = await apiFetch(
    `/products/search?q=${encodeURIComponent(keyword)}`,
    { method: "GET" }
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

// ======================================================
/* 3) Recipes – /recipes/diabetes, /recipes/search, /recipes/{id} */
// ======================================================

/**
 * List diabetes-friendly (server-driven filter)
 */
export async function getDiabetesRecipes(params = {}) {
  // allow optional params like { maxCarbs: 30, readyIn: 30 }
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const queryStr = qs.toString() ? `?${qs.toString()}` : "";

  const json = await apiFetch(`/recipes/diabetes${queryStr}`, {
    method: "GET",
  });

  if (!json?.success || !Array.isArray(json.items)) return [];
  return json.items.map((item) => {
    const raw = item.raw || {};
    const cookTime = item.ready_in_min ?? raw.readyInMinutes ?? null;
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
 * Free-text recipe search (client-driven query)
 * Requires backend endpoint: GET /recipes/search?q=...
 */
export async function searchRecipes(query, limit = 10) {
  const qs = new URLSearchParams();
  qs.set("q", query);
  if (limit) qs.set("limit", String(limit));

  const json = await apiFetch(`/recipes/search?${qs.toString()}`, {
    method: "GET",
  });

  if (!json?.success || !Array.isArray(json.items)) return [];
  return json.items.map((item) => {
    const raw = item.raw || {};
    const cookTime = item.ready_in_min ?? raw.readyInMinutes ?? null;
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
 */
export async function getRecipeDetail(id) {
  const json = await apiFetch(`/recipes/${id}`, { method: "GET" });

  if (!json?.success || !json.item) throw new Error("Recipe not found");

  const d = json.item.diabetes || {};
  const raw = json.item.raw || {};

  const ingredientsArr = d.extendedIngredients || raw.extendedIngredients || [];
  const ingredients = ingredientsArr.map((ing) => ing.original || ing.name);

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
