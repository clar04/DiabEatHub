// src/utils/api.js

// Key token di localStorage
const TOKEN_KEY = "authToken";
const DEFAULT_TIMEOUT_MS = 20000; // 20s

// ==========================
// BASE URL API BACKEND
// ==========================
// Pastikan port sesuai dengan tempat Backend Next.js kamu berjalan (biasanya 3001 jika frontend 3000)
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  "http://localhost:3001/api";

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

export async function authRegister(email, password) {
  const data = await apiFetch("/register", {
    method: "POST",
    body: { email, password },
  });
  return data;
}

export async function authLogin(email, password) {
  const data = await apiFetch("/login", {
    method: "POST",
    body: { email, password },
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
// FOOD CHECK (Untuk Natural Language / Input Manual)
// =============================

export async function checkFood(query) {
  const json = await apiFetch(`/food/check?q=${encodeURIComponent(query)}`, {
    method: "GET",
  });
  // Pastikan ambil data yang benar sesuai respon backend kamu
  return json?.data || null;
}

export async function getFoodHistory() {
  const json = await apiFetch("/history/food", { method: "GET" });
  const list = json?.data || json?.items || [];

  return list.map((h) => {
    const r = h.result || {};
    const analysis = r.analysis || {};

    return {
      id: h.id,
      query: h.query,
      createdAt: h.created_at,
      name: r.name,
      unit: "1 serving",
      carbs: r.carbs_g,
      sugar: r.sugar_g,
      diabetesFlag: analysis.label,
      result: r,
    };
  });
}

// =============================
// PRODUCT SEARCH (YANG DIPERBAIKI)
// =============================

// Saya rename jadi searchProducts agar lebih clean (sesuaikan import di komponen kamu jika perlu)
// Atau biarkan searchProductsOFF jika malas ubah import
export async function searchProducts(keyword) {
  const json = await apiFetch(
    `/products/search?q=${encodeURIComponent(keyword)}`,
    { method: "GET" }
  );

  // PERBAIKAN: Ambil .items karena backend mengembalikan { success: true, items: [...] }
  // Dan return default [] agar map di frontend tidak error
  return json?.items || [];
}

// =============================
// RECIPES
// =============================

export async function getDiabetesRecipes(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });

  const json = await apiFetch(`/recipes/diabetes?${qs.toString()}`, {
    method: "GET",
  });

  if (!json?.success || !Array.isArray(json.items)) return [];
  return json.items;
}

export async function getRecipeDetail(id) {
  const json = await apiFetch(`/recipes/${id}`, { method: "GET" });

  if (!json?.success || !json.item) {
    throw new Error("Recipe not found");
  }
  return json;
}