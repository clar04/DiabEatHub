// src/components/recipes/RecipeModal.jsx
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function RecipeModal({ open, onClose, recipe }) {
  if (!open || !recipe) return null;

  const r = recipe;

  // ===== MACROS (sesuai permintaan) =====
  const kcal = r.kcal ?? r.calories ?? "-";
  const carbs = r.carbs ?? r.carb ?? "-";
  const sugar = r.sugar ?? "-";
  const fiber = r.fiber ?? "-";
  const sodium = r.sodium ?? r.sodium_mg ?? "-";

  // Ingredients
  const ingredients =
    r.ingredients ??
    r.raw?.ingredients ??
    r.raw?.extendedIngredients?.map((i) => i.original || i.name) ??
    [];

  // Instructions
  const steps =
    r.steps ??
    r.raw?.steps ??
    r.raw?.analyzedInstructions?.[0]?.steps?.map((s) => s.step) ??
    [];

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
          <h2 className="text-3xl font-semibold">{r.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cook: {r.cookTime ?? "-"} min • Porsi: {r.servings ?? "-"}
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
                <p className="text-sm text-slate-500">No ingredients data.</p>
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
                <p className="text-sm text-slate-500">No instructions available.</p>
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
