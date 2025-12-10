// src/components/recipes/RecipeModal.jsx
import Card from "../ui/Card";

export default function RecipeModal({
  open,
  onClose,
  recipe,
  loading = false,
  error = "",
}) {
  // kalau modal belum dibuka sama sekali
  if (!open) return null;

  // saat masih loading detail
  if (loading && !recipe) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md px-4">
          <Card className="rounded-3xl bg-white p-6 text-center text-slate-700">
            <p className="text-sm">Mengambil detail resep…</p>
          </Card>
        </div>
      </div>
    );
  }

  // kalau ada error load detail
  if (error && !recipe) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md px-4">
          <Card className="relative rounded-3xl bg-white p-6 text-slate-900">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-2">Gagal memuat detail</h2>
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const r = recipe;

  // ===== NORMALISASI MACROS DARI BACKEND =====
  const kcal = r.kcal ?? r.calories ?? 0;

  const carbs =
    r.carbs ??
    r.carb ??
    r.carbs_g ??
    r.carb_g ??
    (typeof r.carbs_g === "number" ? r.carbs_g : "-");

  const sugar =
    r.sugar ??
    r.sugar_g ??
    (typeof r.sugar_g === "number" ? r.sugar_g : "-");

  const fiber =
    r.fiber ??
    r.fiber_g ??
    (typeof r.fiber_g === "number" ? r.fiber_g : "-");

  const sodium =
    r.sodium ??
    r.sodium_mg ??
    r.sodiumMg ??
    (typeof r.sodium_mg === "number" ? r.sodium_mg : "-");

  const title = r.title || r.name || "Recipe";

  const cookTime = r.cookTime ?? r.ready_in_min ?? r.readyInMinutes ?? "-";
  const servings = r.servings ?? r.serving ?? "-";

  // Ingredients
  let ingredients = [];
  if (Array.isArray(r.ingredients) && r.ingredients.length > 0) {
    ingredients = r.ingredients;
  } else if (Array.isArray(r.raw?.ingredients)) {
    ingredients = r.raw.ingredients.map(
      (i) => i.original || i.name || String(i)
    );
  } else if (Array.isArray(r.raw?.extendedIngredients)) {
    ingredients = r.raw.extendedIngredients.map(
      (i) => i.original || i.name || String(i)
    );
  }

  // Instructions
  let steps = [];
  if (Array.isArray(r.steps) && r.steps.length > 0) {
    steps = r.steps;
  } else if (Array.isArray(r.raw?.steps)) {
    steps = r.raw.steps;
  } else if (
    Array.isArray(r.raw?.analyzedInstructions) &&
    r.raw.analyzedInstructions[0]?.steps
  ) {
    steps = r.raw.analyzedInstructions[0].steps.map((s) => s.step);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl px-4">
        {/* BACKGROUND PUTIH */}
        <Card className="relative rounded-3xl bg-white p-8 text-slate-900">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-3xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cook: {cookTime} min • Porsi: {servings}
          </p>

          {/* ===== MACRO BOXES ===== */}
          <div className="mt-6 grid gap-4 sm:grid-cols-5">
            <Macro label="Kcal" value={kcal} />
            <Macro label="Carbs" value={`${carbs} g`} />
            <Macro label="Sugar" value={`${sugar} g`} />
            <Macro label="Fiber" value={`${fiber} g`} />
            <Macro label="Sodium" value={`${sodium} mg`} />
          </div>

          {/* Content */}
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {/* Ingredients */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              {ingredients.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No ingredients data from server.
                </p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>

            {/* Instructions */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Instructions</h3>
              {steps.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No instructions available from server.
                </p>
              ) : (
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border border-emerald-500
                bg-white
                px-6 py-2.5
                text-sm font-medium
                text-emerald-700
                transition
                hover:bg-emerald-600
                hover:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500/40
              "
            >
              Tutup
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===== Macro Box ===== */
function Macro({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
