// src/pages/Recipes.jsx
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { useProfile } from "../state/ProfileContext";
import { useGoal } from "../state/GoalContext";

import RecipeModal from "../components/recipes/RecipeModal";
import { getDiabetesRecipes } from "../utils/api";

export default function Recipes() {
  const { profile } = useProfile();
  const { settings } = useGoal();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null);

  // --- LOAD DATA DARI BACKEND (LARAVEL SPOONACULAR WRAPPER) ---
  async function loadRecipes() {
    setLoading(true);
    setErr("");
    setRecipes([]);

    try {
      // param disesuaikan dengan backend-mu
      const items = await getDiabetesRecipes({
        goal: settings.goal,
        activity: settings.activity,
        sex: profile?.sex,
        age: profile?.age,
        height: profile?.height,
        weight: profile?.weight,
      });

      // backend balikin { success, items: [...] }
      setRecipes(Array.isArray(items) ? items : []);
    } catch (e) {
      setErr(e.message || "Gagal mengambil data resep dari server.");
    } finally {
      setLoading(false);
    }
  }

  // auto load saat goal / activity berubah atau pertama kali buka tab Recipes
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
            // ====== MAPPING KE FIELD JSON BACKEND ======
            // JSON: name, calories, carbs_g, sugar_g, fiber_g, fat_g, saturated_fat_g, sodium_mg
            const title = r.name || r.title || "Untitled recipe";

            const kcal =
              r.calories ??
              r.kcal ??
              (typeof r.calories === "number" ? r.calories : "-");

            const carbs =
              r.carbs_g ??
              r.carb ??
              r.carbs ??
              (typeof r.carbs_g === "number" ? r.carbs_g : "-");

            const sugar =
              r.sugar_g ??
              r.sugar ??
              (typeof r.sugar_g === "number" ? r.sugar_g : "-");

            const fiber =
              r.fiber_g ??
              r.fiber ??
              (typeof r.fiber_g === "number" ? r.fiber_g : "-");

            const sodium =
              r.sodium_mg ??
              r.sodium ??
              (typeof r.sodium_mg === "number" ? r.sodium_mg : "-");

            const friendly =
              r.diabetes_friendly === true ||
              r.analysis?.badge_color === "green" ||
              /ramah|friendly/i.test(r.analysis?.label || "");

            return (
              <button
                key={r.id ?? title}
                type="button"
                onClick={() => setSelected(r)}
                className="w-full text-left rounded-3xl bg-[#E6F5EC] border border-emerald-100 p-5 hover:shadow-md hover:border-emerald-300 transition"
              >
                {/* Title + badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {title}
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

                {/* CARD KALORI PUTIH */}
                <div className="mt-4 rounded-2xl bg-white border border-emerald-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-600">
                        Calories & Nutrients
                      </p>
                      <p className="mt-1 text-xs text-slate-700">
                        Carbs:{" "}
                        <span className="font-semibold">
                          {carbs}
                          {carbs === "-" ? "" : " g"}
                        </span>
                        <br />
                        Fiber:{" "}
                        <span className="font-semibold">
                          {fiber}
                          {fiber === "-" ? "" : " g"}
                        </span>
                        <br />
                        Sugar:{" "}
                        <span className="font-semibold">
                          {sugar}
                          {sugar === "-" ? "" : " g"}
                        </span>
                        <br />
                        Sodium:{" "}
                        <span className="font-semibold">
                          {sodium}
                          {sodium === "-" ? "" : " mg"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {kcal}
                      </p>
                      <p className="text-xs text-slate-500">kcal</p>
                    </div>
                  </div>
                </div>

                {/* See more */}
                <div className="mt-4 pt-3 border-t border-emerald-200 flex justify-center">
                  <span className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-5 py-1.5 text-xs font-semibold text-emerald-700 bg-transparent hover:bg-emerald-50">
                    See More →
                  </span>
                </div>
              </button>
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
