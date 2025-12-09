import { useEffect, useMemo, useState } from "react";

const MEALPLAN_RECIPES_KEY = "smc_mealplan_recipes_v1";

function loadSavedRecipes() {
  try {
    const raw = localStorage.getItem(MEALPLAN_RECIPES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// normalisasi angka + fallback beberapa nama field
function normalizeRecipeMacros(r = {}) {
  const carbs =
    Number(r.carbs ?? r.carb ?? r.carbohydrates ?? 0) || 0;
  const sugar = Number(r.sugar ?? 0) || 0;
  const fiber = Number(r.fiber ?? r.fibre ?? 0) || 0;
  const kcal =
    Number(r.kcal ?? r.calories ?? r.energy ?? 0) || 0;

  return { kcal, carbs, sugar, fiber };
}

export default function MealPlan() {
  // list resep yang diambil dari tab Recipes (localStorage)
  const [recipes, setRecipes] = useState(() => loadSavedRecipes());

  // 3 atau 4 kali makan
  const [mealCount, setMealCount] = useState(3);

  // pilihan resep per slot
  const [selectedBySlot, setSelectedBySlot] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
    snack: null,
  });

  // refresh manual kalau user baru saja nambah resep dari Recipes
  const handleRefreshRecipes = () => {
    const loaded = loadSavedRecipes();
    setRecipes(loaded);

    // kalau sebelumnya belum ada pilihan, auto-isi slot pakai resep pertama
    if (loaded.length > 0) {
      setSelectedBySlot((prev) => ({
        breakfast: prev.breakfast ?? loaded[0]?.id ?? null,
        lunch: prev.lunch ?? loaded[1]?.id ?? loaded[0]?.id ?? null,
        dinner: prev.dinner ?? loaded[2]?.id ?? loaded[0]?.id ?? null,
        snack: prev.snack ?? loaded[3]?.id ?? loaded[0]?.id ?? null,
      }));
    }
  };

  // pertama kali mount → load resep
  useEffect(() => {
    handleRefreshRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // slot yang dipakai tergantung 3 / 4 meals
  const visibleSlots =
    mealCount === 4
      ? ["breakfast", "lunch", "snack", "dinner"]
      : ["breakfast", "lunch", "dinner"];

  // total harian dari resep terpilih di tiap slot
  const totals = useMemo(() => {
    const used = visibleSlots
      .map((slot) =>
        recipes.find((r) => r.id === selectedBySlot[slot])
      )
      .filter(Boolean);

    return used.reduce(
      (acc, r) => {
        const { kcal, carbs, sugar, fiber } = normalizeRecipeMacros(r);
        acc.kcal += kcal;
        acc.carbs += carbs;
        acc.sugar += sugar;
        acc.fiber += fiber;
        return acc;
      },
      { kcal: 0, carbs: 0, sugar: 0, fiber: 0 }
    );
  }, [visibleSlots, recipes, selectedBySlot]);

  const handleChangeSlot = (slot, recipeId) => {
    setSelectedBySlot((prev) => ({
      ...prev,
      [slot]: recipeId || null,
    }));
  };

  // kalau belum ada resep yg disimpan dari Recipes
  if (!recipes.length) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm font-semibold text-slate-900">
            Meal Plan
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Belum ada resep yang ditambahkan dari tab{" "}
            <span className="font-semibold">Recipes</span>.
            Buka tab Recipes, pilih menu, lalu klik
            {" "}
            <span className="font-semibold">Add to Meal Plan</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* === Toggle 3 / 4 Meals + Refresh === */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setMealCount(3)}
          className={
            "px-5 py-2.5 rounded-full text-sm font-medium transition " +
            (mealCount === 3
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100")
          }
        >
          3 Meals/Day
        </button>
        <button
          type="button"
          onClick={() => setMealCount(4)}
          className={
            "px-5 py-2.5 rounded-full text-sm font-medium transition " +
            (mealCount === 4
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100")
          }
        >
          4 Meals/Day
        </button>

        <button
          type="button"
          onClick={handleRefreshRecipes}
          className="ml-auto rounded-full border border-emerald-600 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Refresh from Recipes
        </button>
      </div>

      {/* === Meal Cards 2 Kolom === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleSlots.map((slot) => (
          <MealSlotCard
            key={slot}
            slot={slot}
            recipes={recipes}
            selectedId={selectedBySlot[slot]}
            onChange={handleChangeSlot}
          />
        ))}
      </div>

      {/* === Ringkasan sederhana (opsional) === */}
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4">
        <p className="text-sm font-semibold text-slate-900 mb-2">
          Daily Totals (from selected meals)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <SummaryPill label="Calories" value={`${Math.round(totals.kcal)} cal`} />
          <SummaryPill label="Carbs" value={`${Math.round(totals.carbs)} g`} />
          <SummaryPill label="Sugar" value={`${Math.round(totals.sugar)} g`} />
          <SummaryPill label="Fiber" value={`${Math.round(totals.fiber)} g`} />
        </div>
      </div>

      {/* === Bottom Buttons === */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button
          type="button"
          className="flex-1 rounded-full bg-emerald-700 text-white py-3 text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
        >
          Save Meal Plan
        </button>
        <button
          type="button"
          className="flex-1 rounded-full border border-emerald-700 text-emerald-700 py-3 text-sm font-semibold hover:bg-emerald-50 transition"
          onClick={() => {
            // randomize plan pakai resep yang tersedia
            setSelectedBySlot((prev) => {
              if (!recipes.length) return prev;
              const rand = () =>
                recipes[Math.floor(Math.random() * recipes.length)]?.id ?? null;
              return {
                breakfast: rand(),
                lunch: rand(),
                dinner: rand(),
                snack: rand(),
              };
            });
          }}
        >
          Generate New Plan
        </button>
      </div>
    </div>
  );
}

/* ====== sub components ====== */

const SLOT_LABEL = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

function MealSlotCard({ slot, recipes, selectedId, onChange }) {
  const label = SLOT_LABEL[slot] ?? slot;
  const selectedRecipe =
    recipes.find((r) => r.id === selectedId) || recipes[0];

  const { kcal, carbs, sugar, fiber } = normalizeRecipeMacros(selectedRecipe);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-sm font-semibold text-slate-900 mb-3">{label}</p>

      {/* Select resep */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
        <select
          className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-900 focus:outline-none"
          value={selectedRecipe?.id ?? ""}
          onChange={(e) => onChange(slot, e.target.value)}
        >
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title || r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Detail nutrisi */}
      <div className="mt-3 space-y-1 text-xs sm:text-sm text-slate-700">
        <Row label="Calories:" value={`${Math.round(kcal)} cal`} />
        <Row label="Carbs:" value={`${Math.round(carbs)} g`} />
        <Row label="Sugar:" value={`${Math.round(sugar)} g`} />
        <Row label="Fiber:" value={`${Math.round(fiber)} g`} />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
      <p className="text-[11px] text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-emerald-700">{value}</p>
    </div>
  );
}
