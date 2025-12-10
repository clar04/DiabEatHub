// src/utils/api.js

// Key token di localStorage
const TOKEN_KEY = "authToken";
const DEFAULT_TIMEOUT_MS = 20000; // 20s

// ==========================
// BASE URL API BACKEND
// ==========================
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  "http://127.0.0.1:8000/api";

console.log("API_BASE =", API_BASE);

// ---------------------
// Token helpers
// ---------------------
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// ---------------------
// Fetch dengan timeout
// ---------------------
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

// ---------------------
// Wrapper utama API
// ---------------------
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

    let body = options.body;
    if (!isFormData && body && typeof body === "object") {
      body = JSON.stringify(body);
    }

    const url = `${API_BASE}${path}`;

    const res = await fetchWithTimeout(url, {
      ...options,
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : body,
    });

    // Kalau status bukan 2xx → lempar error
    if (!res.ok) {
      let detail = null;
      try {
        detail = await res.json();
      } catch (_) {
        // abaikan kalau bukan JSON
      }

      const message =
        detail?.message ||
        detail?.error ||
        detail?.detail ||
        `HTTP ${res.status}`;

      if (res.status === 401) setAuthToken(null);

      const err = new Error(message);
      err.status = res.status;
      err.detail = detail;
      throw err;
    }

    // 204 No Content
    if (res.status === 204) return null;

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

// =============================
// AUTH: register / login / me
// =============================

export async function authRegister(username, password) {
  const data = await apiFetch("/register", {
    method: "POST",
    body: { username, password },
  });
  return data;
}

export async function authLogin(username, password) {
  const data = await apiFetch("/login", {
    method: "POST",
    body: { username, password },
  });
  if (data?.token) setAuthToken(data.token);
  return data;
}

export async function authMe() {
  return await apiFetch("/me", { method: "GET" });
}

export async function authLogout() {
  try {
    await apiFetch("/logout", { method: "POST" });
  } finally {
    setAuthToken(null);
  }
}

// =============================
// FOOD CHECK (Sekarang Unified Spoonacular)
// =============================

// GET /food/check?q=...
// Return: Single Object (karena backend mencari best match ingredient)
export async function checkFood(query) {
  const json = await apiFetch(`/food/check?q=${encodeURIComponent(query)}`, {
    method: "GET",
  });

  // Backend sekarang mengembalikan { success: true, data: { ... } }
  // Kita kembalikan langsung object datanya
  return json?.data || null;
}

// GET /history/food
export async function getFoodHistory() {
  const json = await apiFetch("/history/food", { method: "GET" });

  // Backend returns { success: true, data: [...] }
  // Kita map agar kompatibel dengan FoodCheckPanel history list
  const list = json?.data || json?.items || [];

  return list.map((h) => {
    // result adalah JSON yang disimpan di DB (struktur baru dengan analysis)
    const r = h.result || {};
    const analysis = r.analysis || {};

    return {
      id: h.id,
      query: h.query,
      createdAt: h.created_at,

      // Mapping untuk list UI
      name: r.name,
      unit: "1 serving",
      carbs: r.carbs_g,
      sugar: r.sugar_g,
      diabetesFlag: analysis.label, // Ambil label dari analysis

      // Simpan raw result untuk detail jika perlu
      result: r,
    };
  });
}

// =============================
// PRODUCT CHECK (Sekarang Spoonacular Products)
// =============================

// GET /products/search?q=...
// Return: Single Object
export async function searchProductsOFF(keyword) {
  // Note: Nama fungsi saya biarkan searchProductsOFF agar tidak error di import lain, 
  // tapi logicnya sudah pakai endpoint Spoonacular baru.

  const json = await apiFetch(
    `/products/search?q=${encodeURIComponent(keyword)}`,
    { method: "GET" }
  );

  // Backend mengembalikan { success: true, data: { ... } }
  return json?.data || null;
}


// =============================
// RECIPES (Spoonacular wrapper)
// =============================

// GET /recipes/diabetes
export async function getDiabetesRecipes(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });

  const json = await apiFetch(`/recipes/diabetes?${qs.toString()}`, {
    method: "GET",
  });

  // Backend list resep masih mengembalikan array di 'items'
  if (!json?.success || !Array.isArray(json.items)) return [];

  // Pass-through items karena Controller sudah menormalisasi data
  return json.items;
}

// GET /recipes/{id}
export async function getRecipeDetail(id) {
  const json = await apiFetch(`/recipes/${id}`, { method: "GET" });

  if (!json?.success || !json.item) {
    throw new Error("Recipe not found");
  }

  // Backend mengembalikan struktur:
  // { success: true, item: { diabetes: {...evaluated_data}, raw: {...spoonacular_raw} } }
  // Kita kembalikan full object 'item' agar Frontend bisa akses item.diabetes.analysis
  return json;
}