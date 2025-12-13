// src/pages/Recipes.jsx
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { useProfile } from "../state/ProfileContext";
import { useGoal } from "../state/GoalContext";

import RecipeModal from "../components/recipes/RecipeModal";
import { getDiabetesRecipes } from "../utils/api";

const MEALPLAN_RECIPES_KEY = "smc_mealplan_recipes_v1";

// baca daftar resep yang sudah disimpan untuk Meal Plan
function loadMealplanRecipes() {
  try {
    const raw = localStorage.getItem(MEALPLAN_RECIPES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// simpan daftar resep ke localStorage
function saveMealplanRecipes(list) {
  try {
    localStorage.setItem(MEALPLAN_RECIPES_KEY, JSON.stringify(list));
  } catch {
    // kalau gagal, diamkan saja (misal storage penuh)
  }
}

export default function Recipes() {
  const { profile } = useProfile();
  const { settings } = useGoal();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null);

  // --- LOAD DATA DARI BACKEND (SPOONACULAR WRAPPER) ---
  async function loadRecipes() {
    setLoading(true);
    setErr("");
    setRecipes([]);

    try {
      const items = await getDiabetesRecipes({
        goal: settings.goal, // "loss" | "maintain" | "gain"
        activity: settings.activity, // "sedentary" | "light" | ...
        sex: profile?.sex,
        age: profile?.age,
        height: profile?.height,
        weight: profile?.weight,
      });

      // normalisasi field supaya konsisten ke frontend & MealPlan
      const normalized = (Array.isArray(items) ? items : []).map((item) => {
        const kcal = Number(item.kcal ?? item.calories ?? 0) || 0;
        const carbs =
          Number(
            item.carbs ??
              item.carb ??
              item.carbs_g ??
              item.carbohydrates ??
              0
          ) || 0;
        const sugar = Number(item.sugar ?? item.sugar_g ?? 0) || 0;
        const fiber = Number(item.fiber ?? item.fiber_g ?? item.fibre ?? 0) || 0;
        const sodium = Number(item.sodium ?? item.sodium_mg ?? 0) || 0;

        return {
          ...item,
          id: item.id,
          title: item.title || item.name || "Untitled Recipe",
          kcal,
          carbs,
          sugar,
          fiber,
          sodium,
        };
      });

      setRecipes(normalized);
    } catch (e) {
      setErr(e.message || "Gagal mengambil data resep dari server.");
    } finally {
      setLoading(false);
    }
  }

  // tambahkan resep ke Meal Plan (disimpan untuk menu besok)
  function handleAddToMealPlan(recipe) {
    if (!recipe || !recipe.id) return;

    const current = loadMealplanRecipes();

    // kalau sudah ada dengan id yang sama, jangan dobel
    const exists = current.some((r) => r.id === recipe.id);
    if (!exists) {
      current.push(recipe);
      saveMealplanRecipes(current);
    }

    alert("Resep ditambahkan ke Meal Plan untuk menu besok ✅");
  }

  // auto load saat goal/activity berubah atau pertama kali buka tab Recipes
  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.goal, settings.activity]);

  return (
    <div className="space-y-4">
      {/* HEADER ATAS */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Recipes</h2>
          <p className="text-sm text-slate-600">
            Rekomendasi menu yang disesuaikan dengan target kalori dan gula kamu.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRecipes}
          className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
        >
          Refresh
        </button>
      </div>

      {/* STATE: LOADING / ERROR / EMPTY */}
      {loading && (
        <div className="py-10 text-center text-sm text-slate-600 animate-pulse">
          Mengambil resep dari Spoonacular...
        </div>
      )}

      {err && !loading && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && recipes.length === 0 && (
        <div className="py-10 text-center text-sm text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
          Belum ada rekomendasi resep. Coba ganti goal di Home atau klik
          <button
            type="button"
            onClick={loadRecipes}
            className="ml-1 text-emerald-700 underline underline-offset-2"
          >
            refresh
          </button>
          .
        </div>
      )}

      {/* LIST KARTU RESEP */}
      {!loading && !err && recipes.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => {
            const friendly =
              r.analysis?.label &&
              /friendly|ramah/i.test(r.analysis.label);

            return (
              <article
                key={r.id ?? r.title}
                className="w-full text-left rounded-3xl bg-[#E6F5EC] border border-emerald-100 p-5 hover:shadow-md hover:border-emerald-300 transition cursor-pointer"
                onClick={() => setSelected(r)}
              >
                {/* Title + status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {r.title}
                    </h3>
                    {r.analysis?.label && (
                      <p className="mt-1 text-xs text-slate-600">
                        {r.analysis.label}
                      </p>
                    )}
                  </div>

                  {friendly && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      Friendly
                    </div>
                  )}
                </div>

                {/* CARD KALORI PUTIH DI DALAM */}
                <div className="mt-4 rounded-2xl bg-white border border-emerald-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600">
                        Calories & Nutrients
                      </p>
                      <p className="mt-1 text-xs text-slate-700">
                        Carbs:{" "}
                        <span className="font-semibold">
                          {r.carbs} g
                        </span>
                        <br />
                        Fiber:{" "}
                        <span className="font-semibold">
                          {r.fiber} g
                        </span>
                        <br />
                        Sugar:{" "}
                        <span className="font-semibold">
                          {r.sugar} g
                        </span>
                        <br />
                        Sodium:{" "}
                        <span className="font-semibold">
                          {r.sodium} mg
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {r.kcal}
                      </p>
                      <p className="text-xs text-slate-500">kcal</p>
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(r);
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-transparent hover:bg-emerald-50"
                  >
                    See More →
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToMealPlan(r);
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    Add to Meal Plan
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* MODAL DETAIL */}
      <RecipeModal
        open={!!selected}
        onClose={() => setSelected(null)}
        recipe={selected}
      />
    </div>
  );
}
